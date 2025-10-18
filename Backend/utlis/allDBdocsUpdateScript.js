import User from "../models/database models/UserModel.js";

export const updateDocs = async (fieldname, value) => {
    try {
        const update = await User.updateMany(
            { [`${fieldname}`]: { $exists: false } },    // checks if the fieldname doesn't exist
            {$set: { [`${fieldname}`]: value}}  // add a default value to the fieldname
        );
        return update;
    } catch (error) {
        console.log(error);
    }
}