/**
 * Script to download Figma images to local folder
 * Run with: npx ts-node scripts/download-figma-images.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";

const OUTPUT_DIR = path.join(__dirname, "../public/images/cms");

// Fresh Figma URLs (valid for 7 days from Jan 19, 2026)
const IMAGES = [
  {
    name: "about-card-image-1.jpg",
    url: "https://www.figma.com/api/mcp/asset/18430399-2830-4d04-9f45-a6e0063ed7ed",
    description: "Places Worth Reaching - lodge building",
  },
  {
    name: "about-card-image-2.jpg",
    url: "https://www.figma.com/api/mcp/asset/a9f9bf2f-b708-42a8-a290-ebed68069039",
    description: "Built for where we are - hand on door",
  },
  {
    name: "about-card-image-3.jpg",
    url: "https://www.figma.com/api/mcp/asset/d5fe867b-88ac-47bf-ace6-434ee91639cb",
    description: "Intentionally local",
  },
  {
    name: "lodge-carousel-bg.jpg",
    url: "https://www.figma.com/api/mcp/asset/7899f51f-6cb3-4e38-b89a-f8172cf803a6",
    description: "Southern Ocean Lodge carousel background",
  },
  {
    name: "logo-full.svg",
    url: "https://www.figma.com/api/mcp/asset/a320b5df-6a7b-486e-aaed-d1e9e18fcf29",
    description: "Beckons full logo",
  },
  {
    name: "logo-icon.svg",
    url: "https://www.figma.com/api/mcp/asset/f5584bb0-a88f-4ada-960a-37d48543c43a",
    description: "Beckons compass icon",
  },
  {
    name: "video-mask-shape.svg",
    url: "https://www.figma.com/api/mcp/asset/cd6f3121-52d8-4f37-bbb4-2271fe1fe467",
    description: "Diamond mask shape",
  },
];

async function downloadFile(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);

    https
      .get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            file.close();
            fs.unlinkSync(outputPath);
            downloadFile(redirectUrl, outputPath).then(resolve).catch(reject);
            return;
          }
        }

        if (response.statusCode !== 200) {
          file.close();
          fs.unlinkSync(outputPath);
          reject(new Error(`Failed to download: HTTP ${response.statusCode}`));
          return;
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        file.close();
        fs.unlinkSync(outputPath);
        reject(err);
      });
  });
}

async function main() {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Downloading images to: ${OUTPUT_DIR}\n`);

  for (const image of IMAGES) {
    const outputPath = path.join(OUTPUT_DIR, image.name);
    console.log(`Downloading: ${image.name}`);
    console.log(`  URL: ${image.url}`);
    console.log(`  Description: ${image.description}`);

    try {
      await downloadFile(image.url, outputPath);
      const stats = fs.statSync(outputPath);
      console.log(`  ✓ Downloaded (${Math.round(stats.size / 1024)} KB)\n`);
    } catch (error) {
      console.error(`  ✗ Failed: ${error}\n`);
    }
  }

  console.log("Done! Images saved to:", OUTPUT_DIR);
  console.log("\nNext steps:");
  console.log("1. Upload these images to the CMS Media Library");
  console.log("2. Update the CMS content entries with the new R2 URLs");
}

main().catch(console.error);
