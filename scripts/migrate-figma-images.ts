/**
 * Script to migrate Figma temporary images to R2 CDN
 *
 * This script:
 * 1. Downloads images from Figma URLs
 * 2. Uploads them to R2 via the CMS media API
 * 3. Updates the CMS content entries with the new R2 URLs
 */

import * as fs from "fs";
import * as path from "path";

const CMS_API = "https://backend-production-162b.up.railway.app";
const ORG_SLUG = "beckons";

// Image mapping - Fresh Figma URLs (valid for 7 days from Jan 19, 2026)
const IMAGES_TO_MIGRATE = [
  {
    name: "about-card-image-1",
    figmaUrl: "https://www.figma.com/api/mcp/asset/18430399-2830-4d04-9f45-a6e0063ed7ed", // Places Worth Reaching - lodge building
    usedIn: [
      { entry: "home", field: "hero.posterUrl" },
      { entry: "home", field: "whyBeckons.cards[0].imageUrl" },
    ],
  },
  {
    name: "about-card-image-2",
    figmaUrl: "https://www.figma.com/api/mcp/asset/a9f9bf2f-b708-42a8-a290-ebed68069039", // "Built for where we are" - hand on door
    usedIn: [{ entry: "home", field: "whyBeckons.cards[1].imageUrl" }],
  },
  {
    name: "about-card-image-3",
    figmaUrl: "https://www.figma.com/api/mcp/asset/d5fe867b-88ac-47bf-ace6-434ee91639cb", // "Intentionally local"
    usedIn: [{ entry: "home", field: "whyBeckons.cards[2].imageUrl" }],
  },
  {
    name: "lodge-carousel-bg",
    figmaUrl: "https://www.figma.com/api/mcp/asset/7899f51f-6cb3-4e38-b89a-f8172cf803a6", // Southern Ocean Lodge
    usedIn: [
      { entry: "home", field: "lodges.backgroundImageUrl" },
      { entry: "inquire", field: "backgroundImageUrl" },
      { entry: "email-subscription", field: "backgroundImageUrl" },
    ],
  },
  {
    name: "logo-full",
    figmaUrl: "https://www.figma.com/api/mcp/asset/a320b5df-6a7b-486e-aaed-d1e9e18fcf29", // Beckons logo
    usedIn: [
      { entry: "global-settings", field: "logoUrl" },
      { entry: "home", field: "hero.logoUrl" },
    ],
  },
  {
    name: "logo-icon",
    figmaUrl: "https://www.figma.com/api/mcp/asset/f5584bb0-a88f-4ada-960a-37d48543c43a", // Compass icon
    usedIn: [
      { entry: "global-settings", field: "logoIconUrl" },
      { entry: "global-footer", field: "logoUrl" },
    ],
  },
  {
    name: "video-mask-shape",
    figmaUrl: "https://www.figma.com/api/mcp/asset/cd6f3121-52d8-4f37-bbb4-2271fe1fe467", // Diamond mask
    usedIn: [
      { entry: "home", field: "videoMaskImageUrl" },
      { entry: "inquire", field: "videoMaskImageUrl" },
      { entry: "email-subscription", field: "videoMaskImageUrl" },
    ],
  },
];

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadToR2(
  imageBuffer: Buffer,
  filename: string,
  authToken: string
): Promise<string> {
  const formData = new FormData();
  const blob = new Blob([imageBuffer], { type: "image/jpeg" });
  formData.append("file", blob, filename);

  const response = await fetch(`${CMS_API}/api/inline-editor/media/upload`, {
    method: "POST",
    headers: {
      "X-CMS-Org": ORG_SLUG,
      Authorization: `Bearer ${authToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to upload: ${error}`);
  }

  const data = await response.json();
  return data.url;
}

async function updateCMSEntry(
  entrySlug: string,
  field: string,
  value: string,
  authToken: string
): Promise<void> {
  const response = await fetch(`${CMS_API}/api/inline-editor/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CMS-Org": ORG_SLUG,
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      entry: entrySlug,
      field,
      value,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update entry ${entrySlug}.${field}: ${error}`);
  }

  console.log(`✓ Updated ${entrySlug}.${field}`);
}

async function main() {
  const authToken = process.env.CMS_AUTH_TOKEN;
  if (!authToken) {
    console.error("ERROR: CMS_AUTH_TOKEN environment variable is required");
    console.error("Get a token by logging into the CMS admin and copying it from cookies");
    process.exit(1);
  }

  console.log("Starting Figma image migration...\n");

  // Filter images that have Figma URLs
  const imagesToProcess = IMAGES_TO_MIGRATE.filter((img) => img.figmaUrl);

  if (imagesToProcess.length === 0) {
    console.error("ERROR: No Figma URLs provided!");
    console.error("Please populate the IMAGES_TO_MIGRATE array with fresh Figma URLs");
    console.error("\nTo get fresh URLs:");
    console.error("1. Use the Figma MCP tool: mcp__figma__get_design_context");
    console.error("2. Pass the node IDs from docs/image-manifest.json");
    console.error("3. Copy the image URLs from the response");
    process.exit(1);
  }

  for (const image of imagesToProcess) {
    console.log(`\nProcessing: ${image.name}`);

    try {
      // Download from Figma
      console.log(`  Downloading from Figma...`);
      const imageBuffer = await downloadImage(image.figmaUrl);
      console.log(`  Downloaded ${imageBuffer.length} bytes`);

      // Upload to R2
      console.log(`  Uploading to R2...`);
      const r2Url = await uploadToR2(
        imageBuffer,
        `${image.name}.jpg`,
        authToken
      );
      console.log(`  Uploaded: ${r2Url}`);

      // Update CMS entries
      for (const usage of image.usedIn) {
        await updateCMSEntry(usage.entry, usage.field, r2Url, authToken);
      }

      console.log(`✓ ${image.name} migrated successfully`);
    } catch (error) {
      console.error(`✗ Failed to migrate ${image.name}:`, error);
    }
  }

  console.log("\n✓ Migration complete!");
}

main().catch(console.error);
