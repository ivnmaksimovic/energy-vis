import express from "express";
import request from "request";
import cors from "cors";
import { response as energyData } from "./tempEngApiResponse";

const app = express();
const PORT = process.env.PORT || 3173;

const allowedOrigins = ["http://localhost:5173"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(options));

app.get("/", (req, res) => {
  res.send("Nothing to see here");
});

app.get("/api/installed_power_hardcoded", (req, res) => {
   console.log('Returning local hardcoded data');
  res.json(energyData);
});

app.get("/api/installed_power", (req, res) => {
  console.log('Fetching data from https://api.energy-charts.info ...');
  const url =
    "https://api.energy-charts.info/installed_power?country=de&time_step=yearly&installation_decommission=false";

  request(url, { json: true }, (error, response, body) => {
    if (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Error fetching data");
    } else {
      res.json(body);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
