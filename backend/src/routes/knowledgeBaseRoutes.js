import express from "express";

import authMiddleware
from "../middleware/auth.js";

import upload
from "../config/multer.js";

import {

  createDocumentType,
  getDocumentTypes,
  deleteDocumentType,

  createClause,
  getClauses,

  uploadTemplate,
  getTemplates,

  saveCompanySettings,
  getCompanySettings,

  uploadCompanyLogo

} from "../controllers/knowledgeBaseController.js";


// ======================================
// ROUTER
// ======================================

const router =
  express.Router();


// ======================================
// DOCUMENT TYPES
// ======================================

// CREATE DOCUMENT TYPE

router.post(

  "/document-types",

  authMiddleware,

  createDocumentType
);


// GET ALL DOCUMENT TYPES

router.get(

  "/document-types",

  authMiddleware,

  getDocumentTypes
);


// DELETE DOCUMENT TYPE

router.delete(

  "/document-types/:id",

  authMiddleware,

  deleteDocumentType
);


// ======================================
// CLAUSES
// ======================================

// CREATE CLAUSE

router.post(

  "/clauses",

  authMiddleware,

  createClause
);


// GET CLAUSES

router.get(

  "/clauses",

  authMiddleware,

  getClauses
);


// ======================================
// TEMPLATES
// ======================================

// UPLOAD TEMPLATE

router.post(

  "/templates",

  authMiddleware,

  upload.single("file"),

  uploadTemplate
);


// GET TEMPLATES

router.get(

  "/templates",

  authMiddleware,

  getTemplates
);


// ======================================
// COMPANY SETTINGS
// ======================================

// SAVE SETTINGS

router.post(

  "/settings",

  authMiddleware,

  saveCompanySettings
);


// GET SETTINGS

router.get(

  "/settings",

  authMiddleware,

  getCompanySettings
);


// ======================================
// UPLOAD COMPANY LOGO
// ======================================

router.post(

  "/settings/logo",

  authMiddleware,

  upload.single("file"),

  uploadCompanyLogo
);


// ======================================
// EXPORT ROUTER
// ======================================

export default router;