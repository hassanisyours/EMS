import employModel from "../models/EmployeeModel.js"


// // GET PROFILE 
// GET /api/profile
const getProfileController  = async (req,res) => {
 try {
    const session = req.session
    const employee = employModel.findOne({userId: session.userId})

    if(!employee){
        return res.json({
            firstName: 'Admin',
            lastName:'',
            email:session.email,


        })}

        return res.json(employee)

 } catch (error) {
      res.status(500).json({error: error})
    
 }   
}


// // UPDATE PROFILE 
// PUT /api/profile

const updateProfileController = async (req,res) => {
    try {

         const session = req.session
    const employee = employModel.findOne({userId: session.userId})
              if(!employee)return res.status(404).json({error: 'Employee not found'})
              if(employee.isDeleted)return res.status(403).json({error: 'Your account is deactivated. you can not update your profile'})

                await employModel.findByIdAndUpdate(employee._id,{bio:req.body.bio})

                return res.json({success: true})

        
    } catch (error) {
        
            res.status(500).json({error: 'failed to update profile'})
    }  
}


export default {getProfileController,updateProfileController}