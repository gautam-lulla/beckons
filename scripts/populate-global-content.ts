/**
 * Populate Global Content in CMS
 *
 * Run with: npx tsx scripts/populate-global-content.ts
 */

const CMS_URL = "https://backend-production-162b.up.railway.app/graphql";
const ORGANIZATION_ID = "d146dc11-c3ff-4476-b725-1510f245b0ed";

// Content Type IDs from Phase 5
const CONTENT_TYPES = {
  "site-settings": "81e25ab9-e6ff-477e-a816-6ad221aa4252",
  "site-footer": "7de79163-3660-4f0d-9750-950c846b7913",
  "page-content": "07c14638-aced-4140-aa25-b7658ed17639",
};

async function login(email: string, password: string): Promise<string> {
  const response = await fetch(CMS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        mutation Login($input: LoginInput!) {
          login(input: $input) { accessToken }
        }
      `,
      variables: { input: { email, password } },
    }),
  });
  const result = await response.json();
  if (result.errors) throw new Error(`Login failed: ${JSON.stringify(result.errors)}`);
  return result.data.login.accessToken;
}

async function createContentEntry(
  token: string,
  contentTypeId: string,
  slug: string,
  data: Record<string, unknown>
): Promise<{ id: string; slug: string }> {
  const response = await fetch(CMS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        mutation CreateContentEntry($input: CreateContentEntryInput!) {
          createContentEntry(input: $input) {
            id
            slug
          }
        }
      `,
      variables: {
        input: {
          contentTypeId,
          organizationId: ORGANIZATION_ID,
          slug,
          data,
        },
      },
    }),
  });

  const result = await response.json();
  if (result.errors) {
    if (result.errors[0]?.message?.includes("already exists")) {
      console.log(`  Entry "${slug}" already exists, skipping...`);
      return { id: "existing", slug };
    }
    throw new Error(`Failed to create entry: ${JSON.stringify(result.errors)}`);
  }
  return result.data.createContentEntry;
}

async function main() {
  console.log("🚀 Populating Global Content\n");

  const email = "dev@sphereos.local";
  const password = "password123";

  console.log("Logging in...");
  const token = await login(email, password);
  console.log("✅ Logged in\n");

  // =============================================
  // SITE SETTINGS
  // =============================================
  console.log("Creating Site Settings...");
  const siteSettings = {
    logoUrl: "https://www.figma.com/api/mcp/asset/40aeaa38-fe51-40fa-b951-f8095866aaeb",
    logoAlt: "Beckons",
    logoIconUrl: "https://www.figma.com/api/mcp/asset/118e4e8e-8d91-4ff4-8c39-28ff51563fde",
    brandName: "Beckons",
  };

  try {
    const result = await createContentEntry(
      token,
      CONTENT_TYPES["site-settings"],
      "global-settings",
      siteSettings
    );
    console.log(`  ✅ Created site-settings/global-settings (ID: ${result.id})\n`);
  } catch (error) {
    console.error(`  ❌ Failed:`, error);
  }

  // =============================================
  // FOOTER
  // =============================================
  console.log("Creating Footer...");
  const footerContent = {
    logoUrl: "https://www.figma.com/api/mcp/asset/118e4e8e-8d91-4ff4-8c39-28ff51563fde",
    newsletterTitle: "Stay Connected",
    newsletterDescription: "Join our mailing list for the latest on new destinations, seasonal offers and what's unfolding across the collection.",
    newsletterButtonText: "SUBSCRIBE NOW",
    portfolioTitle: "Our Portfolio",
    portfolioDescription: "Beckons is a global curator of remarkable journeys across the globe. Every stay is deeply tied to its location, offering a distinct way to experience land, culture and yourself.",
    lodges: [
      {
        country: "Australia",
        lodges: [
          { name: "Capella Lodge", location: "Lord Howe Island, New South Wales" },
          { name: "Longitude 131°", location: "Uluru-Kata Tjuta, Northern Territory" },
          { name: "Silky Oaks Lodge", location: "Daintree Rainforest, North Queensland" },
          { name: "Southern Ocean Lodge", location: "Kangaroo Island, South Australia" },
          { name: "The Louise", location: "Barossa Valley, South Australia" },
        ],
      },
      {
        country: "New Zealand",
        lodges: [
          { name: "Huka Lodge", location: "Taupō, North Island" },
        ],
      },
      {
        country: "Canada",
        lodges: [
          { name: "Clayoquot Wilderness Lodge", location: "Vancouver Island" },
        ],
      },
      {
        country: "Chile",
        lodges: [
          { name: "Tierra Atacama", location: "Atacama Desert" },
          { name: "Tierra Patagonia", location: "Torres del Paine National Park" },
        ],
      },
    ],
    copyrightText: "© 2026 Beckons. All rights reserved.",
  };

  try {
    const result = await createContentEntry(
      token,
      CONTENT_TYPES["site-footer"],
      "global-footer",
      footerContent
    );
    console.log(`  ✅ Created site-footer/global-footer (ID: ${result.id})\n`);
  } catch (error) {
    console.error(`  ❌ Failed:`, error);
  }

  console.log("✅ Global content population complete!");
}

main().catch(console.error);
