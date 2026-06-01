import express from "express";

import authMiddleware
from "../middleware/auth.js";

import {

  generateDocument,

  getAllDocuments,

  getDocumentById,

  regenerateDocument,

  updateDocumentStatus,

  deleteDocument,

  testGroq,

  exportDocx,

  previewDocument,

  exportPdf

} from "../controllers/documentController.js";


// ======================================
// ROUTER
// ======================================

const router =
  express.Router();


// ======================================
// TEST GROQ CONNECTION
// ======================================

router.get(

  "/test-groq",

  authMiddleware,

  testGroq
);


// ======================================
// GENERATE DOCUMENT
// ======================================

router.post(

  "/generate",

  authMiddleware,

  generateDocument
);


// ======================================
// GET ALL DOCUMENTS
// ======================================

router.get(

  "/",

  authMiddleware,

  getAllDocuments
);


// ======================================
// EXPORT ROUTES
// IMPORTANT:
// MUST COME BEFORE /:id
// ======================================


// ======================================
// DOCX EXPORT
// TEMPORARILY PUBLIC FOR TESTING
// ======================================

router.get(

  "/:id/export/docx",

  exportDocx
);


// ======================================
// DOCUMENT PREVIEW
// ======================================

router.get(

  "/:id/export/preview",

  previewDocument
);


// ======================================
// PDF EXPORT
// ======================================

router.get(

  "/:id/export/pdf",

  authMiddleware,

  exportPdf
);


// ======================================
// GET DOCUMENT BY ID
// ======================================

router.get(

  "/:id",

  authMiddleware,

  getDocumentById
);


// ======================================
// REGENERATE DOCUMENT
// ======================================

router.post(

  "/:id/regenerate",

  authMiddleware,

  regenerateDocument
);


// ======================================
// UPDATE DOCUMENT STATUS
// ======================================

router.patch(

  "/:id/status",

  authMiddleware,

  updateDocumentStatus
);


// ======================================
// DELETE / ARCHIVE DOCUMENT
// ======================================

router.delete(

  "/:id",

  authMiddleware,

  deleteDocument
);


// ======================================
// EXPORT ROUTER
// ======================================

export default router;