import { scrapeCompanyData } from "../utils/scraper.js";

export const webScrapper = async (req, res) => {
  try {
    const { query, urls } = req.body;

    if (!query && (!urls || urls.length === 0)) {
      return res
        .status(400)
        .json({ error: "Provide either 'query' or 'urls'." });
    }

    const results = await scrapeCompanyData(query, urls);

    return res.json({ success: true, data: results });
  } catch (err) {
    console.error("Scraping Error:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};
