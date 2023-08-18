export type Listing = {
  name: string;
  price: number;
  condition?: string;
  platformProtection?: boolean;
  freeShipping?: boolean;
  sellerName?: string;
  location?: string;
  timeSincePostedSeconds?: number;
  timeStamp?: string;
  tags?: Array<any>;
  likes?: number;
};
