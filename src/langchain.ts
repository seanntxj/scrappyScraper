import { ChatOpenAI } from "langchain/chat_models/openai";
import { createExtractionChain } from "langchain/chains/openai_functions";
import { FunctionParameters } from 'langchain/dist/output_parsers/openai_functions';
import { Listing } from "./types";
require("dotenv").config();

/**
 * Takes in any string of listings and attempts to organise them into a given schema.
 * @param rawListing String of listings scraped from a website. Preferably with as little junk data as possible. 
 * @param listingSchema Schema that the listings should be returned in
 * @param llmModel The OpenAI model that should be used, default is GPT 3.5
 * @returns 
 */
export const rawListingToStructuredListing = async (rawListing: string, listingSchema: FunctionParameters, llmModel: string = 'gpt-3.5-turbo-0613') => {
  const llm = new ChatOpenAI({
    temperature: 0,
    modelName: llmModel,
  });

  const extractionChain = createExtractionChain(listingSchema, llm);

  try {
    const dataPlacedInSchema = await extractionChain.run(rawListing);
    return dataPlacedInSchema as unknown as Array<any> 
  } catch (error) {
    throw Error (`Couldn't place the raw data into the schema. If it's a JSON error, it's likely because the raw data is too long and there's not enough tokens. Error message: ${error}`)
  }
};
