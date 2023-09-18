import { Listing } from "../types";

const isFirstItemListingName = (item: string) => {
  return !(parseInt(item, 10).toString() === item);
};

const convertPriceToFloat = (paragraphContent: string) => {
  const price = parseFloat(paragraphContent.replace(/\D/g, ''));
  if (!Number.isNaN(price)) {
    return price;
  } else {
    return Infinity;
  }
};

const getPrice = (listingDetailsArr: string[]): number => {
  const firstIsName = isFirstItemListingName(listingDetailsArr[0]);
  if (firstIsName) {
    const price1 = convertPriceToFloat(listingDetailsArr[1]);
    const price2 = convertPriceToFloat(listingDetailsArr[2]);
    return Math.min(price1, price2);
  } else {
    const price1 = convertPriceToFloat(listingDetailsArr[2]);
    const price2 = convertPriceToFloat(listingDetailsArr[3]);
    return Math.min(price1, price2);
  }
};

const calculateElapsedTimeInSeconds = (timestamp: string): number => {
  // Define the months for parsing the timestamp
  const months: { [key: string]: number } = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };

  // Get the current date and time
  const currentDate = new Date();

  let timestampDate: Date;

  if (timestamp.startsWith("Today")) {
    const [, timeStr] = timestamp.split(", ");
    const [hourStr, minuteStr] = timeStr.split(":");
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    timestampDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hour, minute);
  } else if (timestamp.startsWith("Yesterday")) {
    const [, timeStr] = timestamp.split(", ");
    const [hourStr, minuteStr] = timeStr.split(":");
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    const yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate() - 1);
    timestampDate = new Date(yesterdayDate.getFullYear(), yesterdayDate.getMonth(), yesterdayDate.getDate(), hour, minute);
  } else {
    const [monthStr, dayStr, timeStr] = timestamp.split(" ");
    const [hourStr, minuteStr] = timeStr.split(":");
    const month = months[monthStr];
    const day = parseInt(dayStr);
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    timestampDate = new Date(currentDate.getFullYear(), month, day, hour, minute);
  }

  const timeDifferenceMs = currentDate.getTime() - timestampDate.getTime();
  return Math.floor(timeDifferenceMs / 1000);
}

/**
 * Formats the raw text given from the scraper into a Listing object when scraping Carousell
 * @param rawData The raw array of strings given from the scraper
 * @returns An array of the listings put into the proper Listing object
 */
const mudahRawDataToListings = (rawData: Array<Array<string>>): Array<Listing> => {
  return rawData.map((listingDetailsArr) => {
    const listing: Listing = {
      name: isFirstItemListingName(listingDetailsArr[0])
        ? listingDetailsArr[0]
        : listingDetailsArr[1],
      price: getPrice(listingDetailsArr),
      condition: listingDetailsArr[listingDetailsArr.length - 5],
      location: listingDetailsArr[listingDetailsArr.length - 2],
      timeStamp: listingDetailsArr[listingDetailsArr.length - 3],
      timeSincePostedSeconds: calculateElapsedTimeInSeconds(listingDetailsArr[listingDetailsArr.length - 3]),
      link: listingDetailsArr[listingDetailsArr.length - 1].split('\n')[0],
    };

    return listing;
  });
};

export default mudahRawDataToListings;
