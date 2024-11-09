import express, { Request, Response } from 'express';

import bodyParser from "body-parser";
import routes from "./routes/index";
import cors from "cors";
import connectDb from "./db";

const app = express();

const PORT = process.env.PORT || 6000;

connectDb();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Apply CORS policy to all routes
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World from task managment backend");
});

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
