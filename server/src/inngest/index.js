import { Inngest } from "inngest";
import attendanceModel from "../models/attendanceModel.js";
import employModel from "../models/EmployeeModel.js";
import leaveApplicationModel from "../models/leaveApplication.js";
import sendEmail from "../config/nodemailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "hassan-yt" });


// Auto checkout for employees
const autoCheckout = inngest.createFunction(
  { id: "auto-check-out",triggers:[{event:'employee/check-out'}] },
  async ({ event, step }) => {
    const { employeeId, attendanceId } = event.data;

    // wait for 9 hours 
    await step.sleepUntil('wait-for-the-9-hours', new Date(new Date().getTime() + 9 * 60 * 60 * 1000));

    // get attendance data

    let attendance = await attendanceModel.findById(attendanceId);
    if (!attendance?.Checkout) {
        // GET EMPLOYEE DATA 
        const employee = await employModel.findById(employeeId);

        // SEND REMINDER EMAIL 

        await sendEmail({
            to:employee.email,
            subject:'Attendance checkout reminder',
            body: `
                <div style="max-width: 600px;">
                    <h2>Hi ${employee.firstName}, 👋</h2>
                    <p style="font-size: 16px;">You have a check-in in ${employee.department} today:</p>
                    <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">${attendance?.checkIn?.toLocaleTimeString()}</p>
                    <p style="font-size: 16px;">Please make sure to check-out in one hour.</p>
                    <p style="font-size: 16px;">If you have any questions, please contact your admin.</p>
                    <br />
                    <p style="font-size: 16px;">Best Regards,</p>
                    <p style="font-size: 16px;">EMS</p>
                </div>
            `
        })


        // after 10 hours, mark attendance as checkout with status 'LATE'
        await step.sleepUntil('wait-for-the-1-hour',new Date(new Date().getTime() + 1 * 60 * 60 * 1000));
        attendance = await attendanceModel.findById(attendanceId);
        if (!attendance?.Checkout) {
            attendance.Checkout = new Date(attendance.CheckIn).getTime() + 4 * 60 * 60 * 1000; 
            attendance.workingHours = 4;
            attendance.dayType = 'Half-day';
            attendance.status = 'LATE';
            await attendance.save();

          
        }
    }
},
);

// Send email to admin if admin doesn't take action on leave application within 24 hours
const leaveApplicationReminder = inngest.createFunction(
  { id: "leave-application-reminder",triggers:[{event:'leave/pending'}] },
    async ({ event, step }) => {
        const {leaveApplicationId} = event.data;
        // wait for 24 hours 
        await step.sleepUntil('wait-for-the-24-hours', new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
        const leaveApplication = await leaveApplicationModel.findById(leaveApplicationId);
        if (leaveApplication?.status === 'PENDING') {
            const employee = await employModel.findById(leaveApplication.employeeId);
            // send email to admin to take action on leave application

            await sendEmail({
                to:process.env.ADMIN_EMAIL,
                subject:'Leave Application Reminder',
                body:`
            <div style="max-width: 600px;">
                <h2>Hi Admin, 👋</h2>
                <p style="font-size: 16px;">You have a leave application in ${employee.department} today:</p>
                <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">${leaveApplication?.startDate?.toLocaleDateString()}</p>
                <p style="font-size: 16px;">Please make sure to take action on this leave application.</p>
                <br />
                <p style="font-size: 16px;">Best Regards,</p>
                <p style="font-size: 16px;">EMS</p>
            </div>
        `
            })

        }


    }
);

// cron: checkattendance at 11:30 AM IST (06:00 AM UTC) and email absent employees
const attendanceReminderCron = inngest.createFunction(
  { id: "attendance-reminder-cron",triggers:[{cron: 'TZ=Asia/Karachi 30 11 * * *'}] },
    async ({  step }) => {
        const today = await step.run("get-today-date", () => {
            const startUTC = new Date(new Date().toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi' }) + 'T00:00:00+5:00'); // Start of the day in UTC;
            const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000); // End of the day in UTC;
            return { startUTC: startUTC.toISOString(), endUTC: endUTC.toISOString() };

        })
        const activeEmployees = await step.run("get-active-employees", async () => {
            const employees = await employModel.find({ employmentStatus: 'ACTIVE',isDeleted:false }).lean();
            return employees.map((e)=>({_id:e._id.toString(),firstName:e.firstName,lastName:e.lastName,email:e.email,department:e.department}));


        })
        
        const onleaveId = await step.run("get-on-leave-ids", async () => {
            const leaves = await leaveApplicationModel.find({ status: 'APPROVED', startDate: { $lte: new Date(today.endUTC) }, endDate: { $gte: new Date(today.startUTC) } }).lean();
            return leaves.map((l) => l.employeeId.toString());
        })

        const checkedInids = await step.run("get-checked-in-ids", async () => {
            const attendances = await attendanceModel.find({Date: { $gte: new Date(today.startUTC), $lt: new Date(today.endUTC) } }).lean();
            return attendances.map((a) => a.employeeId.toString());
        });

        const absentEmployees = activeEmployees.filter((e) => !onleaveId.includes(e._id) && !checkedInids.includes(e._id));

        if (absentEmployees.length > 0) {
            await step.run("send-absent-employees-email", async () => {
                const emailsPromises = absentEmployees.map((e)=>{

                    sendEmail({
                        to:e.email,
                        subject:'Attendance Reminder - Please Mark you Attendance',
                        body:`
                            <div style="max-width: 600px; font-family: Arial, sans-serif;">
                                <h2>Hi ${emp.firstName}, 👋</h2>
                                <p style="font-size: 16px;">We noticed you haven't marked your attendance yet today.</p>
                                <p style="font-size: 16px;">The deadline was <strong>11:30 AM</strong> and your attendance is still missing.</p>
                                <p style="font-size: 16px;">Please check in as soon as possible or contact your admin if you're facing any issues.</p>
                                <br />
                                <p style="font-size: 14px; color: #666;">Department: ${emp.department}</p>
                                <br />
                                <p style="font-size: 16px;">Best Regards,</p>
                                <p style="font-size: 16px;"><strong>QuickEMS</strong></p>
                            </div>
                        `
                    })

                })
            });
        }
        return {totalActive:activeEmployees.length,onLeave:onleaveId.length,checkedIn:checkedInids.length,absent:absentEmployees.length};
    }
);



// Create an empty array where we'll export future Inngest functions
export const functions = [leaveApplicationReminder, autoCheckout,attendanceReminderCron];