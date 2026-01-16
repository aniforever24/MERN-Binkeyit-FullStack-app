import { useEffect } from 'react'

// Capitalise first letter of any string 
export const capitalizeFirstLetter = (str) => {
    let newName = str.trimStart();
    let n = newName.toUpperCase();
    newName = newName.replace(newName[0], n[0])
    return newName;
}

// Sort data on the basis of name if data has name property
export const sortDataByName = (data, order) => {
    const allowedValues = [1, -1];
    if (!Array.isArray(data)) {
        throw Error('Input data must be an array! ')
    }
    if (!allowedValues.includes(order)) {
        throw Error('Supplied order must be equal to 1 (increasing) or -1 (decreasing)')
    }
    const d = [...data];
    d.sort((a, b) => {
        a = a?.name.toLowerCase()
        b = b?.name.toLowerCase()
        return (a > b) ? Number(order) : Number(`-${order}`);
    })
    return d;
}

// Recalculate page number when user selects new limit
export const recalculatePage = (currentPage, currentLimit, newLimit) => {
    // Calculate no. of elements skipped till elements in view
    const currentOffset = (currentPage - 1) * currentLimit;
    const newPage = Math.floor(currentOffset / newLimit) + 1;
    return newPage;
}

// Shuffle an Array and returns it, immutable
export const shuffleArray = (arr) => {
    if (!Array.isArray(arr)) {
        throw Error('Argument must be an array. Received non-array.');
    }
    let a = [...arr];
    let final = [];
    let currentIndex = a.length;
    while (currentIndex !== 0) {
        const r = Math.floor(Math.random() * currentIndex)
        final.push(a[r])
        a.splice(r, 1)
        currentIndex--;
    }
    return final;
}

// Alphanumeric string code of n characters, return it (uses above function)
export const alphnumericKey = (n = 8) => {
    if (n < 3) {
        throw Error('Argument must be >= 3')
    }
    let randKeyArray = [];
    const lowercase = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
    const uppercase = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
    const nums = Array.from({ length: 10 }, (_, i) => i)
    const shuffleCombined = shuffleArray([...lowercase, ...uppercase, ...nums])

    for (let i = 0; i < n; i++) {
        let r = Math.floor(Math.random() * shuffleCombined.length)
        if (i === 0) {
            r = Math.floor(Math.random() * lowercase.length)
            randKeyArray.push(lowercase[r])
        } else if (i === 1) {
            r = Math.floor(Math.random() * uppercase.length)
            randKeyArray.push(uppercase[r])
        } else if (i === 2) {
            r = Math.floor(Math.random() * nums.length)
            randKeyArray.push(nums[r])
        } else {
            randKeyArray.push(shuffleCombined[r])
        }
    }

    const randString = shuffleArray(randKeyArray).join(',').replaceAll(',', "")
    return randString;
}

// Escape special characters from user input text
export function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// Set custom title of page
export const setPageTitle = (title) => {
    return useEffect(() => {
        document.title = title;
        return () => {
            document.title = "Binkeyit!"
        }
    }, [])
}

// Format price to proper locale INR mode (space is after rupee symbol)
export const formatCurrency = (price, space = false) => {
    if (!price) return
    if (typeof price !== 'number') {
        throw new Error("Argument must be a number!");
    }
    const inr = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(price)
    let inrWithSpace;
    if (space) {
        inrWithSpace = inr[0] + " " + inr.slice(1, inr.length)
    }
    return inrWithSpace || inr
}

// Function to test if param passed is a react event object
export const isReactEvent = (obj) => {
    return typeof obj === "object" && "nativeEvent" in obj && "isDefaultPrevented" in obj;
}

// Check if given data is pure object {} or not
export const isPlainObject = (v, { nullAllowed = false }) => {
    let condition1 = v !== null;
    if (nullAllowed) condition1 = true;

    return (
        condition1 &&
        typeof v === "object" &&
        Object.getPrototypeOf(v) === Object.prototype
    )
}

// Calculate discounted price
export const calculateDiscountedPrice = (price, dis) => {
    if (!dis) dis = 0;
    if (!price) return;
    price = Number(price);
    const d = dis / 100; // discount%
    const discountedPrice = price - price * d;
    return Number(discountedPrice.toFixed(2));
};

// Debounce function to delay (ms) api call (or any function)
export const debounce = (api, delay) => {
    if (!(typeof api === 'function')) {
        throw Error("1st parameter must be a function!")
    }
    let timer;

    return function (...args) {      // ...arg used rest operator to store passed arguments into [arguments]
        clearTimeout(timer);        // clear any previous call if any
        timer = setTimeout(() => {
            api.apply(this, args)   // apply will call api with unpacked args (array)
        }, delay)
    }
}

// Convert ISO date to locale date string
export const getLocaleDate = (dt = new Date(), { sep = "/", ...options } = {}) => {
    const dtObject = new Date(dt)

    if (!Object.keys(options).length) {
        return dtObject.toLocaleDateString('in').replaceAll("/", sep)
    }
    return dtObject.toLocaleDateString('in', options)
}

// Return boolean if a data array has duplicates (data array must be an array of objects with _id key)
export const hasDuplicates = (data)=> {
    let seen = {};
    
    for (const obj of data) {
        if(seen[obj._id]) {
            return true
        }
        seen[obj._id] = true;
    }
    
    return false;
}