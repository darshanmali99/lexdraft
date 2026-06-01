import express from "express";

import cors from "cors";

import dotenv from "dotenv";

import helmet from "helmet";

import morgan from "morgan";

import pool from "./config/db.js";

/* ======================================
   ROUTES
====================================== */

import authRoutes from "./routes/authRoutes.js";

import protectedRoutes from "./routes/protectedRoutes.js";

import knowledgeBaseRoutes from "./routes/knowledgeBaseRoutes.js";

import embeddingRoutes from "./routes/embeddingRoutes.js";

import documentRoutes from "./routes/documentRoutes.js";

import dashboardRoutes from "./routes/dashboardRoutes.js";

import routes from "./api/routes/index.js";

/* ======================================
   CONFIG
====================================== */

dotenv.config();

const app = express();

/* ======================================
   MIDDLEWARE
====================================== */

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);


app.use(

  helmet({

    crossOriginResourcePolicy: false,
  })
);

app.use(morgan("dev"));

app.use(express.json());

app.use(

  "/uploads",

  express.static("uploads", {

    setHeaders: (res) => {

      res.set(

        "Access-Control-Allow-Origin",

        "*"
      );
    },
  })
);


/* ===================================
   API ROUTES
====================================== */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/protected",
  protectedRoutes
);

app.use(
  "/api/kb",
  knowledgeBaseRoutes
);

app.use(
  "/api/embeddings",
  embeddingRoutes
);

app.use(
  "/api/documents",
  documentRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api",
  routes
);

/* ======================================
   ROOT ROUTE
====================================== */

app.get("/", (req, res) => {

  res.json({

    success: true,

    message:
      "LexDraft Backend Running 🚀",
  });
});

/* ======================================
   DATABASE TEST
====================================== */

app.get(
  "/db-test",

  async (req, res) => {

    try {

      const result =
        await pool.query(
          "SELECT NOW()"
        );

      res.json({

        success: true,

        time: result.rows[0],
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        error: error.message,
      });
    }
  }
);

/* ======================================
   404 HANDLER
====================================== */

app.use((req, res) => {

  res.status(404).json({

    success: false,

    message: "Route not found",
  });
});

/* ======================================
   GLOBAL ERROR HANDLER
====================================== */

app.use((
  err,
  req,
  res,
  next
) => {

  console.error(err);

  res.status(500).json({

    success: false,

    message:
      "Internal server error",
  });
});

/* ======================================
   SERVER START
====================================== */

const PORT =
  process.env.PORT || 5000;

const server = app.listen(
  PORT,

  () => {

    console.log(
      `Server running on port ${PORT}`
    );
  }
);

/* ======================================
   HANDLE UNHANDLED PROMISES
====================================== */

process.on(
  "unhandledRejection",

  (err) => {

    console.error(
      "Unhandled Rejection:",
      err
    );
  }
);

/* ======================================
   HANDLE UNCAUGHT EXCEPTIONS
====================================== */

process.on(
  "uncaughtException",

  (err) => {

    console.error(
      "Uncaught Exception:",
      err
    );
  }
);

/* ======================================
   GRACEFUL SHUTDOWN
====================================== */

process.on(
  "SIGTERM",

  () => {

    console.log(
      "SIGTERM received. Shutting down..."
    );

    server.close(() => {

      console.log(
        "Server terminated"
      );
    });
  }
);

console.log("SERVER FULLY INITIALIZED");