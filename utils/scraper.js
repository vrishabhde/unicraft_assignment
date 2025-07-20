import fs from "fs";
import { getSeedUrls } from "./openAi.js";
import puppeteer from "puppeteer";

function isValidPhone(number) {
  const digits = number.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 13) return false;
  if (/^(19|20)\d{2}[-–](19|20)\d{2}$/.test(number)) return false; // Year-like
  if (/^\d{1,3}(\.\d{1,3}){2,3}$/.test(number)) return false; // IP-like
  if (/^(\d)\1{5,}$/.test(digits)) return false; // Repeated digits (e.g. 999999999)
  return true;
}


export async function scrapeCompanyData(query, urls) {
  const seedUrls = urls || (await getSeedUrlsFromQuery(query));
  const results = [];

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const url of seedUrls) {
    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

      const data = await page.evaluate(() => {
        const bodyText = document.body.innerText;

        const mailtoLinks = Array.from(document.querySelectorAll("a[href^='mailto:']"))
          .map(a => a.getAttribute("href").replace("mailto:", "").split("?")[0]);

        const telLinks = Array.from(document.querySelectorAll("a[href^='tel:']"))
          .map(a => a.getAttribute("href").replace("tel:", "").split("?")[0]);

        const title = document.title;
        return { bodyText, mailtoLinks, telLinks, title };
      });

      const rawEmails = data.bodyText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
      const filteredEmails = rawEmails
        .filter(email => !email.match(/\.(png|jpg|jpeg|gif|svg)$/i))
        .concat(data.mailtoLinks || []);

      const rawPhones = data.bodyText.match(
        /\b(\+?\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}\b/g
      ) || [];

      const allPhones = rawPhones.concat(data.telLinks || []);
      const filteredPhones = allPhones
        .map(p => p.trim())
        .filter(isValidPhone);

      results.push({
        companyName: data.title || url,
        website: url,
        emails: [...new Set(filteredEmails)],
        phones: [...new Set(filteredPhones)],
      });
    } catch (err) {
      console.error(`Error scraping ${url}:`, err.message);
    }
  }

  await browser.close();
  fs.writeFileSync("output.json", JSON.stringify(results, null, 2));
  return results;
}





async function getSeedUrlsFromQuery(query) {
  try {
    let searchQueryData = await getSeedUrls(query);
    console.log("searchQueryData",searchQueryData)
    if (searchQueryData?.length) {
      const websiteUrl = searchQueryData?.map((data) => data.website);
      return websiteUrl;
    }
  } catch (error) {
    console.log(error);
  }
}
