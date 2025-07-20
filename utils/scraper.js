import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import { getSeedUrls } from "./openAi.js";

export async function scrapeCompanyData(query, urls) {
  const seedUrls = urls || (await getSeedUrlsFromQuery(query));
  const results = [];

  for (let url of seedUrls) {
    try {
      const { data } = await axios.get(url, { timeout: 10000 });
      const $ = cheerio.load(data);

      const companyName =
        $("meta[property='og:site_name']").attr("content") ||
        $("title").text() ||
        url;

      const textContent = $("body").text();
      const emails =
        textContent.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) ||
        [];
      const phones =
        textContent.match(
          /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g
        ) || [];

      results.push({
        companyName,
        website: url,
        emails: [...new Set(emails)],
        phones: [...new Set(phones)],
      });
    } catch (error) {
      console.error(`Error scraping ${url}:`, error.message);
    }
  }

  // Save to JSON file
  fs.writeFileSync("output.json", JSON.stringify(results, null, 2));
  return results;
}

async function getSeedUrlsFromQuery(query) {
  try {
    let searchQueryData = await getSeedUrls(query);
    if (searchQueryData?.length) {
      const websiteUrl = searchQueryData?.map((data) => data.website);
      return websiteUrl;
    }
  } catch (error) {
    console.log(error);
  }
}
