const express = require ("express");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConnection");
const dotenv = require ("dotenv").config();
const cors = require("cors");



const corsOptions = {
    origin: 'http://localhost:3000', // Replace with the actual origin of your React app
    optionsSuccessStatus: 200,
};


connectDB();

const app = express();


app.use(cors(corsOptions));
const port = process.env.PORT || 5000;


app.use(express.json());

app.use("/patient", require ("./routes/patientInfoRoutes"));
app.use("/users", require ("./routes/userRoutes"));
app.use("/doctor", require("./routes/doctorRoutes"));


app.use(errorHandler);

app.listen (port, ()=>{

    console.log(`Server is running on port ${port}`);
});