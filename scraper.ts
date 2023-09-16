import puppeteer from "puppeteer";

/**
 * Scrapes a webpage for all listings from the link given
 * @param link A filled search link for a product. Highly encouraged to add sort to recent for best results.
 * Example: https://www.carousell.com.my/search/iPhone%2014%20Pro?addRecent=false&canChangeKeyword=false&includeSuggestions=false&searchId=2Ehwhj&sort_by=3
 * @param containerForListings The HTML element which contains a SINGLE listing.
 * Example for Carousell & Mudah: 'div[data-testid^="listing"]'
 * @returns An array of all the text that can be found for each container of a listing, with any href links appended at the end
 */
const scraper = async (
  link: string,
  containerForListings: string
): Promise<Array<string>> => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(link);
  await page.waitForSelector(containerForListings, {
    timeout: 30_000,
  });

  // For every instance of the div found with the listing data-testid tag, do this
  // Every returned object is then concatinated into an array
  const cards: Array<string> = await page.$$eval(
    containerForListings,
    (listingsHTML: any[]) => {
      return listingsHTML.map((listingHTML) => {
        const link = Array.from(listingHTML.querySelectorAll("a[href]"))
          .map((a: any) => a.getAttribute("href"))
          .join("\n");
        const text = listingHTML.innerText
          .trim()
          .split("\n")
          .filter((item: string) => item.trim() !== "");
        text.push(link);
        return text;
      });
    }
  );

  await browser.close();
  return cards;
};

export default scraper;
