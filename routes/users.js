const router = require("express");
const route = router.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//update user
route.put("/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err){
                res.status(403).json(err);
            }
        }

        try{
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json("Account has been updated");
        }catch(err){
            res.status(500).json(err);
        }

    }else{
        res.status(403).json("You can only update your account");
    }
});

//delete user
route.delete("/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            await User.deleteOne({ _id: req.params.id });
            res.status(200).json("Account has been deleted");
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can only delete your account");
    }
});

//get a user
route.get("/:id", async (req, res) =>{
    try{
        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...other} = user._doc;
        res.status(200).json(other);
    }catch(err){
        res.status(500).json(err);
    }
});

//follow a user
route.get("/:id/follow", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
    
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("User has been followed");
            }else{
                res.status(403).json("You already follow this user");
            }
    
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can't follow yourself");
    }

});

//unfollow a user
route.get("/:id/unfollow", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
    
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json("User has been unfollowed");
            }else{
                res.status(403).json("You don't follow this user");
            }
    
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can't unfollow yourself");
    }

});

module.exports = route;