import scraper from "./scraper";
import carousellRawDataToListings from "./converters/carousellRawDataToListing";
import { filterByElaspedTime, filterByKeywords, filterByPrice, filterListings } from "./filters";
import fs from "fs";
import mudahRawDataToListings from "./converters/mudahRawDataToListing";

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
  const name = "iPhone 14 Pro";
  const region = "my";
  const minPrice = 3200;
  const maxPrice = 3600;
  const keywords = ["iPhone", "14", "Pro"];
  const blacklist = ["13", "12", "11", "insurance", "s22", "s23"];

  const rawCarousellListings = await scraper(
    `https://www.carousell.com.my/search/${name}?addRecent=false&canChangeKeyword=false&includeSuggestions=false&price_end=${maxPrice}&price_start=${minPrice}&&sort_by=3`,
    'div[data-testid^="listing"]'
  );

  const organisedCarousellListings = carousellRawDataToListings(
    rawCarousellListings,
    region
  );

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
  const name = "iPhone 14 Pro";
  const region = "penang";
  const minPrice = 3000;
  const maxPrice = 3700;
  const keywords = ["iPhone", "14", "Pro"];
  const blacklist = ["13", "12", "11", "insurance", "s22", "s23"];

  const rawMudahListings = await scraper(
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

// (async () => {
//   const result = await scrapeMudahForPhones();
//   console.log(result);
// })();
