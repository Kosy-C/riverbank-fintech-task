import express from "express";
import logger from "morgan";
import { connectDB } from "./DB.config";
import userRoute from "./routes/userRoute";
import transactionRoute from "./routes/transactionRoutes";
import { apiLimit } from "./middleware/rateLimiter";

require ('dotenv').config();

const app = express();

app.use(express.json());
app.use(logger("dev"));

//this calls the database connection
connectDB();

app.use("/user", userRoute);
app.use("/", apiLimit, transactionRoute);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`)
});

export default app;