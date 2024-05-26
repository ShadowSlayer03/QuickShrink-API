import axios from "axios";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import winston from "winston";
import rateLimit from "express-rate-limit";
import cron from "node-cron";
import errorHandler from "./errorHandler.js";
import notFound from "./notFound.js";
import connectDB from "./connectDB.js";
import deleteExpiredURLs from "./deleteExpiredUrls.js";
import { URL } from "./models/url.model.js";
import { customAlphabet } from "nanoid";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: "Too Many Requests, Please Try Again Later!\n TimeOut: 10mins",
});
app.use(limiter);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

const nanoid = customAlphabet("123456789abcdefghijklmnopqrstuvwxyz", 5);

// Logging
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "combined.log" })],
});

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "WELCOME TO QuickShrink API!!" });
});

app.get("/api/healthcheck", (req, res) => {
  res.status(200).json({
    message: "OK",
    status: 200,
  });
});

app.get("/api/urls", async (req, res, next) => {
  try {
    let urls = await URL.find({}).sort({ createdAt: -1 }).exec();
    res.status(200).json(urls);
  } catch (error) {
    next(new Error("Something went wrong while fetching URLs!"));
  }
});

app.get("/:slug", async (req, res, next) => {
  try {
    let { slug } = req.params;

    if (slug.length < 5) {
      return res.status(400).json({
        message: "Invalid Short URL!",
      });
    }

    let url = await URL.findOne({ slug });

    if (url) {
      res.status(301).redirect(url.originalURL);
    } else {
      res.status(404).send("Sorry, This URL Does Not Exist!")
    }
  } catch (error) {
    next(error);
  }
});

app.post("/api/shorten", async (req, res, next) => {
  if (req.body.url) {
    try {
      let url = await URL.findOne({ originalURL: req.body.url }).exec();
      if (url) {
        res.json(url);
      } else {
        const response = await axios.get(req.body.url.toString(), {
          validateStatus: (status) => status < 500,
        });

        if (response.status != 404) {
          let slug = nanoid();
          let expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + 1);
          let newURL = await URL.create({
            originalURL: req.body.url,
            slug: slug,
            expiryDate: expiryDate,
          });

          res.status(201).json({
            short: `${process.env.URL}/${newURL.slug}`,
            status: response.status,
          });
        } else {
          res.status(400).json({
            message: "Invalid URL!",
            status: response.status,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.status(400);
    next(new Error("URL is required!"));
  }
});

app.post("/api/custom/:customSlug", async (req, res, next) => {
  const { customSlug } = req.params;
  const { originalURL } = req.body;

  if (!customSlug) {
    return res.status(400).json({
      message: "No Custom URL provided!",
    });
  }

  if (customSlug.length < 5) {
    return res.status(400).json({
      message: "The Custom URL must be at least 5 characters long!",
    });
  }else if(customSlug.length>15){
    return res.status(400).json({
      message: "The Custom URL must only have a maximum of 15 characters!",
    });
  }

  if (!originalURL) {
    return res.status(400).json({
      message: "Original URL not provided!",
    });
  }

  try {
    let url = await URL.findOne({ slug: customSlug });
    if (url) {
      return res.status(409).json({
        message: "URL already taken! Please choose another.",
      });
    } else {
      let expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      let newURL = await URL.create({
        originalURL,
        slug: customSlug,
        expiryDate: expiryDate,
      });
      if (!newURL) {
        res.status(503);
        next(new Error("Could not save the new URL!"));
      }
      res.status(201).json(newURL);
    }
  } catch (error) {
    next(error);
  }
});

app.patch("/api/expiration/:slug", async (req, res, next) => {
  let { expirationDate } = req.body;
  let { slug } = req.params;
  console.log("Expiry Date: ", expirationDate);

  if (!expirationDate) {
    return next(new Error("No Expiration Date Provided!"));
  }

  if (!slug) {
    return next(new Error("No Slug Provided!"));
  }

  try {
    let url = await URL.findOne({ slug });

    if (!url) {
      res.status(404);
      return res.json({ message: "No URL With The Given Slug Was Found!" });
    }

    url.expiryDate = new Date(expirationDate); 
    await url.save(); 

    res.status(200).json({ message: "Expiration Date Changed Successfully!", status: 200 });
  } catch (error) {
    next(error);
  }
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  if (process.env.ENV == "production")
    console.log(`Server Running at ${process.env.URL}.`);
  else console.log(`Server listening at http://localhost:${process.env.PORT}.`);
});

// Will be executed every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Starting up the CRON Job to Delete Expired URLs!");
  deleteExpiredURLs();
});
