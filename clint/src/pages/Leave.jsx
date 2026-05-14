import React, { useCallback, useEffect, useState } from 'react'
import Loading from '../components/Loading'
import { PalmtreeIcon, PlusIcon, ThermometerIcon, UmbrellaIcon } from 'lucide-react'
import LeaveHistory from '../components/leave/LeaveHistory'
import ApplyLeaveModel from '../components/leave/ApplyLeaveModel'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
const Leave = () => {
  
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModel, setShowModel] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)
  const [error, setError] = useState('')
  const {user} = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const fetchLeaves = useCallback(
    async () => {
      try {
        setError('')
        const { data } = await api.get('/leave')
        setLeaves(data.data || data.date || [])
        setIsDeleted(Boolean(data.employee?.isDeleted))
      } catch (error) {
        setError(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to load leaves')
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    fetchLeaves()
  }, [fetchLeaves])
  


  

  if(loading){
    return <Loading/>
  }
  if (error) {
    return <p className='text-center text-rose-500 py-12'>{error}</p>
  }

  const approvedleaves = leaves.filter((l)=> l.status === 'APPROVED')
  const sickCount = approvedleaves.filter((l)=> l.type === 'SICK').length
  const casualCount = approvedleaves.filter((l)=> l.type === 'CASUAL').length
  const annualCount = approvedleaves.filter((l)=> l.type === 'ANNUAL').length

 const leaveStats = [
  {Label: 'Sick Leave', value : sickCount,icon: ThermometerIcon},
  {Label: 'Casual Leave', value : casualCount,icon: UmbrellaIcon},
  {Label: 'Annual Leave', value : annualCount,icon: PalmtreeIcon},
 ]

  return (
    <div className='animate-fade-in'>
      <div className='flex flex-col sm:flex-row justify-between sm:items-center items-start gap-4 mb-8'>
        <div>
          <h1 className='page-title'>Leave Management</h1>
          <p className='page-subtitle'>{isAdmin ? 'Manage leave applications' : 'Your leave history and requests'}</p>
        </div>
        {!isAdmin && !isDeleted && (
          <button onClick={() => setShowModel(true)} className='btn-primary flex items-center gap-2 w-full sm:w-auto justify-center'><PlusIcon className='w-4 h-4'/>Apply for Leaves</button>
        )}
      </div>

      {!isAdmin && (
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8'>
          {leaveStats.map((s)=>{
      return <div key={s.Label} className='card card-hover p-5 sm:p-6 flex items-center gap-4 relative overflow-hidden group'>
             <div className='absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70'/>
             <div className='bg-slate-100 p-3 rounded-lg group-hover:bg-indigo-50 transition-colors duration-200'>
              <s.icon className='w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors duration-400'/>
             </div>
                <div >
                  <p className='text-sm text-slate-500' >{s.Label}</p>
                  <p className='text-2xl font-bold text-slate-900 tracking-tight'>{s.value} <span className='text-sm font-normal text-slate-400'>taken</span></p>
                  
                </div>

            </div>
          })}



        </div>
      )}

      <LeaveHistory leaves={leaves} isAdmin={isAdmin} onUpdate={fetchLeaves} />
      <ApplyLeaveModel open={showModel} onClose={()=>setShowModel(false)} onSuccess={fetchLeaves}/> 
    </div>
  )
}

export default Leave
