import express from "express";
import { getAllPrices } from "../controllers/scrapeController.js";
const router = express.Router();

router.get("/", getAllPrices);

export default router;