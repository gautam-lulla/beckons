/**
 * Fix Lodge Data - Updates the correct nested location
 *
 * Run with: npx tsx scripts/fix-lodge-data.ts
 */

const CMS_URL = "https://backend-production-162b.up.railway.app/graphql";
const ORGANIZATION_ID = "d146dc11-c3ff-4476-b725-1510f245b0ed";
const PAGE_CONTENT_TYPE_ID = "07c14638-aced-4140-aa25-b7658ed17639";

// The 9 lodges with their Figma asset URLs
const lodges = [
  {
    name: "Southern Ocean Lodge",
    region: "Kangaroo Island",
    country: "South Australia, Australia",
    imageUrl: "https://www.figma.com/api/mcp/asset/6d008848-3d64-42b6-ba3e-ee47a883599c",
    iconUrl: "https://www.figma.com/api/mcp/asset/54745037-04a0-4fe2-b5bc-e4099f80dd70",
  },
  {
    name: "The Louise",
    region: "Barossa Valley",
    country: "South Australia, Australia",
    imageUrl: "https://www.figma.com/api/mcp/asset/bb912ed1-d009-4026-a38e-aa3b4eecdd03",
    iconUrl: "https://www.figma.com/api/mcp/asset/c9382c9b-de30-45f1-ade4-4b17dcea916c",
  },
  {
    name: "Tierra Atacama",
    region: "Atacama Desert",
    country: "Chile",
    imageUrl: "https://www.figma.com/api/mcp/asset/5e6143a3-a1cc-4830-8c7c-cb911d4a073e",
    iconUrl: "https://www.figma.com/api/mcp/asset/5507d91d-65bb-41ba-8fa2-99e93c412f0b",
  },
  {
    name: "Tierra Patagonia",
    region: "Torres del Paine",
    country: "Chile",
    imageUrl: "https://www.figma.com/api/mcp/asset/71fcea67-28c5-4e8d-b872-21bc6e88cd4a",
    iconUrl: "https://www.figma.com/api/mcp/asset/6455a118-2376-4bf3-8bc2-d86cbbab0d29",
  },
  {
    name: "Capella Lodge",
    region: "Lord Howe Island",
    country: "New South Wales, Australia",
    imageUrl: "https://www.figma.com/api/mcp/asset/1535eef8-91f8-4f53-8ecc-56bacef9f705",
    iconUrl: "https://www.figma.com/api/mcp/asset/37b6f17d-a014-407b-a852-5083d6752bc2",
  },
  {
    name: "Clayoquot Wilderness Lodge",
    region: "Vancouver Island",
    country: "Canada",
    imageUrl: "https://www.figma.com/api/mcp/asset/1f88587a-9a14-4dcb-8974-49e2420a47d2",
    iconUrl: "https://www.figma.com/api/mcp/asset/76b07255-1e9e-47ef-9863-bed74a82e33f",
  },
  {
    name: "Huka Lodge",
    region: "Taupō",
    country: "New Zealand",
    imageUrl: "https://www.figma.com/api/mcp/asset/8bb80ead-7434-4496-99c9-ccb5ef26d7d1",
    iconUrl: "https://www.figma.com/api/mcp/asset/e7c42b47-3ac5-41bb-87e3-840bc62ff56f",
  },
  {
    name: "Longitude 131°",
    region: "Uluru-Kata Tjuta",
    country: "Northern Territory, Australia",
    imageUrl: "https://www.figma.com/api/mcp/asset/c7e7c299-ef09-4a76-a075-f694bef2b9c9",
    iconUrl: "https://www.figma.com/api/mcp/asset/2e245b4c-2131-461c-a509-fdcf44caf6a7",
  },
  {
    name: "Silky Oaks Lodge",
    region: "Daintree Rainforest",
    country: "Queensland, Australia",
    imageUrl: "https://www.figma.com/api/mcp/asset/a8f9434d-2288-4d56-9479-a279ff7af3b1",
    iconUrl: "https://www.figma.com/api/mcp/asset/a50aadaf-d06e-45a2-8a14-3f6c66c2ad00",
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
  console.log("🔧 Fixing Lodge Data in CMS\n");

  const email = process.env.CMS_EMAIL || "dev@sphereos.local";
  const password = process.env.CMS_PASSWORD || "password123";

  console.log("Logging in...");
  const token = await login(email, password);
  console.log("✅ Logged in\n");

  // Get existing home page content
  console.log("Fetching existing home page content...");
  const homeEntry = await getContentEntry(token, "home");

  if (!homeEntry) {
    console.error("❌ Home page content not found!");
    return;
  }

  console.log(`✅ Found home page entry (ID: ${homeEntry.id})\n`);

  // Log the structure
  console.log("Current data structure keys:", Object.keys(homeEntry.data));

  // The existing data has:
  // - title, metaTitle, metaDescription at top level
  // - data.hero, data.lodgeCarousel, etc. (the nested page data)
  const existingData = homeEntry.data;
  const nestedData = existingData.data as Record<string, unknown> || {};

  console.log("Nested data keys:", Object.keys(nestedData));

  // Update the nested lodgeCarousel
  const updatedNestedData = {
    ...nestedData,
    lodgeCarousel: {
      title: "Our Lodges",
      lodges: lodges,
    },
  };

  const updatedData = {
    ...existingData,
    data: updatedNestedData,
  };

  console.log("\nUpdating home page with correct lodge data...");
  console.log(`New lodge count: ${lodges.length}`);

  await updateContentEntry(token, homeEntry.id, updatedData);
  console.log("✅ Home page updated successfully!\n");

  // Verify
  console.log("Verifying update...");
  const verifyEntry = await getContentEntry(token, "home");
  const verifyNestedData = verifyEntry?.data?.data as Record<string, unknown> || {};
  const verifyLodges = (verifyNestedData?.lodgeCarousel as { lodges: unknown[] })?.lodges || [];
  console.log(`✅ Verified lodge count: ${verifyLodges.length}`);
}

main().catch(console.error);
