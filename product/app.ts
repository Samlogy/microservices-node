import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import productRoutes from "./routes";

const app = express();

const PORT = process.env.PORT || 3001;

// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:8080",
//       "http://localhost:4200",
//     ],
//   })
// );

const MONGODB_PWD = "UTplzGDIC5Dxm3SD";
const MONGODB_USERNAME = "sam";
const MONGODB_URI = `mongodb+srv://${MONGODB_USERNAME}:<${MONGODB_PWD}>@cluster0.fcdvt0a.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected !"))
  .catch((err) => console.log("Err: ", err));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("*** Product Service Working ... ***");
});
app.use("/api/product", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
