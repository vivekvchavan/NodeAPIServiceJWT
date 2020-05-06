const router=require('express').Router();
const User=require('../model/User');
const Joi=require('@hapi/joi');
const bcrypt=require('bcryptjs');
const jwt= require('jsonwebtoken');

const registerSchema = Joi.object({ 
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({ 
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});


router.post('/register', async (req,res) => {

    const {error} = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send('Email Already exists');

    const salt= await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);

    const user =new User({
        name: req.body.name,
        email: req.body.email,
        password:hashPassword
    });

    try {
        const savedUser=await user.save();
        res.send({user:user._id});
    } catch (error) {
        res.status(400).send(error);
    }
});


router.post('/login', async (req,res) => {

    const {error} = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('Email or password incorrect');

    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send('Email or password incorrect');

    const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET);
    //res.header('auth-token',token).send(token);
    res.send({message: 'Logged In'});
});


module.exports = router;