import React, { useCallback, useEffect, useState } from 'react'
import { dummyEmployeeData, dummyPayslipData } from '../assets/assets'
import Loading from '../components/Loading'
import PayslipList from '../components/payslips/PayslipList'
import GeneratePayslipsForm from '../components/payslips/GeneratePayslipsForm'


const Payslips = () => {

  const [payslips, setPayslips] = useState([])
  const [loading, setLoading] = useState(true)
  const [employee, setEmployee] = useState([])
  const isAdmin = true

  const fetchPayslipsData = useCallback(async () => {
    await setPayslips(dummyPayslipData)
    setTimeout(() => {
        setLoading(false)
    }, 1000);   
    },
    [],
  )


  useEffect(() => {
      fetchPayslipsData()
  }, [fetchPayslipsData])
  
  useEffect(() => {
    if (isAdmin) {
        setEmployee(dummyEmployeeData)
    }
  }, [isAdmin])


  

  if(loading) return <Loading/>

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