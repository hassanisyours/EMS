import React from 'react'
import { getDayTypeDisplay, getWorkingHoursDisplay} from '../../assets/assets'
import {format}from 'date-fns'
const AttendanceHistory = ({history}) => {
  return (
    <div className='card overflow-hidden'>
        <div className='px-6 py-4 border-b border-slate-100'>
            <h3 className='font-semibold text-slate-900'>Recent activity</h3>
        </div>
    <div className='overflow-auto'>
        <table className='table-modern'>
          <thead>
            <tr>
              <th className='px-6 py-4'>Date</th>
              <th className='px-6 py-4'>Check In</th>
              <th className='px-6 py-4'>Check Out</th>
              <th className='px-6 py-4'>Working Hours</th>
              <th className='px-6 py-4'>Day type</th>
              <th className='px-6 py-4'>Status</th>
              
            </tr>
          </thead>

          <tbody>
            {history.length === 0 ? (
              <tr><td colSpan={6} className='text-center py-12 text-slate-400'>No record founds</td></tr>
            ) : (
              history.map((item) => {
                const dateType = getDayTypeDisplay(item);
                return(

                  <tr key={item._id || item.id}>
                  <td className='px-6 py-4 font-medium text-slate-900'>{format(new Date(item.date),'MMM dd, yyyy')}</td>
                  <td className='px-6 py-4  text-slate-900'>{item.checkIn ? format(new Date(item.checkIn), "hh:mm a") : '-'}</td>
                  <td className='px-6 py-4  text-slate-900'>{item.checkOut  ? format(new Date(item.checkOut), "hh:mm a") : '-'}</td>
                  <td className='px-6 py-4 font-medium text-slate-900'>{getWorkingHoursDisplay(item)}</td>
                  <td className='px-6 py-4 font-medium'>{dateType !== '-' ? <span className={`badge ${dateType.className}`}>{dateType.label}</span> : '-' }</td>
                  <td className='px-6 py-4 font-medium'><span className={`badge ${item.status === 'PRESENT' ? 'badge-success' : `${item.status === 'LATE' ? 'badge-warning' : 'badge-danger'}`}`}>{item.status}</span></td>
                </tr>
                )
})
            )}
          </tbody>
        </table>
    </div>

    </div>
  )
}

export default AttendanceHistory