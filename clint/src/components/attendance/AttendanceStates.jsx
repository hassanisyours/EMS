import { AlertCircleIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import React from 'react'

const AttendanceStates = ({history}) => {

    const totalPresent = history.filter((h)=>{
            return h.status === 'PRESENT' || h.status === 'LATE'
    }).length;

    const totalLate = history.filter((h)=>{
           return h.status === 'LATE'
    }).length;

    const totalHours = history.reduce((sum, item) => sum + (Number(item.workingHours) || 0), 0);
    const avgHours = history.length ? (totalHours / history.length).toFixed(1) : '0.0';

    const stats = [
        {label: "Days Present",value: totalPresent,icon: CalendarIcon},
        {label: "Late Arrivals",value: totalLate,icon: AlertCircleIcon},
        {label: "Avg. Work Hours",value: `${avgHours} hour`,icon: ClockIcon}
    ]

  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8'>
        {stats.map((s)=>(
            <div key={s.label} className='card card-hover p-5 sm:p-6 flex items-center gap-4 relative overflow-hidden group'>
                <div className='absolute top-0 bottom-0 left-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70'/>
                <div className='p-3 bg-slate-100 rounded-lg group-hover:bg-indigo-50 transition-colors duration-200'>
                    <s.icon className='w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors duration-200'/>
                </div>
                <div className=''>
                    <p className='text-sm text-slate-500'>{s.label}</p>
                    <p className='text-2xl font-medium text-slate-900 tracking-tight'>{s.value}</p>
                </div>

            </div>
        )
            
        )}
    </div>
  )
}

export default AttendanceStates
