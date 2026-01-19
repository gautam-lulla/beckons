/**
 * Update CMS entries with new R2 URLs
 */

const CMS_API = "https://backend-production-162b.up.railway.app";
const ORG_SLUG = "beckons";

// All uploaded R2 URLs
const R2_URLS = {
  "about-card-image-1": "https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/aff2ebc4-078d-44ea-8bea-9deadf82d93c/original.jpg",
  "about-card-image-2": "https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/0a9eff94-3ccf-42c7-b620-58a31646c877/original.jpg",
  "about-card-image-3": "https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/0df97473-d20c-43fa-aa5e-bbcc26a8ab42/original.png",
  "lodge-carousel-bg": "https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/177e9c03-c4d8-45ad-9757-68b6228ba12e/original.jpg",
  "logo-full": "https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/9449ddd0-b979-40d6-9697-26c42fc6d913/original.svg",
  "logo-icon": "https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/02c475cf-7fcc-4938-bb8c-502ff0641230/original.svg",
  "video-mask-shape": "https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/dd227d6c-6e50-4431-abcb-b91e324e0f0e/original.png",
};

// Field updates to make
const UPDATES = [
  // Home page
  { entry: "home", field: "hero.posterUrl", url: R2_URLS["about-card-image-1"] },
  { entry: "home", field: "hero.logoUrl", url: R2_URLS["logo-full"] },
  { entry: "home", field: "whyBeckons.cards[0].imageUrl", url: R2_URLS["about-card-image-1"] },
  { entry: "home", field: "whyBeckons.cards[1].imageUrl", url: R2_URLS["about-card-image-2"] },
  { entry: "home", field: "whyBeckons.cards[2].imageUrl", url: R2_URLS["about-card-image-3"] },
  { entry: "home", field: "videoMaskImageUrl", url: R2_URLS["video-mask-shape"] },

  // Global settings
  { entry: "global-settings", field: "logoUrl", url: R2_URLS["logo-full"] },
  { entry: "global-settings", field: "logoIconUrl", url: R2_URLS["logo-icon"] },

  // Footer
  { entry: "global-footer", field: "logoUrl", url: R2_URLS["logo-icon"] },

  // Inquire page
  { entry: "inquire", field: "backgroundImageUrl", url: R2_URLS["lodge-carousel-bg"] },
  { entry: "inquire", field: "videoMaskImageUrl", url: R2_URLS["video-mask-shape"] },

  // Email subscription page
  { entry: "email-subscription", field: "backgroundImageUrl", url: R2_URLS["lodge-carousel-bg"] },
  { entry: "email-subscription", field: "videoMaskImageUrl", url: R2_URLS["video-mask-shape"] },
];

async function updateField(
  entry: string,
  field: string,
  value: string,
  authToken: string
): Promise<boolean> {
  try {
    const response = await fetch(`${CMS_API}/api/inline-editor/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CMS-Org": ORG_SLUG,
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ entry, field, value }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`  Error: ${error}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`  Error: ${error}`);
    return false;
  }
}

async function main() {
  const authToken = process.env.CMS_AUTH_TOKEN;
  if (!authToken) {
    console.error("ERROR: CMS_AUTH_TOKEN required");
    process.exit(1);
  }

  console.log("Updating CMS entries with R2 URLs...\n");

  let success = 0;
  let failed = 0;

  for (const update of UPDATES) {
    console.log(`${update.entry}.${update.field}`);
    const ok = await updateField(update.entry, update.field, update.url, authToken);
    if (ok) {
      console.log(`  ✓ Updated\n`);
      success++;
    } else {
      console.log(`  ✗ Failed\n`);
      failed++;
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
}

main().catch(console.error);
