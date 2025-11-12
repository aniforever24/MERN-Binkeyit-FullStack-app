import Address from "../models/database models/AddressModel.js"
import { genericServerErr } from "../utlis/genericServerErr.js"

export const getAddressController = async (req, res) => {
    try {
        const userId = req.id

        // fetch address count of addresses from db
        const [addresses, count] = await Promise.all([Address.find({ userId }), Address.find({ userId }).countDocuments()])

        res.status(200).json({
            success: true,
            message: "User address(s) fetched successfully",
            data: { addresses, count }
        })

    } catch (error) {
        return genericServerErr(res, error)
    }
}