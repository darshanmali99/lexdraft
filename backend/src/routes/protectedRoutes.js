import express from "express";

import authMiddleware from "../middleware/auth.js";

const router = express.Router();


// PROTECTED TEST ROUTE
router.get(
  "/dashboard",
  authMiddleware,
  (req, res) => {

    res.json({
      success: true,
      message: "Protected route accessed successfully",
      user: req.user
    });
  }
);

export default router;