import express, { Request, Response } from "express";
import { scrapeCarousellForPhones, scrapeMudahForPhones } from "./test";

const app = express();
const port = 52436;

app.get("/scraper", async (req: Request, res: Response) => {
  const currentTime = new Date();
  console.log(
    `[${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}] Got request to scrape...`
  );
  const result = await scrapeCarousellForPhones();
  const result2 = await scrapeMudahForPhones();
  console.log("Requested completed");

  res.send([...result, ...result2]);
});

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
