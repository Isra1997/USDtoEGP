const express = require('express');
const router = express.Router();
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler');
const axios = require('axios');
require('dotenv').config();
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);
//Currency converting package
var currencyConverterLt = require("currency-converter-lt");
//Runs a check every 5 hours(18000)
const DEFAULT_UPDATE_DURATION = 20;
//Schedular 
const scheduler = new ToadScheduler();

router.get('/startservice',async(req,res)=>{
    const task = new Task('simple task', () => { 
    currencyConverter.convert()
    .then(async(res)=>{
        console.log(res);
        const message = await client.messages.create({
            body: "1 Dollar = "+res+" EGP",
            from:"whatsapp:+14155238886",
            to:"whatsapp:+201064486639"
        })
        console.log(message.sid);
    }).catch((ex)=>{
            res.status(500).send("Something went wrong!");
    })
   });
    const job = new SimpleIntervalJob({ seconds: DEFAULT_UPDATE_DURATION, }, task)
    scheduler.addSimpleIntervalJob(job)
    res.send("The service has started.")
})

router.get("/stopservice",(req,res)=>{
    scheduler.stop();
    res.send("The service has stoped.")
})

module.exports = router