
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "https://myportfolioassignment3.netlify.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

export default app;
