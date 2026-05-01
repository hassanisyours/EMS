import { format } from 'date-fns'
import React from 'react'
import { Download } from 'lucide-react'

const PayslipList = ({ payslips, isAdmin }) => {
  return (

    <div className='card overflow-hidden'>

      <div className='overflow-auto'>
        <table className='table-modern'>
          <thead>
            <tr>
              {isAdmin && <th className=''>Employee</th>}
              <th>Period</th>
              <th>Basic Salary</th>
              <th>Net Salary</th>
            <th className='text-center'>Action</th>

            </tr>
          </thead>

          <tbody>
            {payslips.length === 0 ? (
              <tr><td colSpan={isAdmin ? 5 : 4} className='text-center py-12 text-slate-400'>No Payslips found</td></tr>
            ) : (
              payslips.map((item) => {
                return (
                  <tr key={item._id || item.id}>
                    {isAdmin && (
                      <td className='text-slate-900'>{item.employee?.firstName} {item.employee?.lastName}</td>
                    )}
                    <td className='text-slate-500'>{format(new Date(item.year - item.month - 1), 'MMMM yyyy')}</td>
                    <td className='text-slate-500'>${item.basicSalary?.toLocaleString()}</td>
                    <td className='text-slate-800 font-medium'>${item.netSalary?.toLocaleString()}</td>
                    <td className='text-center'>
                      <button onClick={() => window.open(`/print/payslips/${item._id || item.id}`, '_blank')} className='inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-blue-600 bg-blue-50 hover:bg-blue-100 ring-1 ring-blue-600/10'><Download className='w-3 h-3 mr-1.5' />Download</button>
                    </td>



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

export default PayslipList