import express from "express";
import cors from "cors";
import orderRoutes from "./routes";

const app = express();

const PORT = (process.env.PORT || 3002) as number;
// const IP = process.env.IP || "localhost";

// app.use(cors())

// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:8080",
//       "http://localhost:4200",
//     ],
//   })
// );

app.use(express.json());

app.get("/", (req, res) => {
  res.send("*** ORDER Service Working ... ***");
});
app.use("/api/order", orderRoutes);

app.listen(PORT, () => {
  console.log(`Order Service: ${PORT}`);
});
