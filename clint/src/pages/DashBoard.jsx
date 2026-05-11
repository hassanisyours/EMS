import { useEffect, useState } from "react"
import { dummyAdminDashboardData, dummyEmployeeDashboardData } from "../assets/assets"
import Loading from "../components/Loading"
import EployeeDashboard from "../components/EployeeDashboard"
import AdminDashboard from "../components/AdminDashboard"
const DashBoard = () => {
  const [data, setdata] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const role = localStorage.getItem('role') || 'EMPLOYEE'
    setdata(role === 'ADMIN' ? dummyAdminDashboardData : dummyEmployeeDashboardData)
    setTimeout(() => {
      
      setLoading(false)
    }, 1000);
  }, [])
  

  if (loading) {
      return  <Loading/>
  }
  if (!data) {
      return  <p className="text-center text-slate-500 py-12">Failed to load dashboard</p>
  }

  if (data.role === 'ADMIN') {
        return <AdminDashboard data={data}/>
  }else{
    return <EployeeDashboard data={data}/>
  }
  
  
  }

export default DashBoard
