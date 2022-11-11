require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { logger, logEvents } = require("./middleware/logger");
const connectDB = require("./config/connectDB");
const errHandler = require("./middleware/errHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/", require("./routes/root"));
app.use("/users", require("./routes/userRoutes"));
app.use("/notes", require("./routes/noteRoutes"));

app.all("*", (req, res) => {
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({ msg: "404 not found" });
    } else {
        res.type("txt").send("404 not found");
    }
});

app.use(errHandler);

mongoose.connection.once("open", () => {
    console.log("connect to mongo db");
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});
mongoose.connection.on("error", (err) => {
    console.log(err);
    logEvents(
        `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
        "mongoErrLog.log"
    );
});
