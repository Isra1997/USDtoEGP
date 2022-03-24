const express = require('express');
const Joi = require('joi');
const phoneNumberValidator = Joi.extend(require('joi-phone-number'));
const router = express.Router();
const Redis = require('redis');
const { MediaInstance } = require('twilio/lib/rest/api/v2010/account/message/media');
const redisClient = Redis.createClient();

router.post('/',async(req,res)=>{
    //format the mobile number
    const phoneNumber = formatPhoneNumber(req.body.phone).value;
    await redisClient.connect();
    redisClient.lRange("numbers",0,-1)
    .then((result)=>{
        if(result.indexOf(phoneNumber) > -1){
            res.status(400).send("Phone number already registered.");
        }else{
            //store the mobile number in redis
            redisClient.lPush("numbers",phoneNumber);
            //send a reponse with the formated phone number
            res.send(phoneNumber);
        }
    }).catch((ex)=>{
        console.log(ex);
        res.status(500).send("Something went wrong.");
    });
});

function formatPhoneNumber(number){
    const isValid = phoneNumberValidator.string().min(10).max(11).phoneNumber({ defaultCountry: 'EG', format: 'e164' }).validate(number);
    return isValid;
}

module.exports = router