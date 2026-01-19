/**
 * Script to upload local images to CMS R2 storage
 *
 * Usage:
 *   CMS_AUTH_TOKEN=<your-token> npx tsx scripts/upload-to-cms.ts
 *
 * To get a token:
 *   1. Login to https://sphereos.vercel.app
 *   2. Open DevTools > Application > Cookies
 *   3. Copy the 'access_token' cookie value
 */

import * as fs from "fs";
import * as path from "path";

const CMS_API = "https://backend-production-162b.up.railway.app/graphql";
const ORGANIZATION_ID = "d146dc11-c3ff-4476-b725-1510f245b0ed"; // Beckons org ID
const R2_PUBLIC_URL = "https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev";

const IMAGES_DIR = path.join(__dirname, "../public/images/cms");

// Images to upload and where they're used in CMS
const IMAGES = [
  {
    filename: "about-card-image-1.jpg",
    mimeType: "image/jpeg",
    alt: "Places Worth Reaching - lodge building",
    usedIn: [
      { entry: "home", field: "hero.posterUrl" },
      { entry: "home", field: "whyBeckons.cards[0].imageUrl" },
    ],
  },
  {
    filename: "about-card-image-2.jpg",
    mimeType: "image/jpeg",
    alt: "Built for where we are - hand on door handle",
    usedIn: [{ entry: "home", field: "whyBeckons.cards[1].imageUrl" }],
  },
  {
    filename: "about-card-image-3.jpg",
    mimeType: "image/jpeg",
    alt: "Intentionally local",
    usedIn: [{ entry: "home", field: "whyBeckons.cards[2].imageUrl" }],
  },
  {
    filename: "lodge-carousel-bg.jpg",
    mimeType: "image/jpeg",
    alt: "Southern Ocean Lodge carousel background",
    usedIn: [
      { entry: "home", field: "lodges.backgroundImageUrl" },
      { entry: "inquire", field: "backgroundImageUrl" },
      { entry: "email-subscription", field: "backgroundImageUrl" },
    ],
  },
  {
    filename: "logo-full.svg",
    mimeType: "image/svg+xml",
    alt: "Beckons full logo",
    usedIn: [
      { entry: "global-settings", field: "logoUrl" },
      { entry: "home", field: "hero.logoUrl" },
    ],
  },
  {
    filename: "logo-icon.svg",
    mimeType: "image/svg+xml",
    alt: "Beckons compass icon",
    usedIn: [
      { entry: "global-settings", field: "logoIconUrl" },
      { entry: "global-footer", field: "logoUrl" },
    ],
  },
  {
    filename: "video-mask-shape.svg",
    mimeType: "image/svg+xml",
    alt: "Diamond mask shape",
    usedIn: [
      { entry: "home", field: "videoMaskImageUrl" },
      { entry: "inquire", field: "videoMaskImageUrl" },
      { entry: "email-subscription", field: "videoMaskImageUrl" },
    ],
  },
];

const UPLOAD_MEDIA_MUTATION = `
  mutation UploadMedia($input: UploadMediaInput!) {
    uploadMedia(input: $input) {
      id
      filename
      variants {
        original
        thumbnail
        medium
        large
      }
    }
  }
`;

interface UploadResult {
  data?: {
    uploadMedia: {
      id: string;
      filename: string;
      variants: {
        original: string;
        thumbnail?: string;
        medium?: string;
        large?: string;
      };
    };
  };
  errors?: Array<{ message: string }>;
}

async function uploadImage(
  filename: string,
  mimeType: string,
  alt: string,
  authToken: string
): Promise<string | null> {
  const filePath = path.join(IMAGES_DIR, filename);

  if (!fs.existsSync(filePath)) {
    console.error(`  File not found: ${filePath}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(filePath);
  const base64Data = fileBuffer.toString("base64");

  const response = await fetch(CMS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      query: UPLOAD_MEDIA_MUTATION,
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

  const result: UploadResult = await response.json();

  if (result.errors) {
    console.error(`  GraphQL errors:`, result.errors);
    return null;
  }

  if (!result.data?.uploadMedia?.variants?.original) {
    console.error(`  No URL returned`);
    return null;
  }

  // Construct the full R2 URL
  const r2Key = result.data.uploadMedia.variants.original;
  return `${R2_PUBLIC_URL}/${r2Key}`;
}

// Store uploaded URLs for updating CMS entries
const uploadedUrls: Map<string, string> = new Map();

async function main() {
  const authToken = process.env.CMS_AUTH_TOKEN;
  if (!authToken) {
    console.error("ERROR: CMS_AUTH_TOKEN environment variable is required");
    console.error("\nTo get a token:");
    console.error("1. Login to https://sphereos.vercel.app");
    console.error("2. Open DevTools > Application > Cookies");
    console.error("3. Copy the 'access_token' cookie value");
    console.error("\nThen run:");
    console.error("  CMS_AUTH_TOKEN=<token> npx tsx scripts/upload-to-cms.ts");
    process.exit(1);
  }

  console.log("Uploading images to CMS R2 storage...\n");

  for (const image of IMAGES) {
    console.log(`Uploading: ${image.filename}`);

    const url = await uploadImage(
      image.filename,
      image.mimeType,
      image.alt,
      authToken
    );

    if (url) {
      uploadedUrls.set(image.filename, url);
      console.log(`  ✓ Uploaded: ${url}\n`);
    } else {
      console.log(`  ✗ Failed\n`);
    }
  }

  // Print summary for manual CMS updates
  console.log("\n=== UPLOAD SUMMARY ===\n");
  console.log("Successfully uploaded URLs (copy these for CMS updates):\n");

  for (const image of IMAGES) {
    const url = uploadedUrls.get(image.filename);
    if (url) {
      console.log(`${image.filename}:`);
      console.log(`  URL: ${url}`);
      console.log(`  Used in:`);
      for (const usage of image.usedIn) {
        console.log(`    - ${usage.entry}.${usage.field}`);
      }
      console.log();
    }
  }

  // Save URLs to a JSON file for reference
  const outputPath = path.join(__dirname, "../docs/uploaded-images.json");
  const outputData = {
    uploadedAt: new Date().toISOString(),
    images: IMAGES.map((img) => ({
      ...img,
      r2Url: uploadedUrls.get(img.filename) || null,
    })),
  };
  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
  console.log(`\nSaved URLs to: ${outputPath}`);
}

main().catch(console.error);
