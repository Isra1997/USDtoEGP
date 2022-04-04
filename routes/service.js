const express = require('express');
const router = express.Router();
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler');
const axios = require('axios');
require('dotenv').config();
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);
//Currency converting package
const currencyConverterLt = require('currency-converter-lt');
const { readdirSync } = require('fs');
//Runs a check every 5 hours(18000)
const DEFAULT_UPDATE_DURATION = 10;
//Schedular 
const scheduler = new ToadScheduler();
const currencyConverter = new currencyConverterLt({from:"USD",to:"EGP",amount:1});
//Redis
const Redis = require("redis");
const redisClient = Redis.createClient();



router.get('/startservice',async(req,res)=>{
    await redisClient.connect();
    const task = new Task('simple task', () => { 
    currencyConverter.convert()
    .then(async(result)=>{
        console.log(result);
        const timestamp = new Date();
        await redisClient.HSET("rates",timestamp.toString(),result);
        try{
            const message = await client.messages.create({
                body: "1 Dollar = "+result+" EGP",
                from:"whatsapp:+14155238886",
                to:"whatsapp:"+req.body.phone
            });
            console.log(message.sid);
        }catch(ex){
            console.log(ex);
        }
    }).catch((ex)=>{
            res.status(500).send("Something went wrong!");
    })
   });
    const job = new SimpleIntervalJob({ seconds: DEFAULT_UPDATE_DURATION, }, task)
    scheduler.addSimpleIntervalJob(job)
    res.send("The service has started.")
})

router.get("/report",async(req,res)=>{
    res.send(await redisClient.HGETALL("rates"));
})

router.get("/stopservice",(req,res)=>{
    scheduler.stop();
    res.send("The service has stoped.")
})

router.get("/instructions",async(req,res)=>{
    res.send({
        step1: "Save the phone number: +14155238886",
        step2: "Send the 'join town-something' to the numebr saved in step1.",
        step3: "(optional) to get a report of the change in rate send the message reports to the chatbot."
    })
})

module.exports = router