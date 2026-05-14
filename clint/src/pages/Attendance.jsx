import { useCallback, useEffect, useState } from "react"
import Loading from "../components/Loading"
import CheckinBtn from "../components/attendance/CheckinBtn"
import AttendanceStates from "../components/attendance/AttendanceStates"
import AttendanceHistory from "../components/attendance/AttendanceHistory"
import api from "../api/axios"



const Attendance = () => {

  const [history, sethistory] = useState([])
  const [loading, setloading] = useState(true)
  const [isDeleted, setIsDeleted] = useState(false)
  const [error, setError] = useState('')

  const fetchData = useCallback(
    async () => {
      try {
        setError('')
        const { data } = await api.get('/attendance')
        sethistory(data.data || [])
        setIsDeleted(Boolean(data.employee?.isDeleted))
      } catch (error) {
        setError(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to load attendance')
      } finally {
        setloading(false)
      }
    },
    [],
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])


  if (loading) {
    return <Loading/>
  }
  if (error) {
    return <p className="text-center text-rose-500 py-12">{error}</p>
  }

  const today = new Date()
  today.setHours(0,0,0,0)

  const todayRecord = history.find((r)=>{
    return new Date(r.date).toDateString() === today.toDateString()
  }) 

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">Track your work hour and daily check-ins</p>
      </div>

    {isDeleted ? (<div className="mb-8 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center">
      <p className="text-rose-600">you can no longer clock in or out becouse your employee record have been marked as  deleted </p>
    </div>)
     :(<div className="mb-8">
          <CheckinBtn onAction={fetchData} todayRecord={todayRecord}/>
    </div>) }

      <AttendanceStates history={history} />
      <AttendanceHistory history={history} />

    </div>
  )
}

export default Attendance
