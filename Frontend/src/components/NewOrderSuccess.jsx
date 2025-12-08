import React from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router'

const NewOrderSuccess = () => {
    const location = useLocation()

    useEffect(()=> {
        console.log('location from NewOrderSuccess:->', location.state)
    }, [])
  return (
    <div>
      New order created successfully!
    </div>
  )
}

export default NewOrderSuccess
