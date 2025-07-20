# Company Data Scraper using Puppeteer

This is a Node.js-based web scraping tool designed to extract company names, email addresses, and phone numbers from websites. It leverages Puppeteer for scraping JavaScript-rendered content and supports both query-based search and direct URL input.

---

## Features Implemented

- Dynamic Content Support: Uses Puppeteer to handle JavaScript-rendered pages.
- Email Extraction:
  - From page body text
  - From `mailto:` links
- Phone Number Extraction:
  - From page body text
  - From `tel:` links
- Timeout Handling: Configurable scraping timeouts to prevent hanging
- Output Formatting: Structured data written to `output.json`
- API Ready: Accepts input from HTTP POST requests for flexibility

---

## Data Extraction Levels

- Basic: Static HTML content extraction
- Medium: Dynamic content rendered via JavaScript (using Puppeteer)

---

## Folder Structure

```
.
├── controllers/
│   └── scrapperController.js     # Handles logic between route and scraper
├── routes/
│   └── route.js                  # API routing setup
├── utils/
│   ├── scraper.js                # Core scraping logic
│   └── openai.js                 # GeminiAI integration
├── index.js                      # Entry point, Express server setup
├── output.json                   # Result file (auto-generated)
├── .env                          # Environment variables
├── package.json
└── README.md                     # This file
```

---

## Environment Variables (`.env`)

Create a `.env` file in the root directory and configure the following:

```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/vrishabhde/unicraft_assignment.git
cd unicraft_assignment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file and add:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
```

`GEMINI_API_KEY` is used if OpenAI or Gemini APIs are integrated for AI-based processing or summarization.

### 4. Run the Server

```bash
npm start
```

---

## API Usage

### POST Endpoint: `/api/scrape`

**Base URL:**

```
http://localhost:5000/api/scrape
```

### Request Body Examples

#### 1. Query-Based Search (via AI Search)

```json
{
  "query": "top 10 hospitals in maharashtra"
}
```

#### 2. Direct URLs

```json
{
  "urls": [
    "https://www.nanavatimaxhospital.org/",
    "https://www.kokilabenhospital.com/"
  ]
}
```

Use Postman or any API client to send these requests.

---

## Sample Output (`output.json`)

```json
[
  {
    "companyName": "Steel Supplier & Manufacturer in India | Tata Steel",
    "website": "https://www.tatasteel.com/",
    "emails": ["customercare@tatasteel.com"],
    "phones": ["18002082088"]
  },
  {
    "companyName": "AM/NS India",
    "website": "https://www.amns.in/",
    "emails": ["contact@amns.in"],
    "phones": ["1800 309 8905", "+91 7208414333"]
  }
]
```

---

## Design Decisions & Assumptions

- Puppeteer used over Cheerio/Axios to support JavaScript-heavy pages.
- Single Page Extraction: Scrapes only the homepage for each domain.
- No Login Required: Assumes public and accessible pages.
- Modular Structure: `utils/scraper.js` handles scraping logic, integrated via `controllers/scrapperController.js` and exposed via `routes/route.js`.

---

## License

MIT License — Open-source and free to use.
