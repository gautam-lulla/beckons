import { getContentEntry, getFooterContent } from "@/lib/content";
import { FormPageHeader, StickyInquireButton } from "@/components/blocks";
import { Footer } from "@/components/layout";
import { Button } from "@/components/ui";
import type { FooterContent } from "@/types/content";

export const dynamic = "force-dynamic";

interface EmailSubscriptionPageData {
  title: string;
  titleItalicPart?: string;
  subtitle: string;
  videoMaskImageUrl: string;
  titleOptions: string[];
  firstNameLabel: string;
  lastNameLabel: string;
  contactEmailLabel: string;
  countryRegionLabel: string;
  countryRegionPlaceholder: string;
  preferredLanguageLabel: string;
  preferredLanguagePlaceholder: string;
  interestsLabel: string;
  interests: Array<{ value: string; label: string }>;
  typeOfEnquiryLabel: string;
  typeOfEnquiryPlaceholder: string;
  subscribeCheckboxText: string;
  privacyText: string;
  privacyLinkText: string;
  privacyLinkUrl: string;
  submitButtonText: string;
}

interface PageEntry {
  title: string;
  data: EmailSubscriptionPageData;
  metaTitle: string;
  metaDescription: string;
}

export default async function EmailSubscriptionPage() {
  const [pageEntry, footerContent] = await Promise.all([
    getContentEntry<PageEntry>("page-content", "email-subscription"),
    getFooterContent<FooterContent>(),
  ]);

  if (!pageEntry) {
    return <div>Loading...</div>;
  }

  const { data } = pageEntry;
  const entry = "email-subscription";

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
        {/* Title Selection */}
        <fieldset className="mb-8">
          <legend
            className="body-xs text-charcoal mb-4"
            data-cms-entry={entry}
            data-cms-field="titleOptions"
          >
            Title*
          </legend>
          <div className="flex flex-wrap gap-4">
            {data.titleOptions.map((option, index) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="title"
                  value={option}
                  className="w-4 h-4 border border-charcoal/25"
                />
                <span
                  className="body-xs text-charcoal"
                  data-cms-entry={entry}
                  data-cms-field={`titleOptions[${index}]`}
                >
                  {option}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

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

        {/* Contact & Country */}
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

        {/* Preferred Language */}
        <div className="mb-8">
          <label
            className="body-xs text-charcoal block mb-2"
            data-cms-entry={entry}
            data-cms-field="preferredLanguageLabel"
          >
            {data.preferredLanguageLabel}
          </label>
          <select className="w-full border-b border-charcoal/25 bg-transparent py-2 focus:outline-none focus:border-burgundy">
            <option value="">{data.preferredLanguagePlaceholder}</option>
          </select>
        </div>

        {/* Interests */}
        <fieldset className="mb-8">
          <legend
            className="body-xs text-charcoal mb-4"
            data-cms-entry={entry}
            data-cms-field="interestsLabel"
          >
            {data.interestsLabel}
          </legend>
          <div className="grid grid-cols-2 gap-4">
            {data.interests.map((interest, index) => (
              <label key={interest.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="interests"
                  value={interest.value}
                  className="w-4 h-4 border border-charcoal/25"
                />
                <span
                  className="body-xs text-charcoal"
                  data-cms-entry={entry}
                  data-cms-field={`interests[${index}].label`}
                >
                  {interest.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Type of Enquiry */}
        <div className="mb-8">
          <label
            className="body-xs text-charcoal block mb-2"
            data-cms-entry={entry}
            data-cms-field="typeOfEnquiryLabel"
          >
            {data.typeOfEnquiryLabel}
          </label>
          <select
            required
            className="w-full border-b border-charcoal/25 bg-transparent py-2 focus:outline-none focus:border-burgundy"
          >
            <option value="">{data.typeOfEnquiryPlaceholder}</option>
          </select>
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
