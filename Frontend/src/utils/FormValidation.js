
const Validation = {
    name: (value)=> {
        if(!value) return "Name is required!";
        if(value.length <= 2) return "Name is too short!";
        return null;
    },
    email: (value)=> {
        if(!value) return "Email is required."
        if(! (/^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))) return "Invalid email."
        return null;
    },
    password: (value) => {
        if(!value) return "Password is required";
        if(value.length < 6) return "Password length must be 6 or more.";
        return null;
    },
    confPassword: (value, formData)=> {
        if(!value) return "Confirm Password is required";
        if(value !== formData.password) return "Confirm Password does not match Password!";
        return null;
    }
}

export default Validation;