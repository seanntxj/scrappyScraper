import { Listing } from "./types";

/**
 * A function which takes in a Listing, and depending on its conditions, returns a boolean on whether or not the Listing passes the filter
 */
type FilterFunction = (listing: Listing) => boolean;

/**
 * Main filtering function that will accept an array of listings, and return a list of filtered listings
 * @param listings An array of Listing objects
 * @param filters An array of FilterFunctions
 * @returns
 */
export const filterListings = (listings: Listing[], filters: FilterFunction[]) => {
  return listings.filter((listing) =>
    filters.every((filter) => filter(listing))
  );
};

/**
 * Checks if a listing is within a certain price range
 * @param listing The Listing object
 * @param minPrice The minimum price a listing can be, 0 if not defined, inclusive
 * @param maxPrice The maximum price a listing can be, unlimited if not defined, inclusive
 * @returns 
 */
export const filterByPrice = (minPrice: number = 0, maxPrice: number = Infinity): FilterFunction => {
  return (listing: Listing) => listing.price >= minPrice && listing.price <= maxPrice;
}

/**
 * Checks if a listing's title has or doesn't have certain keywords (case insensitive)
 * @param listing The Listing object
 * @param mustInclude An array of strings that MUST be in a listing's title (recommended to be the same as your search term)
 * @param maxPrice An array of strings that MUST NOT be in a listing's title 
 * @returns 
 */
export const filterByKeywords = (mustInclude: string[], mustExclude: string[]): FilterFunction => {
  return (listing: Listing) => {
    const title = listing.name.toLowerCase(); // Convert title to lowercase for case-insensitive comparison

    // Check if the listing's title contains all the "mustInclude" keywords
    const includesAllKeywords = mustInclude.every(keyword => title.includes(keyword.toLowerCase()));

    // Check if the listing's title does not contain any of the "mustExclude" keywords
    const excludesNoKeywords = mustExclude.every(keyword => !title.includes(keyword.toLowerCase()));

    // Return true if the listing meets both conditions
    return includesAllKeywords && excludesNoKeywords;
  };
}
