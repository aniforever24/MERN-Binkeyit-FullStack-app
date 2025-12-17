import React, { useEffect } from 'react'
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

const OrderCancelled = () => {
  const location = useLocation()

  useEffect(()=> {
    console.log('order cancel reason error-->', location?.state?.error)
  }, [])

  return (
        <div className="max-w-lg mx-auto bg-red-100 rounded-lg sm:p-6 p-4 my-4 pb-2 space-y-3">
            <h2 className="w-full bg-red-200 text-red-700 font-semibold text-lg sm:text-2xl px-4 py-3 text-center capitalize">
                Order Cancelled!
            </h2>

            <Link to="/" className="text-red-600 font-medium text-center bg-red-50 hover:bg-red-300 hover:text-black cursor-pointer px-3 py-1 upper sm:text-lg text-base block w-fit mx-auto rounded-lg">
                Go Back
            </Link>
        </div>
    );
}

export default OrderCancelled