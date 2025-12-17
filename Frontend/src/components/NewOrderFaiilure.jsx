import React, { useEffect } from 'react'
import { useLocation } from 'react-router';

const NewOrderFailure = () => {
  const location = useLocation()

  useEffect(()=> {
    console.log('order failure error-->', location?.state?.error)
  }, [])

  return (
		<div className="max-w-lg mx-auto bg-red-100 rounded-lg sm:p-6 p-4 my-4 pb-2 space-y-3">
			<h2 className="w-full bg-red-200 text-red-700 font-semibold text-lg sm:text-2xl px-4 py-3 text-center capitalize">
				Failed to create New Order!
			</h2>

			<p className="text-red-600 text-center bg-gray-100 p-2 upper sm:text-lg text-base">
				Unknown reason! Please try again.
			</p>
		</div>
	);
}

export default NewOrderFailure