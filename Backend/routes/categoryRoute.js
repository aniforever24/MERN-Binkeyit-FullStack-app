import express from "express";
import getCategoriesController from "../controllers/getCategoriesController.js";

const router = express.Router()

router.get('/', (req, res)=> {
    res.send("This api categoryRoute is working 100% 👍")
})

router.post('/get-categories', getCategoriesController)

export default router