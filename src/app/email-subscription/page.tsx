import { getContentEntry, getFooterContent } from "@/lib/content";
import { FormPageHeader, StickyInquireButton } from "@/components/blocks";
import { Footer } from "@/components/layout";
import { Button } from "@/components/ui";
import type { FooterContent } from "@/types/content";

export const dynamic = "force-dynamic";

// Flat data structure matching CMS field definitions
interface EmailSubscriptionPageData {
  title: string;
  titleItalicPart?: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  videoMaskImageUrl: string;
  firstNameLabel: string;
  lastNameLabel: string;
  contactEmailLabel: string;
  countryRegionLabel: string;
  countryRegionPlaceholder: string;
  privacyText: string;
  privacyLinkText: string;
  privacyLinkUrl: string;
  submitButtonText: string;
}

export default async function EmailSubscriptionPage() {
  const [data, footerContent] = await Promise.all([
    getContentEntry<EmailSubscriptionPageData>("page-content", "email-subscription"),
    getFooterContent<FooterContent>(),
  ]);

  if (!data) {
    return <div>Loading...</div>;
  }

  const entry = "email-subscription";

  return (
    <main className="min-h-screen bg-limestone">
      <StickyInquireButton entry={entry} buttonText="BACK TO HOME" href="/" variant="secondary" />

      <FormPageHeader
        entry={entry}
        title={data.title}
        titleItalicPart={data.titleItalicPart}
        subtitle={data.subtitle}
        videoMaskImageUrl={data.videoMaskImageUrl}
      />

      <form className="max-w-[600px] mx-auto px-6 py-16">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              className="body-xs text-charcoal block mb-2"
              data-cms-entry={entry}
              data-cms-field="firstNameLabel"
            >
              {data.firstNameLabel}
            </label>
            <input
              type="text"
              required
              className="w-full border border-charcoal/25 bg-transparent px-3 py-3 focus:outline-none focus:border-burgundy"
            />
          </div>
          <div>
            <label
              className="body-xs text-charcoal block mb-2"
              data-cms-entry={entry}
              data-cms-field="lastNameLabel"
            >
              {data.lastNameLabel}
            </label>
            <input
              type="text"
              required
              className="w-full border border-charcoal/25 bg-transparent px-3 py-3 focus:outline-none focus:border-burgundy"
            />
          </div>
        </div>

        {/* Contact & Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              className="body-xs text-charcoal block mb-2"
              data-cms-entry={entry}
              data-cms-field="contactEmailLabel"
            >
              {data.contactEmailLabel}
            </label>
            <input
              type="email"
              required
              className="w-full border border-charcoal/25 bg-transparent px-3 py-3 focus:outline-none focus:border-burgundy"
            />
          </div>
          <div>
            <label
              className="body-xs text-charcoal block mb-2"
              data-cms-entry={entry}
              data-cms-field="countryRegionLabel"
            >
              {data.countryRegionLabel}
            </label>
            <select
              required
              className="w-full border border-charcoal/25 bg-transparent px-3 py-3 focus:outline-none focus:border-burgundy"
            >
              <option value="">{data.countryRegionPlaceholder}</option>
            </select>
          </div>
        </div>

        {/* Privacy */}
        <p className="body-xs text-charcoal mb-8">
          <span data-cms-entry={entry} data-cms-field="privacyText">
            {data.privacyText}
          </span>{" "}
          <a
            href={data.privacyLinkUrl}
            className="underline"
            data-cms-entry={entry}
            data-cms-field="privacyLinkText"
          >
            {data.privacyLinkText}
          </a>
        </p>

        {/* Submit */}
        <div className="flex justify-center">
          <Button
            type="submit"
            variant="secondary"
            data-cms-entry={entry}
            data-cms-field="submitButtonText"
          >
            {data.submitButtonText}
          </Button>
        </div>
      </form>

      {footerContent && <Footer content={footerContent} variant="burgundy" />}
    </main>
  );
}
