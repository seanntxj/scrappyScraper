import { sampleListings } from "./sample";
import { Listing } from "./types";
import carousellScraper from "./carousellScraper";

(async () => {
  carousellScraper(
    "https://www.carousell.com.my/search/Pixel%206?addRecent=false"
  ).then((results) => {
    type Condition = {
      nameBlacklist: Array<string>;
      nameMustInclude: Array<string>;
      priceRange: { min: 0; max: 10000 };
      minLikes: 0;
    };

    const conditions: Condition = {
      nameBlacklist: [],
      nameMustInclude: [],
      priceRange: { min: 0, max: 10000 },
      minLikes: 0,
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
      (listing: Listing) =>
        listing.likes != undefined ? listing.likes < conditions.minLikes : true,
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
