export type Listing = {
  name: string;
  price: number;
  sellerName?: string;
  location?: string;
  timeStamp?: string;
  tags?: Array<any>;
  likes?: number;
};
