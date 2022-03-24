const express = require('express');
const router = express.Router();
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler');
const scheduler = new ToadScheduler();
const axios = require('axios');
require('dotenv').config();
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);

router.get('/startservice',async(req,res)=>{
    const task = new Task('simple task', () => { 
    axios.get(process.env.BASE_URL)
    .then(async(res)=>{
        console.log(res.data.conversion_rates.EGP);
        const message= await client.messages.create({
            body: "1 Dollar = "+res.data.conversion_rates.EGP+" EGP",
            from:"whatsapp:+14155238886",
            to:"whatsapp:+201001715399"
        })
        console.log(message.sid);
    });})
    const job = new SimpleIntervalJob({ seconds: 20, }, task)
    scheduler.addSimpleIntervalJob(job)
    res.send("The service has started.");
})

router.get("/stopService",()=>{
    scheduler.stop();
})

module.exports = router