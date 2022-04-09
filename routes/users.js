const express = require('express');
const Joi = require('joi');
const phoneNumberValidator = Joi.extend(require('joi-phone-number'));
const router = express.Router();
const Redis = require('redis');
const redisClient = Redis.createClient();
const bcrypt = require('bcrypt');

router.post('/',async(req,res)=>{
    //format the mobile number
    const phoneNumber = formatPhoneNumber(req.body.phone).value;
    //encrypt the phone number befor storing in redis
    const salt = await bcrypt.genSalt(10);
    const hashedPhoneNumber = await bcrypt.hash(phoneNumber,salt);
    await redisClient.connect();
    redisClient.lRange("numbers",0,-1)
    .then((result)=>{
        if(result.indexOf(hashedPhoneNumber) > -1){
            res.status(400).send("Phone number already registered.");
        }else{
            //store the mobile number in redis
            redisClient.lPush("numbers",hashedPhoneNumber);
            //send a reponse with the formated phone number
            res.send(hashedPhoneNumber);
        }
    }).catch((ex)=>{
        console.log(ex);
        res.status(500).send("Something went wrong.");
    });
});


function formatPhoneNumber(number){
    const isValid = phoneNumberValidator.string().min(10).max(14).phoneNumber({ defaultCountry: 'EG', format: 'e164' }).validate(number);
    console.log(number.length);
    console.log(isValid.error.details[0].message);
    return isValid;
}

exports.validate = formatPhoneNumber;
module.exports = router;
