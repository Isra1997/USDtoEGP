const express = require('express');
const app = express();
const cors = require('cors');
const service = require("./routes/service");

app.use(cors());

app.use('/api/usdtoegp/',service);

const port = 3000;
app.listen(port,()=>{
    console.log("The USD to EGP service has started.");
})




        