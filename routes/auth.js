const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');
const router = express.Router();
const {validate} =require("../routes/users")
const Redis = require('redis');
const redisClient = Redis.createClient();

router.post("/", async(req,res)=>{
    const {error,value} = validate(req.body.phone);
    if(error) res.status(400).send(error.details[0].message);



    
})


