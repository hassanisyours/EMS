import { format } from 'date-fns'
import { Check, Loader2, X } from 'lucide-react'
import React, { useState } from 'react'

const LeaveHistory = ({leaves, isAdmin, onUpdate}) => {

  const [processing, setProcessing] = useState(null)

  const handleStatusUpadate = (id, status) => {
    setProcessing(id)
}
     return (

    <div className='card overflow-hidden'>
      
    <div className='overflow-auto'>
        <table className='table-modern'>
          <thead>
            <tr>
                {isAdmin && <th className=''>Employee</th>}
                <th>Type</th>
                <th>Dates</th>
                <th>Reason</th>
                <th>Status</th>
                {isAdmin && <th className='text-center'>Action</th>}

            </tr>
          </thead>

          <tbody>
            {leaves.length === 0 ? (
              <tr><td colSpan={isAdmin ? 6 : 4} className='text-center py-12 text-slate-400'>No Leaves application found</td></tr>
            ) : (
              leaves.map((item) => {
                return(
                  <tr key={item._id || item.id}>
                    {isAdmin && (
                        <td className='text-slate-900'>{item.employee?.firstName} {item.employee?.lastName}</td>
                    )}
                    <td><span className='badge bg-slate-100 text-slate-600'>{item.type}</span></td>
                  <td className='text-xs  text-slate-500'>{format(new Date(item.startDate), "MMM dd")} - {format(new Date(item.endDate), "MMM dd, yyyy")}</td>
                    <td className='max-w-xs truncate text-slate-500' title={item.reason}>{item.reason}</td>
                    <td><span className={`badge ${item.status === 'APPROVED' ? 'badge-success' : item.status === 'REJECTED' ? 'badge-danger' : 'badge-warning' }`}>{item.status}</span></td>

                    {isAdmin && (
                      <td>{item.status === 'PENDING' && (
                        <div className='flex justify-center gap-2'>
                          <button disabled={!!processing} onClick={()=>handleStatusUpadate(item.id || item._id,'APPROVED')} className='p-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors'>{processing === item.id ? (console.log(item.id ,processing), <Loader2 className='w-4 h-4 animate-spin'/>) : <Check className='w-4 h-4'/> }</button>
                          <button disabled={!!processing} onClick={()=>handleStatusUpadate(item.id || item._id,'REJECTED')} className='p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors'>{processing === item.id ? <Loader2 className='w-4 h-4 animate-spin'/> : <X className='w-4 h-4'/> }</button>
                        </div>
                      )}</td>

                    )}

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

export default LeaveHistory