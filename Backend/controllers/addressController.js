import Address from "../models/database models/AddressModel.js"
import { genericServerErr } from "../utlis/genericServerErr.js"

export const getAddressController = async (req, res) => {
    try {
        const userId = req.id

        // fetch address count of addresses from db
        const [addresses, count] = await Promise.all([Address.find({ userId }), Address.find({ userId }).countDocuments()])

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

        const payload = { userId, addressLine, city, state, pincode, country, mobile }
        const saved = await Address(payload).save()

        return res.status(201).json({
            success: true,
            message: 'Address added successfully',
            data: saved
        })

    } catch (error) {
        return genericServerErr(res, error)
    }
}

export const deleteAddressController = async (req, res) => {
    try {
        const userId = req.id
        const { id } = req.body   // address id

        // Validation
        if(!id) {
            res.status(400).json({
                success: false,
                error: "No address id received!",
                message: "No address id received to delete!"
            })
        }

        const deleteResult = await Address.deleteOne({ userId, _id: id });

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
        })



    } catch (error) {
        return genericServerErr(res, error)
    }
}