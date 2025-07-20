import express from "express"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import router from "./routes/route.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use("/api",router)

const PORT = process.env.PORT

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
