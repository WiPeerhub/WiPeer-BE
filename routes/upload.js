import express from "express";
import {
  getPresignedURL,
  deleteFilesFromS3Handler,
} from "../controller/uploadController.js";

const router = express.Router();

router.get("/upload-url", getPresignedURL);
router.delete("/delete-files", deleteFilesFromS3Handler);

export default router;
