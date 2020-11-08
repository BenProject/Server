import * as express from "express";
import entitiesRouter from "./routes/entities";
import ontolgyRouter from "./routes/ontology";
import entityRouter from "./routes/entity";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import config from "../config";

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use("/entity", entityRouter);
app.use("/types", ontolgyRouter);
app.use("/entities", entitiesRouter);

app.listen(config.ExpressAppPort);
