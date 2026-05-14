import { useEffect, useState } from "react"
import Loading from "../components/Loading"
import EployeeDashboard from "../components/EployeeDashboard"
import AdminDashboard from "../components/AdminDashboard"
import api from "../api/axios"
const DashBoard = () => {
  const [data, setdata] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    let active = true
    const fetchDashboard = async () => {
      try {
        setError('')
        const { data } = await api.get('/dashboard')
        if (!active) return
        setdata(data)
      } catch (error) {
        if (!active) return
        setError(error.response?.data?.error || error.message || 'Failed to load dashboard')
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchDashboard()
    return () => {
      active = false
    }
  }, [])
  

  if (loading) {
      return  <Loading/>
  }
  if (error) {
      return <p className="text-center text-rose-500 py-12">{error}</p>
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
