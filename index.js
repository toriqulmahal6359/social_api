const express = require("express");
const app = express();

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");

//env
dotenv.config();

//database
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true })
const connection = mongoose.connection
connection.once('open', () => {
    console.log("Connected to mongodb")
}).catch(err => {
    console.log('Connection Failed')
})

//assets and middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

//routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

//server and port
const PORT = process.env.PORT || 3100;
const server = app.listen(PORT, () => {
    console.log(`Server is starting at ${PORT}`);
})