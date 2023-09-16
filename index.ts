import express, { Request, Response } from "express";
import { scrapePhones } from "./test";

const app = express();
const port = 3000;

app.get(
  "/scraper",
  async (req: Request, res: Response) => {

    console.log("Got request to scrape...");
    const result = await scrapePhones();
    console.log("Requested completed");

    res.send(result);
  }
);

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
