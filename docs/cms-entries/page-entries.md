# CMS Page Entries

## Overview

Page entries contain content for each page of the Beckons website, stored in the `page-content` content type.

## Content Type

**ID:** `07c14638-aced-4140-aa25-b7658ed17639`
**Slug:** `page-content`

## Page Entries

### Home Page

**Entry ID:** `fc98474f-a71d-4599-a296-d64726e8673e`
**Slug:** `home`

| Section | Fields |
|---------|--------|
| Hero | `logoUrl`, `logoAlt`, `videoUrl`, `posterUrl` |
| Intro | `headline`, `ctaText`, `ctaUrl` |
| Video Mask | `imageUrl` |
| About | `title`, `titleItalicPart`, `body`, `ctaText`, `ctaUrl` |
| Lodge Carousel | `title`, `lodges[]` (name, region, country, imageUrl, iconUrl) |
| Why Beckons | `title`, `description`, `cards[]` (title, description, imageUrl) |
| Sticky Button | `stickyButtonText` |

---

### Email Subscription Page

**Entry ID:** `e78296e8-edd9-4318-8787-49cc0e9421a3`
**Slug:** `email-subscription`

| Field | Description |
|-------|-------------|
| `title` | "A World That Calls to You" |
| `titleItalicPart` | "Calls" |
| `subtitle` | Form description |
| `videoMaskImageUrl` | Header image |
| `titleOptions` | Title dropdown options |
| `interests` | Interest checkbox options |
| `*Label` fields | Form field labels |
| `submitButtonText` | Button text |
| `privacyText`, `privacyLinkText`, `privacyLinkUrl` | Privacy policy link |

---

### Inquire Now Page

**Entry ID:** `ba5795a1-0baf-4a49-8efa-0eab67c39db5`
**Slug:** `inquire`

| Field | Description |
|-------|-------------|
| `title` | "A World That Calls to You" |
| `titleItalicPart` | "Calls" |
| `subtitle` | Form description |
| `videoMaskImageUrl` | Header image |
| `*Label` fields | Form field labels |
| `yourEnquiryLabel` | Textarea label |
| `submitButtonText` | Button text |

---

### Thank You Page

**Entry ID:** `66bc65ce-369f-4ef9-8843-9aa298372208`
**Slug:** `thank-you`

| Field | Description |
|-------|-------------|
| `title` | "Thank You!" |
| `message` | Confirmation message |
| `backgroundImageUrl` | Hero background image |

---

## Usage

```tsx
// Fetch page content
const pageContent = await getContentEntry<HomePageContent>("page-content", "home");

// Access nested data
const heroData = pageContent.data.hero;
const aboutData = pageContent.data.about;
```
