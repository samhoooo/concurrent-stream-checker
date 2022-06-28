import http from "http";
import express, { Express } from "express";
import morgan from "morgan";
import routes from "./routes/stream";
import Stream from "./models/stream";
import mongoose from "mongoose";
require("dotenv").config();

const router: Express = express();

/** Logging */
router.use(morgan("dev"));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

/** RULES OF OUR API */
router.use((req, res, next) => {
  // set the CORS policy
  res.header("Access-Control-Allow-Origin", "*");
  // set the CORS headers
  res.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-With,Content-Type,Accept, Authorization"
  );
  // set the CORS method headers
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
    return res.status(200).json({});
  }
  next();
});

/** Routes */
router.use("/", routes);

/** Error handling */
router.use((req, res, next) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});

/** MongoDB Connection */
if (process.env.MONGO_URI != null) {
  mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
  // initialize and reset Stream table, create a user with userId = 1
  (async () => {
    try {
      await Stream.deleteMany({});
      const streams = await Stream.insertMany([
        {
          userId: 1,
          streamIds: [],
        },
        {
          userId: 2,
          streamIds: [],
        },
        {
          userId: 3,
          streamIds: [],
        },
      ]);
      console.log(streams);
    } catch (err) {
      console.error(err);
    }
  })();
}

/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 3000;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);
