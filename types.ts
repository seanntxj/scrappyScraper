export type Listing = {
  name: string;
  price: number;
  sellerName?: string;
  location?: string;
  daysSincePosted?: number;
  tags?: Array<any>;
  likes?: number;
};
