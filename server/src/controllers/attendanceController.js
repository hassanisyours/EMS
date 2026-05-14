import { inngest } from "../inngest/index.js";
import attendanceModel from "../models/attendanceModel.js";
import employModel from "../models/EmployeeModel.js";



// Clock in/out for employee 
// POST /api/attendance 
const clockinOutController = async (req, res) => {
    try {
     const session = req.session;
     const employee = await employModel.findOne({userId: session.userId});
     if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
     }
     if (employee.isDeleted) {
        return res.status(400).json({ message: "Your account is deactivated. You cannot clock in/out" });
     }

     const today = new Date()
     today.setHours(0,0,0,0,);

     const existing = await attendanceModel.findOne({employeeId: employee._id, date: today})

     
    const now = new Date();
    if (!existing) {
        const isLate = now.getHours() >= 9 && now.getMinutes() > 0;

        const attendance = await attendanceModel.create({
            employeeId: employee._id,
            date: today,
            checkIn: now,
            status: isLate ? 'LATE': 'PRESENT'
        })

        try {
            await inngest.send({
                name: 'employee/check-out',
                data: {
                    employeeId : employee._id,
                    attendanceId : attendance._id
                }
            })
        } catch (error) {
            console.error('attendance event dispatch failed', error)
        }

        return res.json({success: true, type:'CHECK_IN',data: attendance })
    }else if(!existing.checkOut){
        const checkInTime = new Date(existing.checkIn).getTime();
        const diffMs = now.getTime() - checkInTime;
        const diffHours = diffMs / (1000 * 60 * 60);

        existing.checkOut = now;

        const workingHours = parseFloat(diffHours.toFixed(2));
        let dayType = 'Half Day'
        if(workingHours >= 8) dayType = 'Full Day';
        else if(workingHours >=6)dayType = 'Three Quarter Day';
        else if(workingHours >=4)dayType = 'Half Day';
        else{dayType = 'Short Day'}

        existing.workingHours = workingHours;
        existing.dayType = dayType

        await existing.save();
        return res.json({success : true ,type: 'CHECK_OUT',data: existing })
        
        
    }else{
        return res.json({success : true ,type: 'CHECK_OUT',data: existing })
    }

    } catch (error) {
            console.error('attendance error:',error)        
            return res.status(500).json({error: 'Operation failed'})
        } 
    }
    
    // Get attendance for employee 
    // GET /api/attendance 
    const getAttendanceController = async (req, res) => {
        try {
              const session = req.session;
     const employee = await employModel.findOne({userId: session.userId});
     if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
     }
   
     const limit = parseInt(req.query.limit || 30, 10)
     const history = await attendanceModel.find({employeeId: employee._id}).sort({date: -1}).limit(limit)

     return res.json({data: history,employee :{ isDeleted: employee.isDeleted} })
            
        } catch (error) {

            return res.status(500).json({error: 'Failed to fetch attendance'})
            
        } 
        }

        export default {getAttendanceController,clockinOutController}
