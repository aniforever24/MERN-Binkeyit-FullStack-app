import React from 'react'
import AnimatingDots from './AnimatingDots'

const Loading = ({int, position}) => {
    let newPosition;
    if(position) {
        newPosition = `${position} text-lg`
    }
  return (
    <div className={`top-[40%] left-[50%] font-medium z-50 font-stretch-50% text-black ${position ? newPosition : "fixed text-2xl"}`}>
      <AnimatingDots text={'Loading'} int={int ? int : 100}/>
    </div>
  )
}

export default Loading
