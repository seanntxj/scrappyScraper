import { Listing } from "./types";
import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
  );
  await page.goto("https://www.lazada.com.my/catalog/?q=iPhone");
  // await page.waitForSelector('div[data-qa-locator^="product"]', {
  //   timeout: 30_000,
  // });

  const cards = await page.$$eval(
    'div[data-qa-locator^="product"]',
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
        };

        return listingDetailsArr;
      });
    }
  );

  console.log(cards);

  await browser.close();
})();
