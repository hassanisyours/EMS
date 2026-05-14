import userModel from "../models/UserModel.js";
import jwt from 'jsonwebtoken'
// Login for employee and admin 
// POST api/auth/login 


const loginConrtoller = async (req,res) => {
    try {
        const {email,password,role_type} = req.body;

        if (!email || !password) {
            return res.status(400).json({error: 'email or password is required'})
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({error:"Invalid credential" })
        }
        if (role_type === 'admin' && user.role !== 'ADMIN') {
            return res.status(401).json({error: 'Not autherized as admin'})
        }
        if (role_type === 'employee' && user.role !== 'EMPLOYEE') {
            return res.status(401).json({error: 'Not autherized as EMPLOYEE'})
        }

        const isValid = password === user.password;

        if (!isValid) {
            return res.status(401).json({error:"Invalid credential" })
        }

        const payload = {
            userId: user._id.toString(),
            role: user.role,
            email: user.email
        }

        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: '7d'})
        

        return res.status(200).json({user: payload,token})
    } catch (error) {
        console.error(error,'login error')
        return res.status(500).json({error: 'Login failed'})
    }
}



// get session for employee and admin 
// GET api/auth/session

const sessionController = async (req,res) => {
    const session = req.session;
    return res.json({user: session})
    
}

// get session for employee and admin 
// POST api/auth/changePassword

const changePasswordController = async (req,res) => {
    try {
    const session = req.session;
        const {currentPassword, newPassword} = req.body;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({error: 'both passwords are required'})

            }

            const user = await userModel.findById(session.userId);

            if (!user) {
                return res.status(404).json({error:'user not found'})
            }

            const isValid  = currentPassword === user.password;
            if (!isValid) {
                return res.status(400).json({error:'Current password is incorrect'})
            }

            const hash = newPassword;

            await userModel.findByIdAndUpdate(session.userId,{password:hash})

            res.json({success: true});

    } catch (error) {
            return res.status(500).json({error:"failed to change password" })
    }

}

export default {loginConrtoller,changePasswordController,sessionController}
