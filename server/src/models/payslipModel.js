import mongoose from "mongoose";

const PayslipSchema = new mongoose.Schema({
    employeeId: {type : mongoose.Schema.Types.ObjectId,ref: 'Employee',required:true},
    month: {type: String, required: true},
    year: {type: Number, required: true},
    basicSalary: {type: Number, required: true},
    allowances: {type: Number, required: true},
    deductions: {type: Number, required: true},
    netSalary: {type: Number, required: true},
},{timestamps:true});


const payslipModel = mongoose.models.Payslip || mongoose.model('Payslip',PayslipSchema)

export default payslipModel;