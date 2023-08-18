import { Listing } from "./types";
import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto("https://www.mudah.my/malaysia/all?q=Pixel+6");
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

        const listingDetailsArr = listingHTML.innerText.trim().split("\n");

        const listing: Listing = {
          name: isFirstItemListingName(listingDetailsArr[0])
            ? listingDetailsArr[0]
            : listingDetailsArr[1],
          price: isFirstItemListingName(listingDetailsArr[0])
            ? convertPriceToFloat(listingDetailsArr[1])
            : convertPriceToFloat(listingDetailsArr[2]),
          location: listingDetailsArr[listingDetailsArr.length - 1],
          timeStamp: listingDetailsArr[listingDetailsArr.length - 2],
        };

        return listing;
      });
    }
  );

  console.log(cards);

  await browser.close();
})();
