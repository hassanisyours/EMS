import { DEPARTMENTS } from "../constance/department.js";
import attendanceModel from "../models/attendanceModel.js";
import employModel from "../models/EmployeeModel.js";
import leaveApplicationModel from "../models/leaveApplication.js";
import payslipModel from "../models/payslipModel.js";

/*
GET dashboard for employee and admin
GET /api/dashboard
*/
export const getDashboardController = async (req, res) => {
    try {
        const session = req.session;

        if (session.role === "ADMIN") {
            const [totalEmployees, todayAttendance, pendingLeaves] = await Promise.all([
                employModel.countDocuments({ isDeleted: { $ne: true } }),
                attendanceModel.countDocuments({
                    date: {
                        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        $lt: new Date(new Date().setHours(24, 0, 0, 0)),
                    },
                }),
                leaveApplicationModel.countDocuments({ status: "PENDING" }),
            ]);

            return res.json({
                role: "ADMIN",
                totalEmployees,
                totalDepartments: DEPARTMENTS.length,
                todayAttendance,
                pendingLeaves,
            });
        }

        const employee = await employModel.findOne({ userId: session.userId }).lean();

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        const today = new Date();
        const [currentMonthAttendance, pendingLeaves, latestPayslip] = await Promise.all([
            attendanceModel.countDocuments({
                employeeId: employee._id,
                date: {
                    $gte: new Date(today.getFullYear(), today.getMonth(), 1),
                    $lt: new Date(today.getFullYear(), today.getMonth() + 1, 1),
                },
            }),
            leaveApplicationModel.countDocuments({ employeeId: employee._id, status: "PENDING" }),
            payslipModel.findOne({ employeeId: employee._id }).sort({ createdAt: -1 }).lean(),
        ]);

        return res.json({
            role: "EMPLOYEE",
            employee: { ...employee, id: employee._id.toString() },
            currentMonthAttendance,
            pendingLeaves,
            latestPayslip: latestPayslip ? { ...latestPayslip, id: latestPayslip._id.toString() } : null,
        });
    } catch (error) {
        console.error("Dashboard error", error);
        return res.status(500).json({ error: "Failed" });
    }
};
