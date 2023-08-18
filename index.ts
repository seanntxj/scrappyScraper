import { Listing } from "./types";
import carousellScraper from "./carousellScraper";

(async () => {
  carousellScraper(
    "https://www.carousell.com.my/search/iPhone 14 Pro?addRecent=false&canChangeKeyword=false&includeSuggestions=false&sort_by=3"
  ).then((results) => {
    console.log(results);
    type Condition = {
      nameBlacklist: Array<string>;
      nameMustInclude: Array<string>;
      priceRange: { min: 0; max: 10000 };
    };

    const conditions: Condition = {
      nameBlacklist: [],
      nameMustInclude: [],
      priceRange: { min: 0, max: 10000 },
    };

    const filters = [
      (listing: Listing) =>
        conditions.nameBlacklist.length > 0 &&
        conditions.nameBlacklist.some((keyword) =>
          listing.name.toLowerCase().includes(keyword.toLowerCase())
        ),
      (listing: Listing) =>
        conditions.nameMustInclude.length > 0 &&
        !conditions.nameMustInclude.some((keyword) =>
          listing.name.toLowerCase().includes(keyword.toLowerCase())
        ),
      (listing: Listing) =>
        listing.price < conditions.priceRange.min ||
        listing.price > conditions.priceRange.max,
    ];

    const filteredResults = filterResults(results, filters);
    console.log(filteredResults);
  });
})();

function filterResults(
  results: Array<Listing>,
  filters: ((listing: Listing) => boolean)[]
) {
  return results.filter((listing) => {
    return filters.every((condition) => !condition(listing));
  });
}
