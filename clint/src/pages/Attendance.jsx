import { useCallback, useEffect, useState } from "react"
import { dummyAttendanceData } from "../assets/assets"
import Loading from "../components/Loading"
import CheckinBtn from "../components/attendance/CheckinBtn"
import AttendanceStates from "../components/attendance/AttendanceStates"
import AttendanceHistory from "../components/attendance/AttendanceHistory"



const Attendance = () => {

  const [history, sethistory] = useState([])
  const [loading, setloading] = useState(true)
  const [isDeleted, setIsDeleted] = useState(false)

  const fetchData = useCallback(
    () => {
      sethistory(dummyAttendanceData)
      setTimeout(() => {
        setloading(false)
      }, 1000);
    },
    [],
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])


  if (loading) {
    return <Loading/>
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