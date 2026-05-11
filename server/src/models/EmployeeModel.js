import mongoose from 'mongoose'
import { DEPARTMENTS } from '../constance/department.js'

const employSchema = new mongoose.Schema({
   userId:{type: mongoose.Schema.Types.ObjectId,ref: 'user',required:true ,unique:true} ,
   firstName: {type:String ,required:true},
   lastName: {type:String ,required:true},
   email: {type:String ,required:true},
   phone: {type:String ,required:true},
   position: {type:String ,required:true},
   basicSalary: {type:Number, default: 0,required:true},
   allowances: {type:Number, default: 0,required:true},
   deductions: {type:Number, default: 0,required:true},
   employmentStatus: {type:String, default: "ACTIVE",enum:['ACTIVE','INACTIVE'] ,required:true},
   joinDate: {type:Date, required:true},
   isDeleted: {type:Boolean,default:false},
   bio: {type:String,default:''},
   department: {type:String,enum: DEPARTMENTS,default:'Engineering'},

   

    
},{timestamps:true})

const employModel = mongoose.models.Employee || mongoose.model('Employee',employSchema)

export default employModel
