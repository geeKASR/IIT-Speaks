const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connecting database
connectDB();

// middleware usage
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.get('/', (req, res) => res.send("API Running"));

// Routes Defination
app.use('/api/user', require('./routes/api/user.js'));
app.use('/api/auth', require('./routes/api/auth.js'));
app.use('/api/profile', require('./routes/api/profile.js'));
app.use('/api/posts', require('./routes/api/posts.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
})
