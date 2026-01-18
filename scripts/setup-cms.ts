/**
 * CMS Content Type Setup Script
 *
 * Run with: npx tsx scripts/setup-cms.ts
 *
 * This script creates the necessary content types for the Beckons website.
 */

const CMS_URL = "https://backend-production-162b.up.railway.app/graphql";
const ORGANIZATION_ID = "d146dc11-c3ff-4476-b725-1510f245b0ed";

interface Field {
  slug: string;
  name: string;
  type: "TEXT" | "RICH_TEXT" | "NUMBER" | "BOOLEAN" | "DATE" | "SELECT" | "MEDIA" | "REFERENCE" | "JSON";
  required?: boolean;
  sortOrder: number;
  description?: string;
}

interface ContentTypeInput {
  organizationId: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  fields: Field[];
}

async function login(email: string, password: string): Promise<string> {
  const response = await fetch(CMS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            accessToken
          }
        }
      `,
      variables: {
        input: { email, password },
      },
    }),
  });

  const result = await response.json();
  if (result.errors) {
    throw new Error(`Login failed: ${JSON.stringify(result.errors)}`);
  }
  return result.data.login.accessToken;
}

async function createContentType(token: string, input: ContentTypeInput): Promise<{ id: string; slug: string }> {
  const response = await fetch(CMS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        mutation CreateContentType($input: CreateContentTypeInput!) {
          createContentType(input: $input) {
            id
            slug
            name
          }
        }
      `,
      variables: { input },
    }),
  });

  const result = await response.json();
  if (result.errors) {
    // Check if it's a duplicate error
    if (result.errors[0]?.message?.includes("already exists")) {
      console.log(`  Content type "${input.slug}" already exists, skipping...`);
      return { id: "existing", slug: input.slug };
    }
    throw new Error(`Failed to create ${input.slug}: ${JSON.stringify(result.errors)}`);
  }
  return result.data.createContentType;
}

async function getContentTypeBySlug(token: string, slug: string): Promise<{ id: string } | null> {
  const response = await fetch(CMS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        query GetContentTypeBySlug($slug: String!, $organizationId: ID!) {
          contentTypeBySlug(slug: $slug, organizationId: $organizationId) {
            id
            slug
          }
        }
      `,
      variables: { slug, organizationId: ORGANIZATION_ID },
    }),
  });

  const result = await response.json();
  return result.data?.contentTypeBySlug || null;
}

async function main() {
  console.log("🚀 Starting CMS Content Type Setup\n");

  // Get credentials from environment or use defaults
  const email = process.env.CMS_EMAIL || "dev@sphereos.local";
  const password = process.env.CMS_PASSWORD || "password123";

  console.log(`Logging in as ${email}...`);
  const token = await login(email, password);
  console.log("✅ Logged in successfully\n");

  const contentTypes: ContentTypeInput[] = [
    // Site Settings
    {
      organizationId: ORGANIZATION_ID,
      slug: "site-settings",
      name: "Site Settings",
      description: "Global site settings including logo and brand info",
      icon: "settings",
      fields: [
        { slug: "logoUrl", name: "Logo URL", type: "TEXT", required: true, sortOrder: 0 },
        { slug: "logoAlt", name: "Logo Alt Text", type: "TEXT", required: true, sortOrder: 1 },
        { slug: "logoIconUrl", name: "Logo Icon URL", type: "TEXT", sortOrder: 2 },
        { slug: "brandName", name: "Brand Name", type: "TEXT", required: true, sortOrder: 3 },
      ],
    },

    // Footer
    {
      organizationId: ORGANIZATION_ID,
      slug: "site-footer",
      name: "Site Footer",
      description: "Footer content including newsletter, portfolio, and links",
      icon: "layout",
      fields: [
        { slug: "logoUrl", name: "Logo URL", type: "TEXT", sortOrder: 0 },
        { slug: "newsletterTitle", name: "Newsletter Title", type: "TEXT", sortOrder: 1 },
        { slug: "newsletterDescription", name: "Newsletter Description", type: "TEXT", sortOrder: 2 },
        { slug: "newsletterButtonText", name: "Newsletter Button Text", type: "TEXT", sortOrder: 3 },
        { slug: "portfolioTitle", name: "Portfolio Title", type: "TEXT", sortOrder: 4 },
        { slug: "portfolioDescription", name: "Portfolio Description", type: "TEXT", sortOrder: 5 },
        { slug: "lodges", name: "Lodges", type: "JSON", sortOrder: 6, description: "Array of lodge objects grouped by country" },
        { slug: "copyrightText", name: "Copyright Text", type: "TEXT", sortOrder: 7 },
      ],
    },

    // Page Content
    {
      organizationId: ORGANIZATION_ID,
      slug: "page-content",
      name: "Page Content",
      description: "Flexible page content with JSON data structure",
      icon: "document",
      fields: [
        { slug: "title", name: "Title", type: "TEXT", required: true, sortOrder: 0 },
        { slug: "data", name: "Page Data", type: "JSON", required: true, sortOrder: 1, description: "Structured page content" },
        { slug: "metaTitle", name: "Meta Title", type: "TEXT", sortOrder: 2 },
        { slug: "metaDescription", name: "Meta Description", type: "TEXT", sortOrder: 3 },
      ],
    },
  ];

  const results: Record<string, string> = {};

  for (const ct of contentTypes) {
    console.log(`Creating content type: ${ct.name}...`);

    // Check if it exists first
    const existing = await getContentTypeBySlug(token, ct.slug);
    if (existing) {
      console.log(`  ✅ "${ct.slug}" already exists (ID: ${existing.id})`);
      results[ct.slug] = existing.id;
      continue;
    }

    try {
      const created = await createContentType(token, ct);
      console.log(`  ✅ Created "${ct.slug}" (ID: ${created.id})`);
      results[ct.slug] = created.id;
    } catch (error) {
      console.error(`  ❌ Failed: ${error}`);
    }
  }

  console.log("\n📋 Content Type IDs:");
  console.log(JSON.stringify(results, null, 2));

  // Save checkpoint
  const checkpoint = {
    phase: 5,
    timestamp: new Date().toISOString(),
    contentTypes: results,
  };

  console.log("\n✅ CMS setup complete!");
  console.log("\nCheckpoint data:");
  console.log(JSON.stringify(checkpoint, null, 2));
}

main().catch(console.error);
