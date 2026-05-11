import React from 'react'
import {Toaster} from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginLanding from './pages/LoginLanding'
import Layout from './pages/Layout'
import DashBoard from './pages/DashBoard'
import Employee from './pages/Employees'
import Attendance from './pages/Attendance'
import Leave from './pages/Leave'
import Payslips from './pages/Payslips'
import PrintPayslips from './pages/PrintPayslips'
import Settings from './pages/Settings'
import LoginForm from './components/LoginForm'
const App = () => {
  return (
   <>
   <Toaster/>
   <Routes>


    <Route path='/login' element={<LoginLanding/>}/>
    <Route path='/login/admin' element={<LoginForm role="admin" title='Admin Portal' subtitle='sign in to manage the organization'/>}/>
    <Route path='/login/employee' element={<LoginForm role="employee" title='Employee Portal' subtitle='sign in to access your account'/>}/>
    <Route element={<Layout/>}>
       <Route path='dashboard' element={<DashBoard/>}/>
       <Route path='employees' element={<Employee/>}/>
       <Route path='attendance' element={<Attendance/>}/>
       <Route path='leave' element={<Leave/>}/>
       <Route path='payslips' element={<Payslips/>}/>
       <Route path='settings' element={<Settings/>}/>
    </Route>
    <Route path='/print/payslips/:id' element={<PrintPayslips/>}/>

    <Route path='*' element={<Navigate to='/dashboard' replace/>}/>
   </Routes>


   </>
  )
}

export default App
