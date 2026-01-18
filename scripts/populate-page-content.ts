/**
 * Populate Page Content in CMS
 *
 * Run with: npx tsx scripts/populate-page-content.ts
 */

const CMS_URL = "https://backend-production-162b.up.railway.app/graphql";
const ORGANIZATION_ID = "d146dc11-c3ff-4476-b725-1510f245b0ed";

// Content Type IDs from Phase 5
const PAGE_CONTENT_TYPE_ID = "07c14638-aced-4140-aa25-b7658ed17639";

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

async function createContentEntry(
  token: string,
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
          createContentEntry(input: $input) { id slug }
        }
      `,
      variables: {
        input: {
          contentTypeId: PAGE_CONTENT_TYPE_ID,
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
  console.log("🚀 Populating Page Content\n");

  const email = "dev@sphereos.local";
  const password = "password123";

  console.log("Logging in...");
  const token = await login(email, password);
  console.log("✅ Logged in\n");

  // =============================================
  // HOME PAGE
  // =============================================
  console.log("Creating Home page content...");
  const homePageData = {
    title: "Home",
    metaTitle: "Beckons | A Global Curator of Remarkable Journeys",
    metaDescription: "Introducing Beckons, a global curator of remarkable journeys of discovery. Uniting Baillie Lodges and Tierra Hotels.",
    data: {
      hero: {
        logoUrl: "https://www.figma.com/api/mcp/asset/40aeaa38-fe51-40fa-b951-f8095866aaeb",
        logoAlt: "Beckons",
        videoUrl: null, // Would be populated with actual video URL
        posterUrl: "https://www.figma.com/api/mcp/asset/bc7e60aa-3f00-49cd-ac95-f605eb63c38b",
      },
      intro: {
        headline: "Introducing Beckons, a global curator of remarkable journeys of discovery.",
        ctaText: "Take a closer look",
        ctaUrl: "#video",
      },
      videoMask: {
        imageUrl: "https://www.figma.com/api/mcp/asset/094b5e5e-fd42-4b86-b872-a2b14c5fd421",
      },
      about: {
        title: "A World That Calls to You",
        titleItalicPart: "Calls",
        body: `The modern luxury traveler is seeking something deeper—authentic connection to place, people, and culture. Beckons answers that call.

Uniting the acclaimed portfolios of Baillie Lodges and Tierra Hotels, Beckons represents a new standard in experiential travel. Our global collection of stays is purpose-built for immersion, offering guests privileged access to the world's most extraordinary destinations through the eyes of those who know them best.

What began as a collection of exceptional lodges has evolved into something greater: a curator of meaningful travel experiences for guests who seek both luxury and authenticity.

Join us. The journey begins March 2026.`,
        ctaText: "EXPLORE OUR BROCHURE",
        ctaUrl: "/brochure",
      },
      lodgeCarousel: {
        title: "Our Lodges",
        lodges: [
          {
            name: "Southern Ocean Lodge",
            region: "Kangaroo Island",
            country: "South Australia, Australia",
            imageUrl: "https://www.figma.com/api/mcp/asset/bc7e60aa-3f00-49cd-ac95-f605eb63c38b",
            iconUrl: "https://www.figma.com/api/mcp/asset/6b3d0197-6220-447f-9de0-8f6d80feb2a4",
          },
          {
            name: "Capella Lodge",
            region: "Lord Howe Island",
            country: "New South Wales, Australia",
            imageUrl: "https://www.figma.com/api/mcp/asset/bc7e60aa-3f00-49cd-ac95-f605eb63c38b",
          },
          {
            name: "Longitude 131°",
            region: "Uluru-Kata Tjuta",
            country: "Northern Territory, Australia",
            imageUrl: "https://www.figma.com/api/mcp/asset/bc7e60aa-3f00-49cd-ac95-f605eb63c38b",
          },
        ],
      },
      whyBeckons: {
        title: "The Texture of Our Journeys",
        description: "A Beckons stay moves with where you are. It's felt in the people who host you, the places they reveal, and the way each day unfolds—sometimes outward, sometimes inward. One moment might take you hiking across headlands, sailing through reef shallows, or listening as a guide shares the story behind a stretch of land. The next might invite stillness: slow rituals, a long lunch, or a rainforest massage as the Mossman River flows nearby.",
        cards: [
          {
            title: "Places Worth Reaching",
            description: "We choose our locations for what they open up—for their natural beauty, cultural depth and the way they shift your perspective.",
            imageUrl: "https://www.figma.com/api/mcp/asset/ad81622f-70fb-48b8-a918-445ee9f7a631",
          },
          {
            title: "Built for where we are",
            description: "Design is shaped by landscape, not layered over it. Architecture, interiors and spatial rhythms are developed in response to place at every level.",
            imageUrl: "https://www.figma.com/api/mcp/asset/f32c0a8f-394f-4311-98dc-ca2daf49e7f9",
          },
          {
            title: "intentionally local",
            description: "We collaborate with people who know a place intimately—artists, producers, guides—so that what's shared feels real, rather than performed.",
            imageUrl: "https://www.figma.com/api/mcp/asset/9c9262a2-aaa8-4eb3-a591-1879356abf41",
          },
        ],
      },
      stickyButtonText: "INQUIRE NOW",
    },
  };

  try {
    const result = await createContentEntry(token, "home", homePageData);
    console.log(`  ✅ Created page-content/home (ID: ${result.id})\n`);
  } catch (error) {
    console.error(`  ❌ Failed:`, error);
  }

  // =============================================
  // EMAIL SUBSCRIPTION PAGE
  // =============================================
  console.log("Creating Email Subscription page content...");
  const emailSubscriptionData = {
    title: "Email Subscription",
    metaTitle: "Subscribe | Beckons",
    metaDescription: "Join our mailing list for the latest on new destinations, seasonal offers and what's unfolding across the Beckons collection.",
    data: {
      title: "A World That Calls to You",
      titleItalicPart: "Calls",
      subtitle: "Share your details below to receive updates as Beckons comes to life and its story begins to unfold.",
      videoMaskImageUrl: "https://www.figma.com/api/mcp/asset/094b5e5e-fd42-4b86-b872-a2b14c5fd421",
      titleOptions: ["Mr", "Prof.", "Mrs.", "Sir", "Miss", "Mx", "Dr"],
      firstNameLabel: "First name*",
      lastNameLabel: "Last name*",
      contactEmailLabel: "Contact email*",
      countryRegionLabel: "Your country/region*",
      countryRegionPlaceholder: "Please select",
      preferredLanguageLabel: "Preferred language",
      preferredLanguagePlaceholder: "Please select",
      interestsLabel: "Interests",
      interests: [
        { value: "adventure-travel", label: "Adventure Travel" },
        { value: "family-travel", label: "Family Travel" },
        { value: "spa-wellness", label: "Spa & Wellness" },
        { value: "groups", label: "Groups" },
        { value: "art-culture", label: "Art & Culture" },
        { value: "special-celebrations", label: "Special Celebrations" },
        { value: "culinary", label: "Culinary" },
      ],
      typeOfEnquiryLabel: "Type of enquiry*",
      typeOfEnquiryPlaceholder: "Please select",
      subscribeCheckboxText: "Subscribe to Beckons for updates from our lodges in Australia, Canada, Chile and New Zealand",
      privacyText: "Read our",
      privacyLinkText: "Privacy Policy",
      privacyLinkUrl: "/privacy",
      submitButtonText: "SUBMIT",
    },
  };

  try {
    const result = await createContentEntry(token, "email-subscription", emailSubscriptionData);
    console.log(`  ✅ Created page-content/email-subscription (ID: ${result.id})\n`);
  } catch (error) {
    console.error(`  ❌ Failed:`, error);
  }

  // =============================================
  // INQUIRE NOW PAGE
  // =============================================
  console.log("Creating Inquire Now page content...");
  const inquireNowData = {
    title: "Inquire Now",
    metaTitle: "Inquire | Beckons",
    metaDescription: "Get in touch with Beckons for general inquiries as we continue to take shape.",
    data: {
      title: "A World That Calls to You",
      titleItalicPart: "Calls",
      subtitle: "Share your details below for general inquiries as Beckons continues to take shape.",
      videoMaskImageUrl: "https://www.figma.com/api/mcp/asset/094b5e5e-fd42-4b86-b872-a2b14c5fd421",
      firstNameLabel: "First name*",
      lastNameLabel: "Last name*",
      contactEmailLabel: "Contact email*",
      contactPhoneLabel: "Contact phone*",
      countryRegionLabel: "Your country/region*",
      countryRegionPlaceholder: "Please select",
      yourEnquiryLabel: "Your enquiry*",
      subscribeCheckboxText: "Subscribe to Beckons Lodges for updates from our lodges",
      privacyText: "Read our",
      privacyLinkText: "Privacy Policy",
      privacyLinkUrl: "/privacy",
      submitButtonText: "SUBMIT",
    },
  };

  try {
    const result = await createContentEntry(token, "inquire", inquireNowData);
    console.log(`  ✅ Created page-content/inquire (ID: ${result.id})\n`);
  } catch (error) {
    console.error(`  ❌ Failed:`, error);
  }

  // =============================================
  // THANK YOU PAGE
  // =============================================
  console.log("Creating Thank You page content...");
  const thankYouData = {
    title: "Thank You",
    metaTitle: "Thank You | Beckons",
    metaDescription: "Your details have been received successfully.",
    data: {
      title: "Thank You!",
      message: "Your details have been received successfully. We appreciate your interest in Beckons and the world taking shape around it.",
      backgroundImageUrl: "https://www.figma.com/api/mcp/asset/bc7e60aa-3f00-49cd-ac95-f605eb63c38b",
    },
  };

  try {
    const result = await createContentEntry(token, "thank-you", thankYouData);
    console.log(`  ✅ Created page-content/thank-you (ID: ${result.id})\n`);
  } catch (error) {
    console.error(`  ❌ Failed:`, error);
  }

  console.log("✅ Page content population complete!");
}

main().catch(console.error);
