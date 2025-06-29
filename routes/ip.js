import express from "express";
import { getClientIPHandler } from "../controller/ipController.js";

const router = express.Router();

router.get("/", getClientIPHandler);

export default router;
