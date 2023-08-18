const puppeteer = require("puppeteer");
import { Listing } from "./types";

const carousellScraperOld = async (link: string): Promise<Array<Listing>> => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(link);

  const listings: Array<Listing> = [];
  const cards = await page.$$('div[data-testid^="listing-card"]');

  for (const card of cards) {
    const paragraphContents = await card.$$eval("p", (paragraphs: any[]) =>
      paragraphs.map((p) => p.textContent)
    );

    const isThirdTag = (thirdParagraphContent: string | null) => {
      return (
        thirdParagraphContent === "Protection" ||
        thirdParagraphContent === "InstantBuy"
      );
    };

    const convertPriceToFloat = (paragraphContent: string | null) => {
      if (paragraphContent) {
        return parseFloat(paragraphContent.replace(/\D/g, ""));
      }
      return 0;
    };

    const carousellTimestampToTime = (strTimestamp: string) => {};

    const getTags = (
      paragraphContents: Array<string | null>
    ): Array<string> => {
      const tags: Array<string> = [];
      for (const paragraphContent of paragraphContents) {
        paragraphContent ? tags.push(paragraphContent) : null;
      }
      return tags;
    };

    const listing: Listing = {
      sellerName: paragraphContents[0] ? paragraphContents[0] : undefined,
      timeStamp: paragraphContents[1] ? paragraphContents[1] : undefined,
      tags: isThirdTag(paragraphContents[2])
        ? getTags([
            paragraphContents[2],
            paragraphContents[paragraphContents.length - 2],
            paragraphContents[paragraphContents.length - 1],
          ])
        : getTags([
            paragraphContents[paragraphContents.length - 2],
            paragraphContents[paragraphContents.length - 1],
          ]),
      name: isThirdTag(paragraphContents[2])
        ? paragraphContents[3] ?? "Err"
        : paragraphContents[2] ?? "Err",
      price: isThirdTag(paragraphContents[2])
        ? convertPriceToFloat(paragraphContents[4])
        : convertPriceToFloat(paragraphContents[3]),
    };

    listings.push(listing);
  }

  await browser.close();
  return listings;
};

export default carousellScraperOld;
