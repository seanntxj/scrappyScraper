import { specificScraper, genericScraper } from './scraper';
import carousellRawDataToListings from "./converters/carousellRawDataToListing";
import { filterByElaspedTime, filterByKeywords, filterByPrice, filterListings } from "./filters";
import fs from "fs";
import mudahRawDataToListings from "./converters/mudahRawDataToListing";
import { rawListingToStructuredListing } from './langchain';
import { removeTextAfterSubtext, removeTextBeforeSubtext } from './helpers';
import { LangchainListingSchema } from './types';


const saveSeenListing = (url: string) => {
  fs.appendFileSync("seenListings.txt", url + "\n");
};

const getSeenListings = () => {
  try {
    const seenListings = fs
      .readFileSync("seenListings.txt", "utf-8")
      .split("\n");
    return seenListings.filter((url) => url.trim() !== ""); // Remove empty lines
  } catch (error) {
    return [];
  }
};

export const scrapeCarousellForPhones = async () => {
  const name = "iPhone 15 Pro";
  const region = "my";
  const minPrice = 4650;
  const maxPrice = 5000;
  const keywords = ["15", "Pro"];
  const blacklist = ["14", "13", "12", "11", "insurance", "s22", "s23"];

  const rawCarousellListings = await specificScraper(
    `https://www.carousell.com.my/search/${name}?addRecent=false&canChangeKeyword=false&includeSuggestions=false&price_end=${maxPrice}&price_start=${minPrice}&&sort_by=3`,
    'div[data-testid^="listing"]'
  );

  console.log(rawCarousellListings);

  const organisedCarousellListings = rawCarousellListings.map(eachListing => carousellRawDataToListings(eachListing, region));
    
  console.log(organisedCarousellListings);

  const filteredCarousellListings = filterListings(organisedCarousellListings, [
    filterByPrice(minPrice, maxPrice),
    filterByKeywords(keywords, blacklist),
    filterByElaspedTime(60*60*24*14),
  ]);

  const seenListings = getSeenListings();
  const newFilteredListings = filteredCarousellListings.filter(
    (listing) => !seenListings.includes(listing.link)
  );

  newFilteredListings.forEach((listing) => {
    saveSeenListing(listing.link);
  });

  return newFilteredListings;
};

export const scrapeMudahForPhones = async () => {
  const name = "iPhone 15 Pro";
  const region = "penang";
  const minPrice = 4650;
  const maxPrice = 5000;
  const keywords = ["15", "Pro"];
  const blacklist = ["14", "13", "12", "11", "insurance", "s22", "s23"];

  const rawMudahListings = await specificScraper(
    `https://www.mudah.my/${region}/all?q=${name}`,
    'div[data-testid^="listing"]'
  );

  const organisedMudahListings = mudahRawDataToListings(
    rawMudahListings,
  );


  const filteredCarousellListings = filterListings(organisedMudahListings, [
    filterByPrice(minPrice, maxPrice),
    filterByKeywords(keywords, blacklist),
    filterByElaspedTime(60*60*24*14),
  ]);


  const seenListings = getSeenListings();
  const newFilteredListings = filteredCarousellListings.filter(
    (listing) => !seenListings.includes(listing.link)
  );

  newFilteredListings.forEach((listing) => {
    saveSeenListing(listing.link);
  });

  return newFilteredListings;
};

(async () => {
  // const x = await genericScraper("https://www.carousell.com.my/search/iphone%2015%20pro?addRecent=true&canChangeKeyword=true")
  // const x = await genericScraper("https://www.carousell.com.my/search/ifi%20zen%20dac?addRecent=true&canChangeKeyword=true&includeSuggestions=true&searchId=fT4e8E")
  const x = await genericScraper("https://www.mudah.my/malaysia/all?q=ifi")
  const m = removeTextAfterSubtext(removeTextBeforeSubtext(x, ["SORT"]), ["Advertisement"])
  // const z = removeTextBeforeSubtext(removeTextAfterSubtext(x, ['Top searches']), ['Advertisement'])
  console.log(m);
  const y = await rawListingToStructuredListing(m, LangchainListingSchema);
  console.log(y);
})();
