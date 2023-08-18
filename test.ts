import scraper from "./scraper";
import carousellRawDataToListings from "./carousellRawDataToListing";
(async () => {
  const res = await scraper(
    "https://www.carousell.com.my/search/iPhone 14 Pro?addRecent=false&canChangeKeyword=false&includeSuggestions=false&sort_by=3",
    'div[data-testid^="listing"]'
  );

  console.log(carousellRawDataToListings(res));
})();
