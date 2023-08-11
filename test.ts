import { Listing } from "./types";
import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto("https://www.mudah.my/malaysia/for-sale?q=iPhone");
  await page.waitForSelector('div[data-testid^="listing"]', {
    timeout: 30_000,
  });

  const cards = await page.$$eval(
    'div[data-testid^="listing"]',
    (listingsHTML) => {
      return listingsHTML.map((listingHTML) => {
        const isFirstItemListingName = (item: string) => {
          return !(parseInt(item, 10).toString() === item);
        };

        const convertPriceToFloat = (paragraphContent: string | null) => {
          if (paragraphContent) {
            return parseFloat(paragraphContent.replace(/\D/g, ""));
          }
          return 0;
        };

        const combinedListingDetails = listingHTML.innerText.trim().split("\n");
        const listing: Listing = {
          name: isFirstItemListingName(combinedListingDetails[0])
            ? combinedListingDetails[0]
            : combinedListingDetails[1],
          price: isFirstItemListingName(combinedListingDetails[0])
            ? convertPriceToFloat(combinedListingDetails[1])
            : convertPriceToFloat(combinedListingDetails[2]),
          location: combinedListingDetails[combinedListingDetails.length - 1],
        };
        return listing;
      });
    }
  );

  console.log(cards);

  await browser.close();
})();
