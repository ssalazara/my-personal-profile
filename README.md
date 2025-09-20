***

## Project Implementation Guide: Building a Personal Profile with Stack 1

**Objective:** To build a modern, fast, and content-manageable personal profile website using a free, high-performance tech stack. The final result is a deployed static site with a flexible, two-column hero section, a skills showcase, and a project grid, all managed via a headless CMS.

**Final Result:**


### Core Technologies (Stack 1)

*   **Static Site Generator:** **Astro** - For building a fast, content-focused frontend with a component-based architecture.
*   **Headless CMS:** **Sanity.io** - For flexible, structured content modeling and a user-friendly editor interface.
*   **Hosting:** **Netlify** - For seamless, Git-based continuous deployment and global hosting.

---

### Part 1: Project Setup & Environment

This section covers the initial setup of the development environment and the Astro project.

#### 1.1. Environment Configuration
The project requires **Node.js** and **Git**. The recommended way to manage Node.js versions is with a tool like `fnm` or `nvm` to avoid permission issues.

#### 1.2. Astro Project Initialization
The project was created in a root directory (`my-personal-profile/`) using the command:
```bash
# Initialize a new Astro project in the current directory
npm create astro@latest .
```
The setup was configured with the "Empty" template and TypeScript enabled.

#### 1.3. VS Code Configuration
Key VS Code extensions for this stack include:
*   `astro.astro` (Official Astro support)
*   `esbenp.prettier-vscode` (Code formatting)
*   `sanity-io.vscode-sanity` (Sanity schema helpers)

---

### Part 2: Headless CMS Configuration (Sanity.io)

The content for the entire site is modeled and managed in Sanity.

#### 2.1. Sanity Project Initialization
A Sanity Studio project was initialized inside the Astro project's root, creating a `sanity-studio/` sub-directory.
```bash
# From the project root (my-personal-profile/)
sanity init
```

#### 2.2. Content Types (Schemas) Created
Two primary content models were created in the `sanity-studio/schemas/` directory:

1.  **`Project` (`project.ts`)**
    *   **Purpose:** To manage individual portfolio projects.
    *   **Fields:**
        *   `title` (String, required)
        *   `description` (Text)
        *   `projectUrl` (URL)

2.  **`Home Page` (`home.ts`) - A Singleton**
    *   **Purpose:** To manage all content for the unique homepage. This allows a non-developer to edit page copy without touching code.
    *   **Fields:**
        *   `heroTitle` (String, required)
        *   `heroSubtitle` (Text)
        *   `heroImage` (Image, with hotspot enabled)
        *   `heroImagePosition` (String, with a radio list of 'left' or 'right')
        *   `skillsTitle` (String)
        *   `skills` (Array of Strings)

#### 2.3. Sanity Studio Configuration (`sanity.config.ts`)
The created schemas were registered in the studio's configuration file to make them appear in the editor.

```typescript
// sanity-studio/sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import home from './schemas/home'
import project from './schemas/project'

export default defineConfig({
  // ...project details
  plugins: [structureTool()],
  schema: {
    // Both schemas are registered here
    types: [home, project],
  },
})
```

---

### Part 3: Connecting Astro to Sanity

This is the critical "plumbing" that allows the frontend to fetch data from the CMS.

#### 3.1. Environment Variables (`.env`)
A `.env` file in the project root securely stores the credentials needed to connect to the Sanity API. **This file is not committed to Git.**
```
# .env
PUBLIC_SANITY_PROJECT_ID="YOUR_PROJECT_ID"
PUBLIC_SANITY_DATASET="production"
PUBLIC_SANITY_API_VERSION="2024-05-01"
```

#### 3.2. Sanity Client Utility (`src/lib/sanityClient.ts`)
A reusable utility was created to configure the Sanity client and provide helper functions. **Crucially, the deprecated `astro-sanity` package was avoided in favor of the official `@sanity/client` and `@sanity/image-url` packages.**

```typescript
// src/lib/sanityClient.ts
import { createClient } from "@sanity/client";
import type { SanityClient } from "@sanity/client";
import imageUrlBuilder from '@sanity/image-url';

export function getSanityClient(config): SanityClient {
  return createClient({ ...config, apiVersion: "2024-05-01", useCdn: false });
}

export function urlFor(source, client) {
  return imageUrlBuilder(client).image(source);
}
```

#### 3.3. Fetching Data on the Homepage (`src/pages/index.astro`)
The homepage fetches all its data with a single, efficient GROQ query. The page is responsible for calling the `getSanityClient`, fetching the data, and passing it as props to the relevant components.

```astro
---
// src/pages/index.astro
import { getSanityClient } from '@/lib/sanityClient.ts';
// ... other imports

const query = `*[_type == "home"][0]{
  heroTitle, heroSubtitle, heroImage, heroImagePosition,
  skillsTitle, skills,
  "projects": *[_type == "project"]{ title, description, projectUrl }
}`;

const pageData = await getSanityClient({ /* config */ }).fetch(query);

const { heroTitle, heroSubtitle, heroImage, ... } = pageData || {};
---
<!-- Components are rendered here with the fetched data -->
<Hero title={heroTitle} image={heroImage} ... />
```

---

### Part 4: Frontend Development & Design System

The frontend was built using **Atomic Design** principles for scalability and maintainability.

#### 4.1. Project Structure
A clear folder structure was established within `src/` to organize components by their complexity:
*   `src/components/atoms/` (e.g., `SiteLogo.astro`, `NavLink.astro`)
*   `src/components/molecules/` (e.g., `PrimaryNavigation.astro`)
*   `src/components/organisms/` (e.g., `Header.astro`, `Hero.astro`, `ProjectCard.astro`)
*   `src/layouts/` (For page templates like `BaseLayout.astro`)
*   `src/styles/` (For global CSS and design tokens)

#### 4.2. Design Tokens & Global Styles (`src/styles/global.css`)
All design properties (colors, fonts) are managed as **CSS Custom Properties** in a central file. This allows for easy theming and ensures consistency.

```css
/* src/styles/global.css */
:root {
  /* Brand Colors */
  --color-brand-navy: #001f3f;
  /* Grayscale, etc. */
  --color-gray-900: #1a202c;

  /* Semantic Colors */
  --color-text-primary: var(--color-gray-900);
  --color-background-body: var(--color-gray-100);
}
```
This file is imported once in `src/layouts/BaseLayout.astro` to apply it everywhere.

#### 4.3. Key Components
*   **`BaseLayout.astro`:** The main site template. It includes the `<Header>`, `<Footer>`, global styles, and a `<slot />` where page-specific content is injected.
*   **`Header.astro`:** Composed of a `SiteLogo` atom and a `PrimaryNavigation` molecule.
*   **`Hero.astro`:** A powerful organism that accepts props for title, subtitle, and an image. It uses CSS Grid and conditional classes to dynamically place the image on the left or right based on the `imagePosition` prop received from Sanity.
*   **`ProjectCard.astro`:** A reusable card component for displaying a single project.

---

### Part 5: Deployment on Netlify

The site was deployed to Netlify via a direct connection to the project's GitHub repository.

*   **Build Command:** `npm run build`
*   **Publish Directory:** `dist`
*   **Environment Variables:** The same `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` variables from the local `.env` file were added to the Netlify site settings. This is a critical step that allows Netlify's build server to connect to Sanity during the build process.

---

### Key Learnings & Troubleshooting Guide

The development process revealed several common issues. Understanding these is key to a smooth workflow.

1.  **Port Conflicts:** Running multiple dev servers can lead to "zombie processes" that occupy ports (e.g., 4321, 4322).
    *   **Fix:** Use the command line to find and terminate the process holding the port. On macOS/Linux: `kill $(lsof -t -i:4321)`.

2.  **`tsconfig.json` Errors:** A syntax error (like a trailing comma) in `tsconfig.json` was the root cause of many module import failures. The build tool (Vite) cannot parse a broken JSON file, so path aliases like `@/` fail silently.
    *   **Fix:** Ensure `tsconfig.json` is valid JSON. Replacing it with a clean, default version is the fastest way to resolve this.

3.  **Path Alias (`@/`) Issues:** The `@/` alias (which points to `src/`) is configured in `tsconfig.json`. The dev server only reads this file on startup.
    *   **Fix:** **Always restart the dev server (`Ctrl+C`, `npm run dev`) after changing `tsconfig.json` or adding new top-level directories to `src/` (like `layouts` or `components`).**

4.  **Sanity Content Not Appearing:** If content is visible in the Studio but not on the site, it's almost always one of two issues:
    *   **Fix 1 (Unpublished Content):** The content was saved as a draft but not **Published**. The API only returns published documents by default.
    *   **Fix 2 (Data Plumbing):** The data was not correctly "plumbed" through the code. This involves a three-point check:
        1.  Is the field name (`heroImage`) present in the **GROQ query** in `index.astro`?
        2.  Is the variable being **destructured** from the fetch result?
        3.  Is the variable being passed as a **prop** to the child component (e.g., `<Hero image={heroImage} />`)?

5.  **Environment Variables:** Astro and Netlify only expose environment variables prefixed with `PUBLIC_`.
    *   **Fix:** Ensure all variables in the `.env` file and Netlify settings intended for browser/build access are named like `PUBLIC_SANITY_PROJECT_ID`.

-------------------------------------------------------

***

## Design System & Content Guide: Simon Salazar Personal Brand

### 1. Introduction & Philosophy

This document outlines the design system for the Simon Salazar personal profile website. Our design philosophy is centered on **clarity, professionalism, and content-first principles**. The interface is designed to be clean, fast, and accessible, creating a seamless experience that puts the focus on Simon's skills and work.

This guide serves as a single source of truth for our visual language and provides content creators with the specifications needed to maintain a high-quality, consistent brand presence.

---

### 2. Foundations: The Core Rules

These are the fundamental building blocks of our design language.

#### 2.1. Color Palette

Our color palette is concise and professional, built around a strong navy blue accent and a clean, neutral base.

**Primary Palette**
These colors define our brand's identity and are used for key interactive elements.

| Swatch | Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| 🔵 | **Brand Navy** | `#001f3f` | The primary brand color. Used for strong accents and link hover states to convey stability and expertise. |
| 🔷 | **Accent Blue** | `#007bff` | A vibrant, accessible blue used for primary links and calls-to-action to draw user attention. |

**Neutral Palette**
These shades provide the structure and hierarchy for our layout and typography.

| Swatch | Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| ⚫ | **Primary Text** | `#1a202c` | Near-black for all primary body text and headlines. Ensures maximum readability. |
| 🌑 | **Secondary Text** | `#4a5568` | A softer gray for subtitles, descriptions, and secondary information. |
| ⚪ | **Card Background** | `#ffffff` | Pure white for surfaces like project cards and the hero section to create a clean, crisp feel. |
| 🔘 | **Border / Divider** | `#e2e8f0` | A light gray for borders and dividers to subtly separate content sections. |
| ⬜ | **Page Background** | `#f4f7f9` | A very light off-white for the main page background to reduce eye strain compared to pure white. |

#### 2.2. Typography

Our typography is built on a single, highly-readable system font stack. This ensures fast load times and a native feel on any device.

*   **Font Family:** `system-ui, -apple-system, sans-serif`

**Typographic Scale**
A clear scale is used to establish hierarchy and guide the user's eye.

| Role | Font Size (rem / approx. px) | Font Weight | Usage Example |
| :--- | :--- | :--- | :--- |
| **Hero Title (H1)** | `clamp(2.5rem, 5vw, 3.5rem)` | **Bold** | "Hello, World!" |
| **Section Title (H2)** | `2rem` (32px) | **Bold** | "Core Skills", "Featured Projects" |
| **Card Title (H3)** | `1.25rem` (20px) | **Bold** | "My Personal Profile" |
| **Subtitle / Lede** | `1.125rem` (18px) | Normal | Hero subtitle, introductory paragraphs. |
| **Body Text** | `1rem` (16px) | Normal | All standard paragraph text. |
| **Link / Badge** | `1rem` (16px) | **Medium/Bold** | Navigation links, skill badges. |

#### 2.3. Spacing & Layout

A consistent spacing system creates a harmonious and balanced layout. Our system is based on an **8px base unit**.

*   **Base Unit:** `1x = 8px`
*   **Spacing Scale:**
    *   `0.5x` (4px) - Fine-tuning
    *   `1x` (8px) - Small gaps
    *   `2x` (16px) - Gaps between text elements (most common)
    *   `3x` (24px) - Gaps between components (e.g., project cards)
    *   `4x` (32px) - Gaps between larger content sections

**Layout Grid**
The main content of the site resides within a central container with a **maximum width of 960px**. This ensures comfortable line lengths for reading on large screens. On smaller screens, the layout adapts fluidly.

---

### 3. Components: The Building Blocks

These are the reusable UI elements that make up our pages.

| Component | Description | Key Specifications |
| :--- | :--- | :--- |
| **Header** | The main site navigation bar. It is "sticky" and remains visible at the top of the screen when scrolling. | **Height:** ~65px, **Background:** Card White, **Bottom Border:** 1px Border/Divider |
| **Hero Section** | The main introductory block on the homepage. It features a title, subtitle, and a prominent image in a 50/50 split on desktop. | **Padding:** `4rem` (64px) top/bottom, **Columns:** 2 (on desktop) |
| **Skill Badge** | A "pill-shaped" badge used to display individual skills. | **Padding:** `0.5rem 1.25rem`, **Border Radius:** `9999px` (fully rounded) |
| **Project Card** | A self-contained card for displaying a single portfolio project. | **Padding:** `1.5rem` (24px), **Border Radius:** `8px`, **Shadow:** Subtle, multi-layered |
| **Footer** | The site-wide footer containing copyright information. | **Background:** A shade darker than the page background (`#e2e8f0`) |

---

### 4. Content Guidelines & Specifications

To ensure the design remains effective, content should adhere to the following guidelines. This section is critical for anyone editing content in the Sanity CMS.

#### 4.1. Hero Image

The hero image is the most prominent visual on the site.

*   **Recommended Dimensions:** **1200 x 1200 pixels**. Uploading a square image provides the most flexibility for Sanity's hotspot and crop tools.
*   **Aspect Ratio:** The image will be displayed in a **vertical (`4:5`) or square (`1:1`) aspect ratio** on the page. Avoid wide, panoramic images as their main subject may be cropped out.
*   **Content Advice:**
    *   ✅ **Do:** Use high-quality, visually engaging images (photos, abstract graphics, illustrations).
    *   ✅ **Do:** Choose images where the main subject is centered. This works best with the automated cropping.
    *   ❌ **Don't:** Use images with embedded text. The text will not be responsive and may clash with the main headline.
*   **Technical Specs:**
    *   **Format:** `JPG` or `WEBP`.
    *   **File Size:** Aim for **under 250KB** to ensure fast page loads. Use tools like TinyPNG or Squoosh to optimize before uploading.

#### 4.2. Text & Copy

Concise and clear copy is essential for a strong user experience.

*   **Hero Title:** Keep it short and impactful.
    *   **Recommended Length:** **3 to 6 words**.
*   **Hero Subtitle:** A brief, one-sentence summary.
    *   **Recommended Length:** **10 to 20 words** (approx. 100-150 characters).
*   **Project Titles:** Use the official name of the project.
    *   **Recommended Length:** **2 to 4 words**.
*   **Project Descriptions:** Provide a concise summary of the project.
    *   **Recommended Length:** **1 to 3 sentences** (approx. 20-40 words).

By following these guidelines, we ensure that the website remains beautiful, consistent, and easy to use for all visitors, while empowering our team to manage content with confidence.