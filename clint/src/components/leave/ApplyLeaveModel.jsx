import { CalendarDaysIcon, FileText, Loader2, LoaderIcon, Send, X } from 'lucide-react';
import React, { useState } from 'react'


const ApplyLeaveModel = ({open, onClose, onSuccess}) => {

    const [loading, setLoading] = useState(false)

    const today = new Date()
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1)
    const minDate = tomorrow.toISOString().split('T')[0];

    const handleSubmit = async (e) => {
            e.preventDefault()
    }

    if (!open) {
        return null
    }



  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm' onClick={onClose}>
        <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in' onClick={(e) => e.stopPropagation()}>
        {/* header  */}
        <div className='flex items-center justify-between p-6 pb-0'>

        <div>
            <h2 className='text-lg font-semibold text-slate-800'>Apply for leave</h2>
            <p className='text-sm text-slate-400 mt-0.5'>Submit your leave request for approval</p>
        </div>
        <button onClick={onClose} className='p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600'><X/></button>
        </div>
            {/* form  */}
        <form  onSubmit={handleSubmit} className='p-6 space-y-5'>
            {/* leave type  */}
            <div>
                <label className='flex items-center gap-2 text-sm font-medium text-slate-700 mb-2'><FileText className='w-4 h-4 text-slate-400'/> Leave Type</label>
                <select name="type" required>
                    <option value="">Select leave type</option>
                    <option value="SICK">Sick Leave</option>
                    <option value="CASUAL">Casual Leave</option>
                    <option value="ANNUAL">Annual Leave</option>
                </select>
            </div>
            {/* duration  */}

            <div>
                <label className='flex items-center gap-2 text-sm font-medium text-slate-700 mb-2'><CalendarDaysIcon className='w-4 h-4 text-slate-400'/> Duration</label>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <span className='block text-xs text-slate-400 mb-1'>From</span>
                        <input type="date" name='date' required min={minDate} />
                    </div>
                    
                    <div>
                        <span className='block text-xs text-slate-400 mb-1'>To</span>
                        <input type="date" name='endDate' required min={minDate} />
                    </div>
                    
                </div>
                
            </div>

            {/* reason */}  
                <label className='mb-2 block text-sm font-medium text-slate-700 '>Reason</label>
                <textarea name="reason" required rows={3} className='resize-none' placeholder='Brifiely describe why you need this leave...'></textarea>

            {/* buttons  */}
            <div className='flex gap-3 pt-2'> 

            <button type='button' disabled={loading} className='btn-secondary flex-1' onClick={onClose}>
                Cancel
            </button>
            <button type='submit' className='btn-primary flex-1 flex items-center justify-center gap-2' disabled={loading}>
                    {loading ? <Loader2 className='w-4 h-4 animate-spin'/> : <Send className='w-4 h-4'/>}
                    {loading ? 'Submitting...' : 'Submit Request'}
                
            </button>
            </div>



        </form>


        </div>

    </div>
  )
}

export default ApplyLeaveModel