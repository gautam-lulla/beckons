/**
 * Upload remaining images with correct MIME types
 */

import * as fs from "fs";
import * as path from "path";

const CMS_API = "https://backend-production-162b.up.railway.app/graphql";
const ORGANIZATION_ID = "d146dc11-c3ff-4476-b725-1510f245b0ed";
const R2_PUBLIC_URL = "https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev";
const IMAGES_DIR = path.join(__dirname, "../public/images/cms");

const IMAGES = [
  {
    filename: "about-card-image-1.jpg",
    mimeType: "image/jpeg",
    alt: "Places Worth Reaching - lodge building",
  },
  {
    filename: "about-card-image-3.png",
    mimeType: "image/png",
    alt: "Intentionally local",
  },
  {
    filename: "lodge-carousel-bg.jpg",
    mimeType: "image/jpeg",
    alt: "Southern Ocean Lodge carousel background",
  },
  {
    filename: "video-mask-shape.png",
    mimeType: "image/png",
    alt: "Diamond mask shape",
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
  console.log(`  File size: ${Math.round(fileBuffer.length / 1024)} KB`);

  const base64Data = fileBuffer.toString("base64");

  try {
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

    const result = await response.json();

    if (result.errors) {
      console.error(`  GraphQL errors:`, JSON.stringify(result.errors, null, 2));
      return null;
    }

    if (!result.data?.uploadMedia?.variants?.original) {
      console.error(`  No URL returned`, result);
      return null;
    }

    const r2Key = result.data.uploadMedia.variants.original;
    return `${R2_PUBLIC_URL}/${r2Key}`;
  } catch (error) {
    console.error(`  Fetch error:`, error);
    return null;
  }
}

async function main() {
  const authToken = process.env.CMS_AUTH_TOKEN;
  if (!authToken) {
    console.error("ERROR: CMS_AUTH_TOKEN required");
    process.exit(1);
  }

  console.log("Uploading remaining images...\n");

  const results: Record<string, string> = {};

  for (const image of IMAGES) {
    console.log(`Uploading: ${image.filename} (${image.mimeType})`);

    const url = await uploadImage(
      image.filename,
      image.mimeType,
      image.alt,
      authToken
    );

    if (url) {
      results[image.filename] = url;
      console.log(`  ✓ Uploaded: ${url}\n`);
    } else {
      console.log(`  ✗ Failed\n`);
    }
  }

  console.log("\n=== RESULTS ===\n");
  for (const [filename, url] of Object.entries(results)) {
    console.log(`${filename}: ${url}`);
  }
}

main().catch(console.error);
