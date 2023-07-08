const express =  require("express");
const morgan = require("morgan");
const createError = require('http-errors');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");

const app = express();

//API request limit midlaware
const rateLimiter = rateLimit({
    windowMs: 1* 60* 1000, // 1 minute
    max: 5,
    message: "Too many request from this IP. Pleasse try again later"
})

app.use(rateLimiter);
app.use(xssClean());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/users", userRouter);
app.use("/api/seed", seedRouter);

app.get("/health",(req, res) => {
    res.status(200).send({message: "Health is good"});
})

//client error handling
app.use((req, res, next) => {
    next(createError(404, "Route not found"));
})

// server error handling
app.use((err, req, res, next) => {
    console.log(err.stack);
    return res.status(err.status || 500).json({success: false, message: err.message});
})

module.exports = app;