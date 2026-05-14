import React, { useCallback, useEffect, useState } from 'react'
import Loading from '../components/Loading'
import PayslipList from '../components/payslips/PayslipList'
import GeneratePayslipsForm from '../components/payslips/GeneratePayslipsForm'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'


const Payslips = () => {

  const [payslips, setPayslips] = useState([])
  const [loading, setLoading] = useState(true)
  const [employee, setEmployee] = useState([])
  const [error, setError] = useState('')
  const {user} = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const fetchPayslipsData = useCallback(async () => {
    try {
      setError('')
      const [payslipResponse, employeeResponse] = await Promise.all([
        api.get('/payslip'),
        isAdmin ? api.get('/employee') : Promise.resolve({ data: [] }),
      ])
      setPayslips(payslipResponse.data?.data || [])
      if (isAdmin) {
        setEmployee(employeeResponse.data || [])
      }
    } catch (error) {
      setError(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to load payslips')
    } finally {
      setLoading(false)
    }
    },
    [isAdmin],
  )


  useEffect(() => {
      fetchPayslipsData()
  }, [fetchPayslipsData])


      

  if(loading) return <Loading/>
  if (error) return <p className='text-center text-rose-500 py-12'>{error}</p>

  return (
    <div className='animate-fade-in'>
      <div className='flex flex-col sm:flex-row justify-between sm:items-center items-start gap-4 mb-8'>
        <div>
          <h1 className='page-title'>Payslips</h1>
          <p className='page-subtitle'>{isAdmin ? 'Generate and manage employee payslips' : 'Your payslips history'}</p>
        </div>
        {isAdmin && <GeneratePayslipsForm employees={employee} onSuccess={fetchPayslipsData}/>}
      </div>
      <PayslipList isAdmin={isAdmin} payslips={payslips}/>
    </div>
  )
}

export default Payslips
