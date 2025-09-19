// src/lib/sanityClient.ts
import { createClient } from "@sanity/client";

// Notice that we are not reading import.meta.env here anymore.
// We are creating a function that ACCEPTS the config.
export function getSanityClient(config) {
  return createClient({
    // Spread the config object to pass projectId, dataset, etc.
    ...config,
    apiVersion: "2024-05-01",
    useCdn: false, // `false` for development to ensure fresh data
  });
}