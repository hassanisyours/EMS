import { inngest } from "../inngest/index.js";
import employModel from "../models/EmployeeModel.js";
import leaveApplicationModel from "../models/leaveApplication.js";

// Create Leave 


// POST /api/leaves
export const createLeaveController = async (req, res) => {
        try {
            const session = req.session;
            const employee = await employModel.findOne({userId: session.userId})

            if (!employee) {
                return res.status(404).json({error: 'Employee not found'})
            }

            if (employee.isDeleted) {
                return res.status(403).json({error: 'Your account is deactivated. You can not apply for leave.'})
            }

            const {type,startDate,endDate,reason} = req.body;
            if (!type || !startDate || !endDate || !reason) {
                return res.status(400).json({error :'Missing field'})
            }


            const today = new Date()
            today.setHours(0,0,0,0);

            if (new Date(startDate) <= today || new Date(endDate) <= today) {
                return res.status(400).json({error: 'Leave dates must be in the future'})
            }

            if (new Date(endDate) < new Date(startDate)) {
                return res.status(400).json({error: 'End date cannot be before start date'})
            }

            const leave = await leaveApplicationModel.create({
                employeeId: employee._id,
                type,
                startDate : new Date(startDate),
                endDate: new Date(endDate),
                reason,
                status: 'PENDING'
            })

            try {
                await inngest.send({
                    name: 'leave/pending',
                    data:{
                        leaveApplicationId: leave._id
                    }
                })
            } catch (error) {
                console.error('leave event dispatch failed', error)
            }

            res.json({success: true, data: leave})

        } catch (err) {
            return res.status(500).json({error: 'Failed to apply for leave'})
        }
} 

// Get Leave 
// GET /api/leaves
export const getLeaveController = async (req, res) => {
        try {
            const session = req.session;
            const isAdmin = session.role === 'ADMIN';
            if (isAdmin) {
                const status = req.query.status;
                const where = status ? {status} : {};
                const leaves = await leaveApplicationModel.find(where).populate('employeeId').sort({createdAt: -1});

                const data = leaves.map((l)=>{
                    const obj = l.toObject();
                    return {
                        ...obj,
                        id: obj._id.toString(),
                        employee: obj.employeeId ? {
                            ...obj.employeeId,
                            id: obj.employeeId._id?.toString(),
                        } : null,
                        employeeId: obj.employeeId?._id?.toString(),
                    }
                })
                return res.json({data})
            }else{
        const employee = await employModel.findOne({userId: session.userId}).lean();
        if (!employee) {
            return res.status(404).json({error: 'Employee not found'})
        }
        const leaves = await leaveApplicationModel.find({employeeId: employee._id}).sort({createdAt: -1});

        return res.json({data: leaves.map((leave)=>({
            ...leave.toObject(),
            id: leave._id.toString(),
        })), employee: {...employee,id: employee._id.toString()}})

        }
    } catch (error) {
        return res.status(500).json({error: 'Failed to fetch leave applications'})
    }
    
} 


// Update Leave 
// PATCH /api/leaves/:id
export const updateLeaveController = async (req, res) => {
    try {
        const {status} = req.body;
        if (!['APPROVED','REJECTED','PENDING'].includes(status)) {
            
            return res.status(400).json({error: 'Invalid status'})
        }

        const leave = await leaveApplicationModel.findByIdAndUpdate(req.params.id,{status},{returnDocument:'after'});
        if (!leave) {
            return res.status(404).json({error: 'Leave not found'})
        }
        return res.json({success: true, data: leave})
        
    } catch (error) {
        return res.status(500).json({error: 'FAILED'});
    }


} 

