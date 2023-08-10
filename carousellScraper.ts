const puppeteer = require("puppeteer");
import { Listing } from "./types";

const carousellScraper = async (link: string): Promise<Array<Listing>> => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(link);

  return await page.$$eval(
    'div[data-testid^="listing-card"]',
    (cards: any[]) => {
      return cards.map((card) => {
        const name = card.querySelector(
          "p.D_pn.D_pk.D_po.D_ps.D_pv.D_py.D_p_.D_pw.D_pE"
        ).textContent as string;

        const rawRecentness = card.querySelector(
          "p.D_pn.D_pi.D_po.D_ps.D_pu.D_py.D_p_.D_Az.D_pF"
        ).textContent as string;

        const unitToDays = {
          day: 1,
          days: 1,
          month: 30,
          months: 30,
        };

        const splitRecentness = rawRecentness.split(" ");
        const quantity = parseInt(splitRecentness[0]);
        const unit = splitRecentness[1];

        const daysSincePosted = quantity * (unitToDays[unit] || 1);

        const price = 1;
        // parseFloat(
        //   card
        //     .querySelector("p.D_pn.D_pk.D_po.D_ps.D_pu.D_py.D_pA.D_pC")
        //     .textContent.replace(/\D/g, "")
        // );

        const tagElements = card.querySelectorAll(
          "p.D_pn.D_pi.D_po.D_ps.D_pu.D_py.D_p_.D_pE"
        );

        const tags: string[] = [];

        tagElements.forEach((el: Element) => {
          if (typeof el.textContent === "string" && el.textContent !== "") {
            tags.push(el.textContent);
          }
        });

        const likes =
          parseInt(
            card.querySelector("span.D_pn.D_pi.D_po.D_ps.D_pv.D_py.D_p_.D_pE")
              ?.textContent,
            10
          ) ?? 0;

        return {
          name: name,
          price: price,
          daysSincePosted: daysSincePosted,
          tags: tags,
          likes: likes,
        };
      });
    }
  );
};

export default carousellScraper;
