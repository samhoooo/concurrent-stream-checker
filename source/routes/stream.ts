/** source/routes/posts.ts */
import express from "express";
import { getStream, deleteStream, addStream } from "../controllers";
const router = express.Router();

router.get("/stream", getStream);
router.post("/stream", addStream);
router.delete("/stream", deleteStream);

export = router;
