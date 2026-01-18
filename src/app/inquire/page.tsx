import { getContentEntry, getFooterContent } from "@/lib/content";
import { FormPageHeader, StickyInquireButton } from "@/components/blocks";
import { Footer } from "@/components/layout";
import { Button } from "@/components/ui";
import type { FooterContent } from "@/types/content";

export const dynamic = "force-dynamic";

interface InquirePageData {
  title: string;
  titleItalicPart?: string;
  subtitle: string;
  videoMaskImageUrl: string;
  firstNameLabel: string;
  lastNameLabel: string;
  contactEmailLabel: string;
  contactPhoneLabel: string;
  countryRegionLabel: string;
  countryRegionPlaceholder: string;
  yourEnquiryLabel: string;
  subscribeCheckboxText: string;
  privacyText: string;
  privacyLinkText: string;
  privacyLinkUrl: string;
  submitButtonText: string;
}

interface PageEntry {
  title: string;
  data: InquirePageData;
  metaTitle: string;
  metaDescription: string;
}

export default async function InquirePage() {
  const [pageEntry, footerContent] = await Promise.all([
    getContentEntry<PageEntry>("page-content", "inquire"),
    getFooterContent<FooterContent>(),
  ]);

  if (!pageEntry) {
    return <div>Loading...</div>;
  }

  const { data } = pageEntry;
  const entry = "inquire";

  return (
    <main className="min-h-screen bg-limestone">
      <StickyInquireButton entry={entry} buttonText="INQUIRE NOW" href="/inquire" />

      <FormPageHeader
        entry={entry}
        title={data.title}
        titleItalicPart={data.titleItalicPart}
        subtitle={data.subtitle}
        videoMaskImageUrl={data.videoMaskImageUrl}
      />

      <form className="max-w-[600px] mx-auto px-6 py-16">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-6 mb-6">
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
              className="w-full border-b border-charcoal/25 bg-transparent py-2 focus:outline-none focus:border-burgundy"
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
              className="w-full border-b border-charcoal/25 bg-transparent py-2 focus:outline-none focus:border-burgundy"
            />
          </div>
        </div>

        {/* Contact Fields */}
        <div className="grid grid-cols-2 gap-6 mb-6">
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
              className="w-full border-b border-charcoal/25 bg-transparent py-2 focus:outline-none focus:border-burgundy"
            />
          </div>
          <div>
            <label
              className="body-xs text-charcoal block mb-2"
              data-cms-entry={entry}
              data-cms-field="contactPhoneLabel"
            >
              {data.contactPhoneLabel}
            </label>
            <input
              type="tel"
              required
              className="w-full border-b border-charcoal/25 bg-transparent py-2 focus:outline-none focus:border-burgundy"
            />
          </div>
        </div>

        {/* Country/Region */}
        <div className="grid grid-cols-2 gap-6 mb-6">
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
              className="w-full border-b border-charcoal/25 bg-transparent py-2 focus:outline-none focus:border-burgundy"
            >
              <option value="">{data.countryRegionPlaceholder}</option>
            </select>
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
              className="w-full border-b border-charcoal/25 bg-transparent py-2 focus:outline-none focus:border-burgundy"
            >
              <option value="">{data.countryRegionPlaceholder}</option>
            </select>
          </div>
        </div>

        {/* Your Enquiry */}
        <div className="mb-8">
          <label
            className="body-xs text-charcoal block mb-2"
            data-cms-entry={entry}
            data-cms-field="yourEnquiryLabel"
          >
            {data.yourEnquiryLabel}
          </label>
          <textarea
            required
            rows={4}
            className="w-full border-b border-charcoal/25 bg-transparent py-2 focus:outline-none focus:border-burgundy resize-none"
          />
        </div>

        {/* Subscribe Checkbox */}
        <label className="flex items-start gap-3 mb-6">
          <input
            type="checkbox"
            className="w-4 h-4 border border-charcoal/25 mt-1"
          />
          <span
            className="body-xs text-charcoal"
            data-cms-entry={entry}
            data-cms-field="subscribeCheckboxText"
          >
            {data.subscribeCheckboxText}
          </span>
        </label>

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

      {footerContent && <Footer content={footerContent} />}
    </main>
  );
}
