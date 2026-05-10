// get EMPLOYEEE /

import employModel from "../models/EmployeeModel.js";
import userModel from '../models/UserModel.js'

//GET  /api/employees
const getEmployeeController = async (req,res) => {
    try {
        const { department } = req.query
        const where = {};

        if (department) {
            where.department = department;

        };
            const employees = (await employModel.find(where)).toSorted({createdAt: -1}).populate('userId','email role').lean();
        const result = employees.map((emp)=>({
            ...emp,
            id: emp._id.toString(),
            user:emp.userId ? {email: emp.userId.email, role: emp.userId.role} : null
        }))

        return res.json(result)
            
    } catch (err) {
        return res.status(500).json({err,message: 'Failed to fetch employee'}) 
    }
}


// create employee 
//POST /api/employees
const createEmployeeController = async (req,res) => {
    try {
        const {firstName , lastName , email ,phone, position, department,basicSalary,allowances,deductions,joinDate,password,role,bio} = req.body;
        
        if (!email || !password || !firstName || !lastName) {
                return res.status(400).json({error: 'Missing required fields'})

        }

        const hash = await bcrypt.hash(password,10);
        const user = await userModel.create({
            email: email,
            password: hash,
            role: role || 'EMPLOYEE'
        })

        const employee = await employModel.create({
            userId: user._id,
            firstName,
            lastName,
            email,
            phone,
            position,
            department : department || 'Engineering',
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(basicSalary) || 0,
            deductions: Number(basicSalary) || 0,
            joinDate: new Date(joinDate),
            bio: bio || ''

        })


        return res.status(201).json({success: true , employee})


    } catch (err) {
        if (err.code === 11000) {
            
            return res.status(400).json({err,message: 'email already exists'}) 
        }
        console.error('Create employee error:' ,err)
        return res.status(500).json({err,message: 'Failed to create employee'}) 
        
    }
}
// Update employee 
//PUT /api/employees/:id
const updateEmployeeController = async (req,res) => {
        try {
            const {id} = req.params;
        const {firstName , lastName , email ,phone, position, department,basicSalary,allowances,deductions,password,role,bio,employmentStatus} = req.body;
        
        const employee = await employModel.findById(id);
        if (!employee) {
            return res.status(404).json({error:"Employee not found"})
        }




        await employModel.findByIdAndUpdate({
          
            firstName,
            lastName,
            email,
            phone,
            position,
            department : department || 'Engineering',
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(basicSalary) || 0,
            deductions: Number(basicSalary) || 0,
           employmentStatus: employmentStatus || 'ACTIVE',
            bio: bio || ''

        })

        // Update user record 

        const userUpdate = {email};
        if (role) {
            userModel.role = role;
        }
        

        if (password) {
            userModel.password = await bcrypt.hash(password,10)
        }
       
        await userModel.findByIdAndUpdate(employee.userId,userUpdate)

        return res.json({success: true })


    } catch (err) {
        if (err.code === 11000) {
            
            return res.status(400).json({err,message: 'email already exists'}) 
        }
        return res.status(500).json({err,message: 'Failed to update employee'}) 
        
    }

    
}
// Delete employee 
//Delete /api/employees/:id
const deleteEmployeeController = async (req,res) => {
    try {
        const { id } = req.params;
        const employee = await employModel.findById(id)
        if (!employee) {
            return res.status(404).json({error:'Employee not found' });
        }

        employee.isDeleted = true;
        employee.employmentStatus = "INACTIVE"
        await employee.save()
        return res.json({success : true})

    } catch (error) {
        res.status(500).json({error : 'Failed to delete employee'})
    }

}


export default { createEmployeeController,getEmployeeController,updateEmployeeController,deleteEmployeeController}