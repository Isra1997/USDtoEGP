const express = require('express');
const app = express();
const cors = require('cors');
const service = require('./routes/service');
const users = require('./routes/users');
//set the app  view engine as ejs
app.set('view engine','ejs');

app.use(cors());
app.use(express.json())
app.use('/api/v1/usdtoegp',service);
app.use('/api/v1/register',users);

const port = 3000;
app.listen(port,()=>{
    console.log(`The USD to EGP service has started. The server is running on port ${port}`);
})




        