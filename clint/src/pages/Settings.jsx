import React, { useEffect, useState } from 'react'
import { dummyProfileData } from '../assets/assets'
import Loading from '../components/Loading'
import { Lock } from 'lucide-react'
import ProfileForm from '../components/ProfileForm'
import ChangePassModel from '../components/ChangePassModel'
const Settings = () => {

    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showpasswordModel, setShowpasswordModel] = useState(false)

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/profile`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        })

        if (!response.ok) {
          throw new Error('Failed to load profile')
        }

        const data = await response.json()
        setProfile(data)
      } catch (error) {
        setProfile(dummyProfileData)
      } finally {
        setLoading(false)
      }
    }

      useEffect(() => {
        fetchProfile()
      }, [])
      if (loading) return <Loading/>

  return (
    <div className='animate-fade-in'>
      <div className='page-header'>
        <h1 className='page-title'>Settings</h1>
        <p className='page-subtitle'>Manage your account and preferences</p>
      </div>

      {profile && <ProfileForm initialData={profile} onSuccess={fetchProfile}/>}

      {/* change password trigger        */}
      <div className='card max-w-md p-6 flex items-center justify-between'>

     
      <div className='flex items-center gap-3'>
        <div className='p-2.5 bg-slate-100 rounded-lg'>
          <Lock className='w-5 h-5 text-slate-600'/>
        </div>
        <div>
          <p className='font-medium text-slate-900'>Password</p>
          <p className='text-sm text-slate-500'>Update your account password</p>
        </div>

      </div>
      <button className='btn-secondary text-sm' onClick={()=>setShowpasswordModel(true)}>
        Change
      </button>
    </div>
    <ChangePassModel onClose={()=>setShowpasswordModel(false)} open={showpasswordModel}/>
     </div>
  )
}

export default Settings
