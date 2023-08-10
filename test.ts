import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.carousell.com.my/search/iPhone?addRecent=true");

  const cards = await page.$$('div[data-testid^="listing-card"]');
  for (const card of cards) {
    const paragraphContents = await card.$$eval("p", (paragraphs) =>
      paragraphs.map((p) => p.textContent)
    );
    console.log(paragraphContents);
  }

  await browser.close();
})();
