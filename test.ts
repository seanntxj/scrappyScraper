import { Listing } from "./types";
import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
  );
  await page.goto("https://www.mudah.my/malaysia/for-sale?q=Samsung");

  const cards = await page.$$eval(
    'div[data-qa-locator^="general"]',
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
        // const listing: Listing = {
        //   name: isFirstItemListingName(combinedListingDetails[0])
        //     ? combinedListingDetails[0]
        //     : combinedListingDetails[1],
        //   price: isFirstItemListingName(combinedListingDetails[0])
        //     ? convertPriceToFloat(combinedListingDetails[1])
        //     : convertPriceToFloat(combinedListingDetails[2]),
        //   location: combinedListingDetails[combinedListingDetails.length - 1],
        // };
        return combinedListingDetails;
      });
    }
  );

  console.log(cards);

  await browser.close();
})();
