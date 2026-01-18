# CMS Global Entries

## Overview

Global entries contain content shared across all pages of the Beckons website.

## Entries

### Site Settings (`global-settings`)

**Content Type ID:** `81e25ab9-e6ff-477e-a816-6ad221aa4252`
**Entry ID:** `8eaa4f02-09f8-4d16-b7ad-6c415862676b`
**Slug:** `global-settings`

| Field | Type | Description |
|-------|------|-------------|
| `logoUrl` | TEXT | Full URL to the Beckons logo |
| `logoAlt` | TEXT | Alt text for logo |
| `logoIconUrl` | TEXT | URL for the compass logo icon |
| `brandName` | TEXT | "Beckons" |

---

### Site Footer (`global-footer`)

**Content Type ID:** `7de79163-3660-4f0d-9750-950c846b7913`
**Entry ID:** `ca7ca0c4-558d-4c7d-9552-b5c7d758393d`
**Slug:** `global-footer`

| Field | Type | Description |
|-------|------|-------------|
| `logoUrl` | TEXT | Footer logo URL |
| `newsletterTitle` | TEXT | "Stay Connected" |
| `newsletterDescription` | TEXT | Mailing list description |
| `newsletterButtonText` | TEXT | "SUBSCRIBE NOW" |
| `portfolioTitle` | TEXT | "Our Portfolio" |
| `portfolioDescription` | TEXT | Portfolio section description |
| `lodges` | JSON | Array of country objects with lodges |
| `copyrightText` | TEXT | Copyright notice |

#### Lodges Structure

```json
{
  "lodges": [
    {
      "country": "Australia",
      "lodges": [
        { "name": "Capella Lodge", "location": "Lord Howe Island, New South Wales" },
        { "name": "Longitude 131°", "location": "Uluru-Kata Tjuta, Northern Territory" },
        { "name": "Silky Oaks Lodge", "location": "Daintree Rainforest, North Queensland" },
        { "name": "Southern Ocean Lodge", "location": "Kangaroo Island, South Australia" },
        { "name": "The Louise", "location": "Barossa Valley, South Australia" }
      ]
    },
    {
      "country": "New Zealand",
      "lodges": [
        { "name": "Huka Lodge", "location": "Taupō, North Island" }
      ]
    },
    {
      "country": "Canada",
      "lodges": [
        { "name": "Clayoquot Wilderness Lodge", "location": "Vancouver Island" }
      ]
    },
    {
      "country": "Chile",
      "lodges": [
        { "name": "Tierra Atacama", "location": "Atacama Desert" },
        { "name": "Tierra Patagonia", "location": "Torres del Paine National Park" }
      ]
    }
  ]
}
```

---

## Usage in Components

```tsx
// Fetch footer content
const footer = await getContentEntry<FooterContent>("site-footer", "global-footer");

// Use with Editable wrapper
<Editable entry="global-footer" field="newsletterTitle" as="h4">
  {footer.newsletterTitle}
</Editable>
```
