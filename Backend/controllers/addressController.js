import Address from "../models/database models/AddressModel.js"
import User from "../models/database models/UserModel.js"
import { genericServerErr } from "../utlis/genericServerErr.js"

export const getAddressController = async (req, res) => {
    try {
        const userId = req.id     // Get it from auth middleware

        // fetch address count of addresses from db
        const [addresses, count] = await Promise.all([Address.find({ userId }).sort({ createdAt: -1 }), Address.find({ userId }).countDocuments()])

        return res.status(200).json({
            success: true,
            message: "User address(s) fetched successfully",
            data: { addresses, count }
        })

    } catch (error) {
        return genericServerErr(res, error)
    }
}

export const addAddressController = async (req, res) => {
    try {
        const userId = req.id
        const { addressLine, city, state, pincode, country, mobile } = req.body

        // Validation if any of the above values is/are empty
        const obj = { addressLine, city, state, pincode, country }
        for (let key in obj) {
            const val = obj[key]?.trim();

            if (!val) {
                return res.status(400).json({
                    success: false,
                    error: `${key} is empty!`,
                    message: `${key} cannot be empty!`
                });
            };
        };
        // Check if this address is the first address user added
        const count = await Address.find({ userId }).countDocuments()
        let isDefault = false
        if (count === 0) {
            isDefault = true
        }

        // Save address to address collection and User addressDetails
        const payload = { userId, addressLine, city, state, pincode, country, mobile, isDefault }
        const saved = await Address(payload).save()

        await User.updateOne({ _id: userId }, { $addToSet: { addressDetails: saved } })

        return res.status(201).json({
            success: true,
            message: 'Address added successfully',
            data: saved
        })

    } catch (error) {
        return genericServerErr(res, error)
    }
}

// Currently only updating 'default' status of the address
export const updateAddressController = async (req, res) => {
    try {
        const userId = req.id;
        const { isDefault = false, id } = req.body;     // address id

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Address id empty!",
                message: "Address id is required"
            })
        };

        // Prevent getting default address updated if 
        // user is trying to update same default address 
        const isDefaultAddress = await Address.findOne({ _id: id, isDefault: true })
        if(isDefaultAddress) {
            return res.status(400).json({
                success: false,
                error: "Direct updation of default address prohibited",
                message: "Cannot update default address directly."
            })
        }

        // Update address default status
        const updatedAddress = await Address.findOneAndUpdate({ userId, _id: id, isDefault: { $ne: true } },
            { isDefault: true },
            { new: true }).sort({ createdAt: -1 });

        if (!updatedAddress) {
            return res.status(400).json({
                success: false,
                error: "Address not found",
                message: "Address not found"
            })
        };
        // Update other addresses' "isDefault" status
        const result = await Address.updateMany({ userId, _id: { $ne: id } }, { isDefault: false })

        return res.status(200).json({
            success: true,
            message: "Default address updated successfully.",
            data: updatedAddress
        })

    } catch (error) {
        return genericServerErr(res, error);
    }
}

export const deleteAddressController = async (req, res) => {
    try {
        const userId = req.id;
        const { id, force = false } = req.body;   // address id

        // Validation
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "No address id received!",
                message: "No address id received to delete!"
            })
        };

        const allAddresses = await Address.find({ userId }).lean();    // get all user addresses

        // Do not delete only address left
        const addressCount = allAddresses?.length;
        if (addressCount == 1 && !force) {
            return res.status(400).json({
                success: false,
                error: "Cannot delete all the addresses. Only 1 address found",
                message: "Cannot delete all the addresses. Only 1 address found"
            })
        };

        // Do not delete default address
        const defaultAddress = allAddresses.filter((adr) => adr?.isDefault)[0]
        if ((defaultAddress._id.toString() === id) && !force) {
            return res.status(400).json({
                success: false,
                error: "Default address cannot be deleted",
                message: "Default address cannot be deleted. Please choose other default address first."
            })
        };

        // Delete address from address collection as well as user collection
        const deleteResult = await Address.deleteOne({ userId, _id: id });
        await User.updateOne({ _id: userId }, { $pull: { addressDetails: id } })

        if (deleteResult.deletedCount == 0) {
            return res.status(404).json({
                success: false,
                error: "Address not found in database",
                message: "Address not found. Nothing to delete!"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Address deleted successfully."
        });

    } catch (error) {
        return genericServerErr(res, error)
    }
}