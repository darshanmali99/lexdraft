import express from "express";

import {

  startEmbeddingJob,

  getEmbeddingJobStatus,

  searchEmbeddings,

  getEmbeddingStats

} from "../controllers/embeddingController.js";

import authMiddleware from "../middleware/auth.js";


const router = express.Router();


// ======================================
// START EMBEDDING JOB
// ======================================

router.post(

  "/start",

  authMiddleware,

  startEmbeddingJob
);


// ======================================
// GET JOB STATUS
// ======================================

router.get(

  "/status/:id",

  authMiddleware,

  getEmbeddingJobStatus
);


// ======================================
// SEMANTIC SEARCH
// ======================================

router.post(

  "/search",

  authMiddleware,

  searchEmbeddings
);


// ======================================
// EMBEDDING STATS
// ======================================

router.get(

  "/stats",

  authMiddleware,

  getEmbeddingStats
);


export default router;