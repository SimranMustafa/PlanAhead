import createError from '../utils/createError.js';
import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const register = async(req,res,next) => {
    if(!req.body.name|| !req.body.email||!req.body.password){
        return next(createError({status: 400, message: 'Name, email, password is required' }));
    }

    try{
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(req.body.password, salt);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword

        });
        await newUser.save();
        return res.status(201).json('New user created');
    }catch(err){
        console.log(err);
        return res.json('server error');
    }
};

export const login = async(req,res,next) => {
    if(!req.body.email || !req.body.password){
        return next(createError({status: 400, message: 'Name, email is required' }));
    }
    try{
        const user = await User.findOne({email: req.body.email}).select(
            'name email password'
        );
        if(!user){
            return res.status(404).json("no user found");
        }
        const isPasswordCorrect = await bcryptjs.compare(req.body.password, user.password);
        if(!isPasswordCorrect){
            return res.json('password incorrect');
        }
        const payload = {
            id: user._id,
            name: user.name,
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET, {
            expiresIn: '1d'
        } )
        return res.cookie('access_token', token, {
            httpOnly: true,
        }).status(200)
        .json({'message': "login success"})
    }catch(err){
        console.log(err);
        return next(err);
    }
};


export const logout = (req,res) => {
    res.clearCookie('access_token');
    return res.status(200).json({message: 'Logout Success'});

};


export const isLoggedIn = (req,res) =>{
    const token = req.cookie.access_token;
    if(token){
        return res.json(false);
    }
    return jwt.verify(token, process.env.JWT_SECRET, (err)=>{
        if(err){
            return res.json(false);
        }else{
            return res.json(true);
        }
    });

};