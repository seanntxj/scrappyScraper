import { Listing } from "../types";

/**
 * Formats the raw text given from the scraper into a Listing object when scraping Carousell
 * @param rawData The raw array of strings given from the scraper
 * @param urlSuffix The suffix of the region being scraped, (e.g. 'my', 'sg', etc)
 * @returns An array of the listings put into the proper Listing object
 */
const carousellRawDataToListings = (
  rawData: Array<string>,
  urlSuffix: string
): Array<Listing> => {
  return rawData.map((listingDetailsArr) => {
    const thirdItemIsCarousellProtect =
      listingDetailsArr[2] === "Protection" ||
      listingDetailsArr[2] === "InstantBuy";

    const lastItemIsLikes =
      listingDetailsArr[listingDetailsArr.length - 2].replace(/\D/g, "") !== "";

    const convertPriceToFloat = (paragraphContent: string) => {
      if (paragraphContent) {
        return parseFloat(paragraphContent.replace(/\D/g, ""));
      }
      return 0;
    };

    const carousellTimeToSecondsElasped = (timeString: string): number => {
      const timeParts = timeString.split(" ");
      const value = parseInt(timeParts[0]);
      let unit = timeParts[1].toLowerCase();
      if (unit.charAt(unit.length - 1) === "s") {
        unit = unit.slice(0, unit.length - 1);
      }

      const unitToSeconds: Record<string, number> = {
        second: 1,
        minute: 60,
        hour: 3600,
        day: 86400,
        week: 604800,
        month: 9999999,
        year: 99999999,
      };

      if (!isNaN(value) && unitToSeconds[unit]) {
        return value * unitToSeconds[unit];
      }

      throw new Error("Invalid time string");
    };

    const condition = thirdItemIsCarousellProtect
      ? listingDetailsArr[5]
      : listingDetailsArr[4];

    const freeShipping = (): boolean => {
      const possibleFreeShippingTag = lastItemIsLikes
        ? listingDetailsArr[listingDetailsArr.length - 3]
        : listingDetailsArr[listingDetailsArr.length - 2];
      return possibleFreeShippingTag !== condition;
    };

    const link = () => {
      const rawlink =
        listingDetailsArr[listingDetailsArr.length - 1].split("\n").pop() || "";
      const breakpoint = rawlink.indexOf("?t-id=");
      if (breakpoint !== -1) {
        const modifiedUrl = rawlink.substring(0, breakpoint);
        return `carousell.com.${urlSuffix}${modifiedUrl}`;
      } else {
        return `carousell.com.${urlSuffix}${rawlink}`;
      }
    };

    const listing: Listing = {
      name: thirdItemIsCarousellProtect
        ? listingDetailsArr[3]
        : listingDetailsArr[2],
      price: thirdItemIsCarousellProtect
        ? convertPriceToFloat(listingDetailsArr[4])
        : convertPriceToFloat(listingDetailsArr[3]),
      timeSincePostedSeconds: carousellTimeToSecondsElasped(
        listingDetailsArr[1]
      ),
      condition: condition,
      platformProtection: thirdItemIsCarousellProtect,
      freeShipping: freeShipping(),
      sellerName: listingDetailsArr[0],
      timeStamp: listingDetailsArr[1],
      likes: lastItemIsLikes
        ? parseInt(listingDetailsArr[listingDetailsArr.length - 2], 10) ?? 0
        : 0,
      link: link(),
    };

    return listing;
  });
};

export default carousellRawDataToListings;
