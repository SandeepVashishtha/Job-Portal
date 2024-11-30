import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try{
        const {fullName, email,phoneNumber, password,role} = req.body;
        if(!fullName || !email || !phoneNumber || !password || !role){
            return res.status(400).json({message:"All fields are required"});
        };
        const user = await User.findOne({email});
        if(user) {
            return res.status(400).json({message: "User already exists",
            success: false,
            });
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        await User.create({
            fullName,
            email,
            phoneNumber,
            password:hashedPassword,
            role
        });
    }catch (error){
        console.log(error);
    }
}

export const login = async (req, res) => {
    try{
        const {email, password, role} = req.body;
        if(!email || !password || !role){
            return res.status(400).json({message:"All fields are required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User does not exist", success:false});

        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials",success:false});
        }
        if(role !== user.role){
            return res.status(403).json({message:"Unauthorized", success:false});
        }
        const tokenData = {
            userId: user._id,
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn: "1h"});

        return res.status(200).cookie("token", token,{maxAge: 3600000, httpOnly: true}).json({message:"Login successful", success:true});

    }catch (error){
        console.log(error);
    }
}