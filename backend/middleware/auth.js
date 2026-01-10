import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
    try {
        const auth = req.auth();
        
        if (!auth || !auth.userId) {
            return res.json({success: false, message: "Not authenticated"});
        }

        const user = await clerkClient.users.getUser(auth.userId);

        if(user.privateMetadata.role !== 'admin'){
            return res.json({success: false, message: "not authotized"});
        }

        next();
    } catch (error) {
        console.log(error);
        return res.json({success: false, message: "Not Authorised"});
    }
}
