import { Listing } from "./types";

const filter = (listing: Listing, filters: Array<any>) => {
  filters.forEach((filter) => {});
};
const filterNames = (name: string, include?: string, exclude?: string) => {};

export function removeTextAfterSubtext(baseString: string, subtexts: string[]): string {
  const indices = subtexts.map((subtext) => baseString.indexOf(subtext)).filter((index) => index !== -1);

  if (indices.length > 0) {
    const minIndex = Math.min(...indices);
    const foundSubtext = subtexts.find((subtext) => baseString.indexOf(subtext) === minIndex);
    if (foundSubtext) {
      const endIndex = minIndex + foundSubtext.length;
      return baseString.substring(0, endIndex);
    }
  }

  return baseString;
}

export function removeTextBeforeSubtext(baseString: string, subtexts: string[]): string {
  const indices = subtexts.map((subtext) => baseString.indexOf(subtext)).filter((index) => index !== -1);

  if (indices.length > 0) {
    const maxIndex = Math.max(...indices);
    const foundSubtext = subtexts.find((subtext) => baseString.indexOf(subtext) === maxIndex);
    if (foundSubtext) {
      const startIndex = maxIndex + foundSubtext.length;
      return baseString.substring(startIndex);
    }
  }

  return baseString;
}