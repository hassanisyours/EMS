import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CalendarIcon, ChevronRightIcon, DollarSignIcon, FileTextIcon, LayoutGridIcon, LogOutIcon, MenuIcon, SettingsIcon, UserIcon, XIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
const Sidebar = () => {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [mobileOpen, setMobileOpen] = useState(false)
    const {user,logout} = useAuth();
    useEffect(() => {
            api.get('/profile').then(({data})=>{
                if (data.firstName) setUsername(`${data.firstName} ${data.lastName || ''} `.trim()) 
            }).catch(() => setUsername(''))
    }, [user])

    // close mobile sidebar on route change

    useEffect(() => {

        setMobileOpen(false)

    }, [pathname])

    const role = user?.role || 'EMPLOYEE';
    const navItems = [
        {name: 'Dashboard', href: '/dashboard', icon: LayoutGridIcon},
        role === 'ADMIN' ?  {name: 'Employees', href: '/employees', icon: UserIcon} : {name: 'Attendance', href: '/attendance', icon: CalendarIcon},
        {name: 'Leave', href: '/leave', icon: FileTextIcon},
        {name: 'Payslips', href: '/payslips', icon: DollarSignIcon},
        {name: 'Settings', href: '/settings', icon: SettingsIcon},

    ]

    const handleLogout = async ()=>{
        await logout()
        navigate('/login', { replace: true })
    }

    const SideberContent = (
        <>
            {/* brand header  */}
            <div className='px-5 pt-6 pb-5 border-b border-white/6 '>
                <div className='flex items-center justify-between '>
                    <div className='flex items-center gap-3'>
                        <UserIcon className='text-white size-7' />

                        <div>
                            <p className='font-semibold text-[13px] text-white tracking-wide'>Employee MS </p>
                            <p className='font-medium text-[11px] text-slate-500'>Management system</p>
                        </div>
                    </div>
                    <button className='lg:hidden text-slate-400 p-1 hover:text-white ' onClick={()=>{setMobileOpen(false)}}>{<XIcon size={20}/>}</button>
                </div>

            </div>
            {/* User profile card   */}
            {username &&( <div className='mx-3 mt-4 mb-1 p-3 rounded-lg bg-white/3 border border-white/4'>
                <div className='flex items-center gap-3'>
                    <div className='w-9 h-9 rounded-lg bg-slate-800 items-center flex justify-center ring-1 ring-white/10 shrink-0' >
                        <span className='text-slate-400 text-xs font-semibold'>
                            {username.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className='min-w-0 '>
                    <p className='text-[13px] font-medium text-slate-200 truncate'>{username}</p>
                    <p className='text-[11px] text-slate-500 truncate'>{role === 'ADMIN' ? 'administrator': 'Employee'}</p>
                    </div>
                </div>
            </div>)}
            
            {/* section label  */}

                <div className='px-5 pt-5 mb-2'>
                    <p className=' text-[10px] font-semibold tracking-[0.12em] text-slate-500'>NAVIGATION</p>
                </div>

            {/* navigation list  */}

                    <div className='flex-1 px-3 space-y-0.5 overflow-y-auto'>
                        {navItems.map((item)=>{
                                const IsActive = pathname.startsWith(item.href)
                            return (
                                <Link key={item.name} to={item.href} className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all duration-150 relative ${IsActive ? 'bg-indigo-500/12 text-indigo-300' : 'text-slate-300 hover:text-white hover:bg-white/4'}`}>
                                    {IsActive && <div className='absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500'/>}
                                    <item.icon className={`w-[17px] h-[17px] shrink-0 ${IsActive  ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-300'}`}/>
                                    <span className='flex-1  '>{item.name}</span>
                                    {IsActive && <ChevronRightIcon className='w-3.5 h-3.5 text-indigo-500'/>}
                                </Link>
                            )
                        })}
                    </div>
                
            {/* logout  */}

                        <div  className='p-3 border-t border-white/6 '><button onClick={handleLogout} className='flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-[13px] font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/8 transition-all duration-150'><LogOutIcon className='w-[17px] h-[17px]' />
                        <span>Log out</span></button></div>


        </>
    )


    return (
        <>
            {/* mobile hamburger menu  */}
            <button onClick={() => { setMobileOpen(true) }} className='lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg border border-white/20'>
                <MenuIcon size={20} />
            </button>


            {/* MOBILE OVERLAY  */}
            {mobileOpen && <div className='lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40' onClick={() => setMobileOpen(false)}>
    </div>}
                {/* Sidebar - desktop   */}

                <aside className='hidden lg:flex flex-col h-full w-65 bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white shrink-0 border-r border-white/4  '>
                    {SideberContent}
                </aside>

                {/* sidebar mobile  */}

                <aside className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white z-50 flex flex-col transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} `}>
                    {SideberContent}
                </aside>

        



        </>
    )
}

export default Sidebar
