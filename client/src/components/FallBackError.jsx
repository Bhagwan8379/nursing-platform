import React from 'react'

const FallBackError = ({ error, resetErrorBoundary }) => {
    console.warn(error)

    return <>
        <div className="container mt-5 max-w-xl mx-auto px-4 py-8 bg-white rounded-2xl shadow-xl border border-slate-100 mt-20 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className='fw-bold fs-6 text-slate-800 font-sans space-y-4'>
                <h2 className="text-2xl font-bold text-slate-900 font-heading">Oops !  Something Wrong Please Check</h2>
                <p className="text-sm text-slate-500 font-mono bg-slate-50 p-4 rounded-xl border border-slate-100 break-all">{error.message}.</p>
                <button 
                    className='btn btn-sm btn-danger px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 cursor-pointer' 
                    type='button' 
                    onClick={resetErrorBoundary}
                >
                    Try again
                </button>
            </div >
        </div>
    </>
}

export default FallBackError
