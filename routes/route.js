import { Router } from "express"
import { webScrapper } from "../controllers/scrapperController.js";

const router = Router();

router.post("/scrape",webScrapper)

export default router;
