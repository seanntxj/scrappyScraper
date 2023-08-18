const puppeteer = require("puppeteer");
import { Listing } from "./types";

/**
 * Scrapes Carousell webpage for all listings from the link given
 * @param link Carousell filled search link for a product. Highly encouraged to add sort to recent for best results.
 * Example: https://www.carousell.com.my/search/iPhone%2014%20Pro?addRecent=false&canChangeKeyword=false&includeSuggestions=false&searchId=2Ehwhj&sort_by=3
 * @returns All listing items seen from the search result
 */
const carousellScraper = async (link: string): Promise<Array<Listing>> => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const listingsHTMLContainer = 'div[data-testid^="listing"]';
  await page.goto(link);
  await page.waitForSelector(listingsHTMLContainer, {
    timeout: 30_000,
  });

  // For every instance of the div found with the listing data-testid tag, do this
  // Every returned object is then concatinated into an array
  const cards: Array<Listing> = await page.$$eval(
    listingsHTMLContainer,
    (listingsHTML: any[]) => {
      return listingsHTML.map((listingHTML) => {
        const listingDetailsArr = listingHTML.innerText
          .trim()
          .split("\n")
          .filter((item: string) => item.trim() !== "");

        const thirdItemIsCarousellProtect =
          listingDetailsArr[2] === "Protection" ||
          listingDetailsArr[2] === "InstantBuy";

        const lastItemIsLikes =
          listingDetailsArr[listingDetailsArr.length - 1].replace(/\D/g, "") !==
          "";

        const convertPriceToFloat = (paragraphContent: string) => {
          if (paragraphContent) {
            return parseFloat(paragraphContent.replace(/\D/g, ""));
          }
          return 0;
        };

        const carousellTimestampToTime = (strTimestamp: string) => {};

        const getTags = (): Array<string> => {
          const condition = thirdItemIsCarousellProtect
            ? listingDetailsArr[5]
            : listingDetailsArr[4];

          const possibleFreeShippingTag = lastItemIsLikes
            ? listingDetailsArr[listingDetailsArr.length - 2]
            : listingDetailsArr[listingDetailsArr.length - 1];

          const re = [
            thirdItemIsCarousellProtect ? listingDetailsArr[2] : null,
            condition,
            possibleFreeShippingTag === condition
              ? null
              : possibleFreeShippingTag,
          ];

          return re.filter((item) => item !== null);
        };

        const listing: Listing = {
          name: thirdItemIsCarousellProtect
            ? listingDetailsArr[3]
            : listingDetailsArr[2],
          price: thirdItemIsCarousellProtect
            ? convertPriceToFloat(listingDetailsArr[4])
            : convertPriceToFloat(listingDetailsArr[3]),
          tags: getTags(),
          sellerName: listingDetailsArr[0],
          timeStamp: listingDetailsArr[1],
          likes: lastItemIsLikes
            ? listingDetailsArr[listingDetailsArr.length - 1]
            : undefined,
        };

        return listing;
      });
    }
  );

  await browser.close();
  return cards;
};

export default carousellScraper;
