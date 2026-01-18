/**
 * Upload Lodge Logos to CMS CDN and Update Home Page
 *
 * Run with: npx tsx scripts/upload-lodge-logos.ts
 */

import sharp from "sharp";

const CMS_URL = "https://backend-production-162b.up.railway.app/graphql";
const ORGANIZATION_ID = "d146dc11-c3ff-4476-b725-1510f245b0ed";
const PAGE_CONTENT_TYPE_ID = "07c14638-aced-4140-aa25-b7658ed17639";
const MEDIA_CDN_BASE = "https://media.sphereos.dev";

interface LodgeLogo {
  name: string;
  figmaLogoUrl: string;
}

// Light version logos (for dark backgrounds) from Figma frame 10661:2296
const lodgeLogos: LodgeLogo[] = [
  {
    name: "Southern Ocean Lodge",
    figmaLogoUrl: "https://www.figma.com/api/mcp/asset/b772d4ca-d819-4f6c-98f9-7a104016b8ce",
  },
  {
    name: "The Louise",
    figmaLogoUrl: "https://www.figma.com/api/mcp/asset/0d2bdfb5-fde9-4a4f-9372-79f199a4e8d1",
  },
  {
    name: "Tierra Atacama",
    figmaLogoUrl: "https://www.figma.com/api/mcp/asset/e47f94ed-a945-4290-ae60-ccb2073728b0",
  },
  {
    name: "Tierra Patagonia",
    figmaLogoUrl: "https://www.figma.com/api/mcp/asset/adf0fde2-4445-4412-97aa-0f00592d55be",
  },
  {
    name: "Capella Lodge",
    figmaLogoUrl: "https://www.figma.com/api/mcp/asset/ac5309fc-6dc4-4711-9986-d2eb309b2bd8",
  },
  {
    name: "Clayoquot Wilderness Lodge",
    figmaLogoUrl: "https://www.figma.com/api/mcp/asset/4cc1d097-5b99-4e44-846b-bb9a90cf8a53",
  },
  {
    name: "Huka Lodge",
    figmaLogoUrl: "https://www.figma.com/api/mcp/asset/4c75a454-48fb-47e1-b647-776c5ee1df32",
  },
  {
    name: "Longitude 131°",
    figmaLogoUrl: "https://www.figma.com/api/mcp/asset/863c9cc4-dd69-4ba1-ac75-4873ea44e0be",
  },
  {
    name: "Silky Oaks Lodge",
    figmaLogoUrl: "https://www.figma.com/api/mcp/asset/c0958769-0417-4691-a8cb-3c6c4eb5c33b",
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

async function downloadLogo(url: string): Promise<{ base64: string; mimeType: string }> {
  console.log(`  Downloading from: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") || "image/png";

  // Check if it's an SVG
  if (contentType.includes("svg")) {
    return { base64: buffer.toString("base64"), mimeType: "image/svg+xml" };
  }

  // For other formats, convert to PNG with transparency preserved
  const pngBuffer = await sharp(buffer)
    .resize(200, 200, { fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer();

  return { base64: pngBuffer.toString("base64"), mimeType: "image/png" };
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

  if (result.errors) {
    throw new Error(`Upload failed: ${JSON.stringify(result.errors)}`);
  }

  if (!result.data?.uploadMedia) {
    throw new Error(`No uploadMedia in response: ${JSON.stringify(result).slice(0, 200)}`);
  }

  const variants = result.data.uploadMedia.variants;
  const relativePath = variants?.original || result.data.uploadMedia.id;
  const url = relativePath.startsWith("http") ? relativePath : `${MEDIA_CDN_BASE}/${relativePath}`;

  return { id: result.data.uploadMedia.id, url };
}

async function getContentEntry(token: string, slug: string): Promise<{ id: string; data: Record<string, unknown> } | null> {
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
  console.log("🚀 Uploading Lodge Logos to CMS CDN\n");

  const email = process.env.CMS_EMAIL || "dev@sphereos.local";
  const password = process.env.CMS_PASSWORD || "password123";

  console.log("Logging in...");
  const token = await login(email, password);
  console.log("✅ Logged in\n");

  // Upload all lodge logos and create a map
  const logoMap: Record<string, string> = {};

  for (const logo of lodgeLogos) {
    console.log(`Processing: ${logo.name} logo...`);

    try {
      const { base64, mimeType } = await downloadLogo(logo.figmaLogoUrl);
      const ext = mimeType.includes("svg") ? "svg" : "png";
      const filename = `lodge-logo-${logo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${ext}`;

      console.log(`  Uploading to CMS...`);
      const { url } = await uploadMedia(token, filename, mimeType, base64, `${logo.name} logo`);
      logoMap[logo.name] = url;
      console.log(`  ✅ Uploaded: ${url}\n`);
    } catch (error) {
      console.error(`  ❌ Failed to process ${logo.name}:`, error);
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

  // Update lodges with icon URLs
  const existingData = homeEntry.data;
  const lodgeCarousel = existingData.lodgeCarousel as { title: string; lodges: Array<{ name: string; region: string; country: string; imageUrl: string; iconUrl?: string }> };

  const updatedLodges = lodgeCarousel.lodges.map(lodge => ({
    ...lodge,
    iconUrl: logoMap[lodge.name] || lodge.iconUrl,
  }));

  const updatedData = {
    ...existingData,
    lodgeCarousel: {
      ...lodgeCarousel,
      lodges: updatedLodges,
    },
  };

  console.log("Updating home page with lodge logos...");
  await updateContentEntry(token, homeEntry.id, updatedData);
  console.log("✅ Home page updated successfully!\n");

  console.log("📋 Lodge Logos:");
  Object.entries(logoMap).forEach(([name, url]) => {
    console.log(`- ${name}: ${url}`);
  });

  console.log("\n✅ Lodge logo upload complete!");
}

main().catch(console.error);
