import { FunctionParameters } from "langchain/dist/output_parsers/openai_functions";

/**
 * Full Listing object type
 */
export type Listing = {
  name: string;
  price: number;
  link: string;
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


/**
 * Schema for use with Langchain
 */
export const LangchainListingSchema: FunctionParameters = {
  type: "object",
  properties: {
    name: { type: "string" },
    price: { type: "number" },
    location: { type: "string" },
    timeStamp: { type: "string" },
  },
  additionalProperties: true,
  required: ["name", "price"],
};