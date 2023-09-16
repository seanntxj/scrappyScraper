import scraper from "./scraper";
import carousellRawDataToListings from "./converters/carousellRawDataToListing";
import { filterByKeywords, filterByPrice, filterListings } from "./filters";

(async () => {

  const name = 'iPhone 14 Pro';
  const region = 'my';
  const minPrice = 3200;
  const maxPrice = 3600;
  const keywords = ['iPhone', '14', 'Pro']
  const blacklist = ['13', '12', '11', 'insurance', 's22', 's23']

  const rawCarousellListings = await scraper(
    `https://www.carousell.com.my/search/${name}?addRecent=false&canChangeKeyword=false&includeSuggestions=false&price_end=${maxPrice}&price_start=${minPrice}&&sort_by=3`,
    'div[data-testid^="listing"]'
  );

  const organisedCarousellListings = carousellRawDataToListings(rawCarousellListings, region);

  const filteredCarousellListings = filterListings(organisedCarousellListings, [filterByPrice(minPrice, maxPrice), filterByKeywords(keywords, blacklist)])

  console.log(filteredCarousellListings);
})();
