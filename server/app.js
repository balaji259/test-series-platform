const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authRouter=require("./routes/auth.js");
const resultRouter=require("./routes/result.js")
const testRouter=require("./routes/test.js");
const connectDB=require('./db/db.js');

const app = express();

app.use(cors({
    origin:'*'
}))
app.use(express.json());
app.use("/auth",authRouter);
app.use("/test",testRouter);
app.use("/result",resultRouter);

connectDB();

app.get("/", (req, res) => res.send("API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
