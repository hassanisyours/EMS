import React, { useState } from 'react'
import {Loader2Icon} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {DEPARTMENTS} from '../assets/assets'
const EmployeeForm = ({ initialData, onSuccess, onCancel }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const isEditMode = !!initialData;

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData(e.currentTarget)
            const payload = Object.fromEntries(formData.entries())

            const token = localStorage.getItem('token')
            const url = `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/employee${isEditMode ? `/${initialData.id || initialData._id}` : ''}`
            const response = await fetch(url, {
                method: isEditMode ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(payload)
            })

            const data = await response.json()
            if (!response.ok) {
                throw new Error(data?.error || data?.message || 'Failed to save employee')
            }

            onSuccess?.(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <form onSubmit={handleSubmit} className='space-y-6 max-w-3xl animate-fade-in'>
            {/* persnol information  */}
            <div className='card p-5 sm:p-6'>
                <h3 className='font-medium mb-6 pb-4 border-b border-slate-100'>Persnol information</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700'>
                    <div>
                        <label className='block mb-2'>First Name</label>
                        <input name='firstName' required defaultValue={initialData?.firstName} />
                    </div>
                    <div>
                        <label className='block mb-2'>Last Name</label>
                        <input name='lastName' required defaultValue={initialData?.lastName} />
                    </div>
                    <div>
                        <label className='block mb-2'>Phone Number</label>
                        <input name='phone' required defaultValue={initialData?.phone} />
                    </div>
                    <div>
                        <label className='block mb-2'>Join Date</label>
                        <input type='date' name='joinDate' required defaultValue={initialData?.joinDate ? new Date(initialData?.joinDate).toISOString().split("T")[0] : ''} />
                    </div>
                    <div className='sm:col-span-2'>
                        <label className='block mb-2'>bio (optional)</label>
                        <textarea name='bio' defaultValue={initialData?.bio} rows={3} className='resize-none' placeholder='Brief Description' />
                    </div>
                </div>
            </div>



            {/* EMPLOYEEMENT DETAIL  */}

        <div className='card p-5 sm:p-6'>
           <h3 className='text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100'>Employment Details</h3> 
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700'>
                <div>
                    <label className='block mb-2'>Department</label>
                    <select name="department" defaultValue={initialData?.department || ''}>
                        <option value="" >Select Department</option>
                        {DEPARTMENTS.map((item)=>{return (
                            <option key={item} value={item}>{item}</option>
                        )})}
                    </select>
                </div>

                    <div>
                        <label className='block mb-2'>Positon</label>
                        <input name='position' required defaultValue={initialData?.position} />
                    </div>
                    <div>
                        <label className='block mb-2'>Basic salary</label>
                        <input type='number' min='0' step='0.01' name='basicSalary' required defaultValue={initialData?.basicSalary || 0} />
                    </div>
                    <div>
                        <label className='block mb-2'>Allowances</label>
                        <input type='number' min='0' step='0.01' name='allowances' required defaultValue={initialData?.allowances || 0} />
                    </div>
                     <div>
                        <label className='block mb-2'>Deductions</label>
                        <input type='number' min='0' step='0.01' name='deductions' required defaultValue={initialData?.deductions || 0} />
                    </div>

                    {isEditMode &&  ( <div>
                        <label className='block mb-2'>Status</label>
                        <select name='employmentStatus' required defaultValue={initialData?.employmentStatus}>
                            <option value='ACTIVE'>Active</option>
                            <option value='INACTIVE'>Inactive</option>
                        </select>
                    </div>) }

            </div>
             </div>


            {/* Account Setup  */}

                            <div className='card p-5 sm:p-6'>
                <h3 className='text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100'>Account Setup</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700'>
                    <div className='sm:col-span-2'>
                        <label className='block mb-2'>Work Email</label>
                        <input name='email' type='email' required defaultValue={initialData?.email} />
                    </div>
                        {!isEditMode && (
                    <div className='sm:col-span-2'>
                        <label className='block mb-2'>Temporary Password</label>
                        <input name='password' type='password' required  />
                    </div>

                        )}
                        {isEditMode && (
                    <div className='sm:col-span-2'>
                        <label className='block mb-2'>Change Password (optional)</label>
                        <input name='password' type='password' placeholder='Leave blank to keep current'/>
                    </div>

                        )}

                    <div className='sm:col-span-2'>
                        <label className='block mb-2'>System Role</label>
                        <select name="role" defaultValue={initialData?.user?.role || 'EMPLOYEE'}>
                            <option value="EMPLOYEE">Employee</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                </div>
            </div>


            {/* button */}
                            <div className='flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2'>

                            <button type='button' className='btn-secondary' onClick={()=>{onCancel ? onCancel() : navigate(-1) }}>Cancel</button>
                            <button disabled={loading} className='btn-primary flex items-center justify-center' type='submit'>{loading && <Loader2Icon className='w-4 h-4 mr-2 animate-spin'/>}{isEditMode ? 'Update Employee': 'Create Employee'}</button>
                            </div>

        </form>
    )
}

export default EmployeeForm
