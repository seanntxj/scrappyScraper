export type Listing = {
  name: string;
  price: number;
  sellerName?: string;
  daysSincePosted?: number;
  tags?: Array<any>;
  likes?: number;
};
