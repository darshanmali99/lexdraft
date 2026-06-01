import express from "express";

const router = express.Router();

/* ======================================
   DASHBOARD STATS
====================================== */

router.get(
  "/stats",

  async (req, res) => {

    try {

      res.json({

        totalDocuments: 124,

        generatedDocuments: 89,

        clients: 42,

        successRate: 97,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message: "Server error",
      });
    }
  }
);

export default router;