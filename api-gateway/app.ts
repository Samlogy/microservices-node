import cors from "cors";
import express from "express";
import helmet from "helmet";
import {
  ROUTES,
  setupAuth,
  setupCreditCheck,
  setupLogging,
  setupProxies,
  setupRateLimit,
} from "./utils";

const app = express();
const PORT = (process.env.PORT || 5001) as number;

app.use(cors());
app.use(helmet());
app.use(express.json());

setupLogging(app);
setupRateLimit(app, ROUTES);
setupAuth(app, ROUTES);
setupCreditCheck(app, ROUTES);
setupProxies(app, ROUTES);

app.listen(PORT, () => console.log(`API GATEWAY => ${PORT}`));
