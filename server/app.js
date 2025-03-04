const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authRouter=require("./routes/auth.js");
const resultRouter=require("./routes/result.js")
const testRouter=require("./routes/test.js");
const connectDB=require('./db/db.js');
const path=require("path");

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


// app.use(express.static(path.join(__dirname, "../client/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
