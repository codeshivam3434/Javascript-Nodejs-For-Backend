
const express = require('express');
const app = express();
const userRoutes = require("./routes/user.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
const database = require("./config/Database");

dotenv.config();

const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cookieParser()); // Invoke cookieParser as a function
app.use(express.json());
database.connect();

// Enable CORS
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

// Routes for signup & login
app.use("/api/v1/auth", userRoutes);

app.get("/", (req, res) => {
    res.send("Your server is up and running");
});

// Server port
app.listen(PORT, () => {
    console.log(`WebApp is running at ${PORT}`);
});
//sir this is main index folder 

//sir ab bas logic check krna reh gaya using postman wo bhi monday tak ho jaayega then our backend will complete with testing 
