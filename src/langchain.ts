import { ChatOpenAI } from "langchain/chat_models/openai";
import { createExtractionChain } from "langchain/chains/openai_functions";
import { FunctionParameters } from "langchain/dist/output_parsers/openai_functions";

require("dotenv").config();


export const rawListingToStructuredListing = async (rawListing: string) => {
  const llm = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo-0613",
  });

  const listingSchema: FunctionParameters = {
    type: "object",
    properties: {
      name: { type: "string" },
      price: { type: "number" },
      platformProtection: { type: "boolean" },
      location: { type: "string" },
      timeStamp: { type: "string" },
    },
    additionalProperties: true,
    required: ["name", "price"],
  };
  

  const extraction_chain = createExtractionChain(listingSchema, llm);

  return await extraction_chain.run(rawListing);
};
