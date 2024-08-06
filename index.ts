
const authRouter = require('./authRouter');
const PORT = process.env.PORT || 5000;
const express = require('express');

const app = express();

app.use(express.json());
app.use("/auth", authRouter);




const start = () => {
    try {
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch(e) {
        console.log(e);
    }
}

start();