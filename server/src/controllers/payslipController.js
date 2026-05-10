
import payslipModel from "../models/payslipModel.js";
import employeeModel from "../models/EmployeeModel.js";


/**Create payslip 
POST /api/payslips **/
export const createPayslipController = async (req, res) => {
    try {
        const {employeeId, month , year, basicSalary, allowances,deductions} = req.body

        if (!employeeId || !month || !year || !basicSalary) {
            return res.status(400).json({error:'Missing field' })
        }

        const netSalary = Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0);

        const payslip = await payslipModel.create({
            employeeId,
            month: Number(month),
            year: Number(year),
            basicSalary: Number(basicSalary),
            allowances: Number(allowances || 0),
            deductions: Number(deductions || 0),
            netSalary: Number(netSalary),
        })

        return res.json({data : payslip});

    } catch (error) {
        
        res.status(500).json({error: 'Failed'})
    }
}

// get payslip 
// GET /api/payslips
export const getPayslipController = async (req, res) => {
    try {
        
        const session = req.session;
        const isAdmin = session.role === 'ADMIN';

        if (isAdmin) {
            const payslip = await payslipModel.find().populate(session.employeeId).sort({createdAt: -1});

            const data = payslip.map((p)=>{
                const obj = p.toObject();
                return {
                    ...obj,
                    id: obj._id.toString(),
                    employee : obj.employeeId,
                    employeeId: obj.employeeId?._id?.toString()
                }


            })

            return res.json({data})

        }else{
            const employee = await employeeModel.findOne({userId: session.userId})
            if (!employee) {
                res.status(404).json({error: 'Not Found'})
            }
            const payslip = await payslipModel.find({employeeId: employee._id}).sort({createdAt: -1});

            return res.json({data: payslip})
        }
        
    } catch (error) {
        res.status(500).json({error: 'Failed'})
    }
}

// get payslip by id 
// GET /api/payslips/:id 
export const getPayslipByIdController = async (req, res) => {
    try {
        const paySlip = await payslipModel.findById(req.params.id).populate('employeeId').lean();

        if (!paySlip) {
            res.status(404).json({error: 'Not found'})
        }
        const result = {
            ...paySlip,
            id: paySlip._id.toString(),
            employee: paySlip.employeeId
        }
        return res.json(result)

    } catch (error) {
        
        res.status(500).json({error: 'Failed'})
    }
}