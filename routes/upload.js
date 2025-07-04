import express from "express";
import { getPresignedURL } from "../controller/uploadController.js";

const router = express.Router();

router.get("upload-url", getPresignedURL);

export default router;
