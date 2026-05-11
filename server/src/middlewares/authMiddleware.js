import jwt from "jsonwebtoken";


const protect = async (req,res,next) => {
  try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({error: 'Unoutherized'})
    }

        const token = authHeader.split(' ')[1];
        const session = jwt.verify(token,process.env.JWT_SECRET)

        if (!session) {
            return res.status(401).json({error: 'Unautherized'})
        }

        req.session = session
        next()
    
  } catch (error) {
    res.status(401).json({error: 'Unautherized'})
  }
    
} 

const protectAdmin = (req,res,next)=>{
    if (req?.session?.role !== 'ADMIN') {
        return res.status(403).json({error: 'Admin access required'})
    }

    next()
}

export default {protect,protectAdmin}
