
// function to provide a generic server error to the user
export const genericServerErr = (res, error) => {
    return res.status(500).json({
        success: false,
        error: error?.message,
        message: "Inernal Server Error!"
    })
}