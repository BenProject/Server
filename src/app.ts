import * as express from "express";
import entitiesRouter from "./routes/entities";
import * as bodyParser from "body-parser";
import * as cors from "cors";

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

import config from "../config";
const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use("/entities", entitiesRouter);

app.listen(5000);
