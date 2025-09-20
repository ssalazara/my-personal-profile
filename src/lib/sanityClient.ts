// src/lib/sanityClient.ts
import { createClient } from "@sanity/client";
import type { SanityClient } from "@sanity/client";
import imageUrlBuilder from '@sanity/image-url'; // Import the image URL builder

// Notice that we are not reading import.meta.env here anymore.
// We are creating a function that ACCEPTS the config.
export function getSanityClient(config): SanityClient {
  return createClient({
    ...config,
    apiVersion: "2024-05-01",
    useCdn: false,
  });
}
export function urlFor(source, client) {
  return imageUrlBuilder(client).image(source);
}