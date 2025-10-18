import React, { useEffect, useState } from "react";

const useMobile = (width = 768) => {
    const [value, setValue] = useState(null)

    const eventHandler = (e) => {
        if (window.innerWidth > width) setValue(false)
        else setValue(true)
    }
    window.addEventListener('resize', eventHandler)

    // if width is a function then call it and save it
    if (width instanceof Function) width = width();

    useEffect(() => {
        if (window.innerWidth > width) setValue(false)
        else setValue(true)
        
        // window eventlistener cleanup on component mount/unmount
        return window.removeEventListener('resize', eventHandler);
    }, [])

    return [value]
}

export default useMobile
