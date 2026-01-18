/**
 * Upload Lodge Images to CMS CDN and Update Home Page
 *
 * Run with: npx tsx scripts/upload-lodge-images.ts
 */

import sharp from "sharp";

const CMS_URL = "https://backend-production-162b.up.railway.app/graphql";
const ORGANIZATION_ID = "d146dc11-c3ff-4476-b725-1510f245b0ed";
const PAGE_CONTENT_TYPE_ID = "07c14638-aced-4140-aa25-b7658ed17639";
const MEDIA_CDN_BASE = "https://media.sphereos.dev";

// Max image dimensions and quality for CMS upload
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 800;
const JPEG_QUALITY = 80;

interface Lodge {
  name: string;
  region: string;
  country: string;
  figmaImageUrl: string;
}

const lodges: Lodge[] = [
  {
    name: "Southern Ocean Lodge",
    region: "Kangaroo Island",
    country: "South Australia, Australia",
    figmaImageUrl: "https://www.figma.com/api/mcp/asset/6d008848-3d64-42b6-ba3e-ee47a883599c",
  },
  {
    name: "The Louise",
    region: "Barossa Valley",
    country: "South Australia, Australia",
    figmaImageUrl: "https://www.figma.com/api/mcp/asset/bb912ed1-d009-4026-a38e-aa3b4eecdd03",
  },
  {
    name: "Tierra Atacama",
    region: "Atacama Desert",
    country: "Chile",
    figmaImageUrl: "https://www.figma.com/api/mcp/asset/5e6143a3-a1cc-4830-8c7c-cb911d4a073e",
  },
  {
    name: "Tierra Patagonia",
    region: "Torres del Paine",
    country: "Chile",
    figmaImageUrl: "https://www.figma.com/api/mcp/asset/71fcea67-28c5-4e8d-b872-21bc6e88cd4a",
  },
  {
    name: "Capella Lodge",
    region: "Lord Howe Island",
    country: "New South Wales, Australia",
    figmaImageUrl: "https://www.figma.com/api/mcp/asset/1535eef8-91f8-4f53-8ecc-56bacef9f705",
  },
  {
    name: "Clayoquot Wilderness Lodge",
    region: "Vancouver Island",
    country: "Canada",
    figmaImageUrl: "https://www.figma.com/api/mcp/asset/1f88587a-9a14-4dcb-8974-49e2420a47d2",
  },
  {
    name: "Huka Lodge",
    region: "Taupō",
    country: "New Zealand",
    figmaImageUrl: "https://www.figma.com/api/mcp/asset/8bb80ead-7434-4496-99c9-ccb5ef26d7d1",
  },
  {
    name: "Longitude 131°",
    region: "Uluru-Kata Tjuta",
    country: "Northern Territory, Australia",
    figmaImageUrl: "https://www.figma.com/api/mcp/asset/c7e7c299-ef09-4a76-a075-f694bef2b9c9",
  },
  {
    name: "Silky Oaks Lodge",
    region: "Daintree Rainforest",
    country: "Queensland, Australia",
    figmaImageUrl: "https://www.figma.com/api/mcp/asset/a8f9434d-2288-4d56-9479-a279ff7af3b1",
  },
];

async function login(email: string, password: string): Promise<string> {
  const response = await fetch(CMS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `mutation Login($input: LoginInput!) { login(input: $input) { accessToken } }`,
      variables: { input: { email, password } },
    }),
  });
  const result = await response.json();
  if (result.errors) throw new Error(`Login failed: ${JSON.stringify(result.errors)}`);
  return result.data.login.accessToken;
}

async function downloadAndResizeImage(url: string): Promise<{ base64: string; mimeType: string }> {
  console.log(`  Downloading from: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const originalSize = buffer.length;
  console.log(`  Original size: ${(originalSize / 1024).toFixed(0)} KB`);

  // Resize and compress using sharp
  const resizedBuffer = await sharp(buffer)
    .resize(MAX_WIDTH, MAX_HEIGHT, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer();

  const newSize = resizedBuffer.length;
  console.log(`  Resized size: ${(newSize / 1024).toFixed(0)} KB (${((1 - newSize / originalSize) * 100).toFixed(0)}% reduction)`);

  const base64 = resizedBuffer.toString("base64");

  return { base64, mimeType: "image/jpeg" };
}

async function uploadMedia(
  token: string,
  filename: string,
  mimeType: string,
  base64Data: string,
  alt: string
): Promise<{ id: string; url: string }> {
  const response = await fetch(CMS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        mutation UploadMedia($input: UploadMediaInput!) {
          uploadMedia(input: $input) {
            id
            filename
            variants { original large medium }
          }
        }
      `,
      variables: {
        input: {
          organizationId: ORGANIZATION_ID,
          filename,
          mimeType,
          alt,
          base64Data,
        },
      },
    }),
  });

  const result = await response.json();

  // Debug log
  if (!result.data?.uploadMedia) {
    console.log("  CMS Response:", JSON.stringify(result, null, 2).slice(0, 500));
  }

  if (result.errors) {
    throw new Error(`Upload failed: ${JSON.stringify(result.errors)}`);
  }

  if (!result.data?.uploadMedia) {
    throw new Error(`No uploadMedia in response: ${JSON.stringify(result).slice(0, 200)}`);
  }

  // Return the large variant URL, falling back to original
  const variants = result.data.uploadMedia.variants;
  const relativePath = variants?.large || variants?.medium || variants?.original || result.data.uploadMedia.id;

  // Construct full CDN URL
  const url = relativePath.startsWith("http") ? relativePath : `${MEDIA_CDN_BASE}/${relativePath}`;

  return { id: result.data.uploadMedia.id, url };
}

async function getContentEntry(token: string, slug: string): Promise<{ id: string; data: unknown } | null> {
  const response = await fetch(CMS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        query GetContentEntryBySlug($slug: String!, $contentTypeId: ID!, $organizationId: ID!) {
          contentEntryBySlug(slug: $slug, contentTypeId: $contentTypeId, organizationId: $organizationId) {
            id
            data
          }
        }
      `,
      variables: {
        slug,
        contentTypeId: PAGE_CONTENT_TYPE_ID,
        organizationId: ORGANIZATION_ID,
      },
    }),
  });

  const result = await response.json();
  return result.data?.contentEntryBySlug || null;
}

async function updateContentEntry(
  token: string,
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  const response = await fetch(CMS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        mutation UpdateContentEntry($id: ID!, $input: UpdateContentEntryInput!) {
          updateContentEntry(id: $id, input: $input) {
            id
            slug
            updatedAt
          }
        }
      `,
      variables: {
        id,
        input: { data },
      },
    }),
  });

  const result = await response.json();
  if (result.errors) {
    throw new Error(`Update failed: ${JSON.stringify(result.errors)}`);
  }
}

async function main() {
  console.log("🚀 Uploading Lodge Images to CMS CDN\n");

  const email = process.env.CMS_EMAIL || "dev@sphereos.local";
  const password = process.env.CMS_PASSWORD || "password123";

  console.log("Logging in...");
  const token = await login(email, password);
  console.log("✅ Logged in\n");

  // Upload all lodge images
  const uploadedLodges: Array<{
    name: string;
    region: string;
    country: string;
    imageUrl: string;
  }> = [];

  for (const lodge of lodges) {
    console.log(`Processing: ${lodge.name}...`);

    try {
      // Download image from Figma
      const { base64, mimeType } = await downloadAndResizeImage(lodge.figmaImageUrl);

      // Generate a safe filename
      const filename = `lodge-${lodge.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.jpg`;

      // Upload to CMS
      console.log(`  Uploading to CMS...`);
      const { url } = await uploadMedia(
        token,
        filename,
        mimeType,
        base64,
        `${lodge.name} - ${lodge.region}, ${lodge.country}`
      );

      uploadedLodges.push({
        name: lodge.name,
        region: lodge.region,
        country: lodge.country,
        imageUrl: url,
      });

      console.log(`  ✅ Uploaded: ${url}\n`);
    } catch (error) {
      console.error(`  ❌ Failed to process ${lodge.name}:`, error);
      // Use a placeholder or skip
      uploadedLodges.push({
        name: lodge.name,
        region: lodge.region,
        country: lodge.country,
        imageUrl: lodge.figmaImageUrl, // Fallback to Figma URL
      });
    }
  }

  // Get existing home page content
  console.log("Fetching existing home page content...");
  const homeEntry = await getContentEntry(token, "home");

  if (!homeEntry) {
    console.error("❌ Home page content not found!");
    return;
  }

  console.log(`✅ Found home page entry (ID: ${homeEntry.id})\n`);

  // Update the lodgeCarousel data
  const existingData = homeEntry.data as Record<string, unknown>;
  const updatedData = {
    ...existingData,
    lodgeCarousel: {
      title: "Our Lodges",
      lodges: uploadedLodges,
    },
  };

  console.log("Updating home page with new lodge images...");
  await updateContentEntry(token, homeEntry.id, updatedData);
  console.log("✅ Home page updated successfully!\n");

  console.log("📋 Uploaded Lodge Images:");
  uploadedLodges.forEach((lodge, i) => {
    console.log(`${i + 1}. ${lodge.name}`);
    console.log(`   ${lodge.imageUrl}\n`);
  });

  console.log("✅ Lodge image upload complete!");
}

main().catch(console.error);
