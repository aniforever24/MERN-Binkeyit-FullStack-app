import React from 'react'
import { GoDotFill } from "react-icons/go";

const MyOrders = () => {
  return (
    <section className='border-l border-neutral-300  min-h-[79vh] relative'>
      <div className="_header shadow-lg border-r-0 flex justify-between items-center w-full px-4 py-2.5 select-none sticky top-25 bg-white z-10">
        <h2 className="_heading font-semibold sm:text-lg mr-1">
            My Orders
        </h2>
      </div>

      <div className="_ordersContainer grid gap-4 m-2">

          {/* In progress order */}          
          <div className="_order px-4 py-6 border-2 border-gray-100 rounded-2xl flex flex-col justify-center gap-3">

            <div className='flex items-center gap-2 text-xs'>
                <div className='flex justify-center items-center gap-0.5 p-1 px-1.5 bg-orange-100 border border-orange-50 rounded-xl'>
                    <GoDotFill size="13" color='oklch(55.3% 0.195 38.402)'/>
                    <span className='text-orange-700 font-medium'>In progress</span>
                </div>
                <div className='w-0.5 h-3 bg-neutral-500'></div>
                <p>10 May 2021</p>
            </div>
            
            <div className='flex items-center gap-3'>
              <div className="_image w-18 h-18 border overflow-hidden relative">
                <img className='object-fill w-full h-full' src="https://fastly.picsum.photos/id/110/400/600.jpg?hmac=sPFdWWg5TnfXSGVxmu60PXFTO3fBGJt_gOhGxis4vb0" alt="random-image.jpg" />
                <span className='text-white absolute bottom-0 right-1 z-10 text-sm font-semibold text-shadow-xs text-shadow-black'>+ 4</span>
              </div>

              <div className='flex flex-col justify-between h-18 overflow-hidden'>
                  <p className='text-xs font-bold text-orange-900'>OrderID: 123456789</p>

                  <div className='flex justify-between items-center'>
                  <p className='overflow-hidden text-ellipsis line-clamp-1 flex-1'>Blue Jeans Men | Adult | size 44 | flexible, strechable, Blue Jeans Men | Adult | size 44 | flexible, strechable,Blue Jeans Men | Adult | size 44 | flexible, strechable</p>
                  <p className='overflow-hidden line-clamp-1 text-ellipsis text-orange-800'>& 200 more items</p>
                  </div>

                  <p className='text-sm font-bold'>Rs 1000</p>
              </div>
            </div>
          </div>

          {/* Delivered order */}
          <div className="_order px-4 py-6 border-2 border-gray-100 rounded-2xl flex flex-col justify-center gap-3">

            <div className='flex items-center gap-2 text-xs'>
                <div className='flex justify-center items-center gap-0.5  p-1 px-1.5 bg-green-100 border border-green-50 rounded-xl'>
                    <GoDotFill size="13" color='oklch(52.7% 0.154 150.069)'/>
                    <span className='text-green-700 font-medium'>Delivered</span>
                </div>
                <div className='w-0.5 h-3 bg-neutral-500'></div>
                <p>10 May 2021</p>
            </div>
            
            <div className='flex items-center gap-3'>
              <div className="_image w-18 h-18 border overflow-hidden relative">
                <img className='object-fill w-full h-full' src="https://fastly.picsum.photos/id/110/400/600.jpg?hmac=sPFdWWg5TnfXSGVxmu60PXFTO3fBGJt_gOhGxis4vb0" alt="random-image.jpg" />
                <span className='text-white absolute bottom-0 right-1 z-10 text-sm font-semibold text-shadow-xs text-shadow-black'>+ 4</span>
              </div>
              <div className='flex flex-col justify-between h-18 overflow-hidden'>
                  <p className='text-xs font-bold text-orange-900'>OrderID: 123456789</p>

                  <div className='flex justify-between items-center'>
                  <p className='overflow-hidden text-ellipsis line-clamp-1 flex-1'>Blue Jeans Men | Adult | size 44 | flexible, strechable, Blue Jeans Men | Adult | size 44 | flexible, strechable,Blue Jeans Men | Adult | size 44 | flexible, strechable</p>
                  <p className='overflow-hidden line-clamp-1 text-ellipsis text-orange-800'>& 200 more items</p>
                  </div>

                  <p className='text-sm font-bold'>Rs 1000</p>
              </div>
            </div>
          </div>

      </div>
    </section>
  )
}

export default MyOrders
