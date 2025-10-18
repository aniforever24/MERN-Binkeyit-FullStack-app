
const dbContError = (req, res, next, param) => {
    if (param) {
        return res.status(503).json({ success: false, message: "Database connection error! Please retry.", error: param?.message })
    }
    next();
}

function dbConnectionError(param) {
    return (req, res, next) => {
        dbContError(req, res, next, param)
    }
}

export default dbConnectionError;