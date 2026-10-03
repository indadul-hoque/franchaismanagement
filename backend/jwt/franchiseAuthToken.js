import Franchises from "../models/franchise.model.js";
import jwt from "jsonwebtoken";

const createTokenAndSaveCookiesForFranchise = async(franchiseId, email, res) => {
    try {
        // creating token
        const franchiseToken = jwt.sign({franchiseId, email}, process.env.JWT_SECRET_KEY, {
            expiresIn:"1h"
        })

        // set the token in cookies
        res.cookie("jwt", franchiseToken, {
            httpOnly:false,
            secure:true,
            sameSite:"none"
        })
        
        // save the token to the database
        await Franchises.findByIdAndUpdate(franchiseId, {token:franchiseToken})
        return franchiseToken
    } catch (error) {
        console.log("Error while creating and saveing in cookies: ", error);
        
    }
}

export default createTokenAndSaveCookiesForFranchise