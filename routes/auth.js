const User = require("../models/User");
const bcrypt = require("bcrypt");

const router = require("express");
const route = router.Router();

//Register
route.post('/register', async (req, res) => {
    try{
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create and enter user information
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })

        //save user and return response
        const newUser = await user.save();
        res.status(200).json(newUser); 
    }catch(err){
        res.status(404).json(err); 
    }
});

//Login
route.post("/login", async (req, res) => {
    try{
        const user = await User.findOne({ email: req.body.email });
        if(!user){
            res.status(404).json("User Not found");
        }
    
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword){
            res.status(404).json("Wrong Password");
        }
    
        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = route;