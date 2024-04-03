import axios from "axios";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import errorHandler from "./errorHandler.js";
import notFound from "./notFound.js";
import connectDB from "./connectDB.js";
import { URL } from "./models/url.model.js";
import { customAlphabet } from "nanoid";

dotenv.config();

let app = express();
let port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

let nanoid = customAlphabet("123456789abcdefghijklmnopqrstuvwxyz", 5);

app.get("/", (req, res) => {
  res.json({ message: "WELCOME TO QuickShrink API!!" });
});

app.get("/urls", async (req, res, next) => {
  let urls = await URL.find({}).exec();
  res.json(urls);
});

app.get("/:slug",async(req,res,next)=>{
    try {
     let { slug } = req.params;
    
     if(slug.length > 5){
        res.status(400);
        res.json({
            message: "Invalid Short URL!"
        });
     }

    let url = await URL.findOne({ slug });

    if(url){
        res.status(301);
        res.redirect(url.originalURL);
    }else{
        next();
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
          validateStatus: (status) => {
            return status < 500;
          },
        });

        if (response.status != 404) {
          let slug = nanoid();
          let newURL = await URL.create({
            originalURL: req.body.url,
            slug: slug,
          });

          res.json({
            short: `${process.env.URL}/${newURL.slug}`,
            status: response.status
          });
        } else{
            res.json({
                message: "Invalid URL!",
                status: response.status,
            })
        }
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.status(400);
    const error = new Error("URL is required!");
    next(error);
  }
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on ${process.env.URL}.`);
});
