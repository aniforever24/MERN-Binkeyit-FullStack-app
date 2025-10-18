import { Router } from "express";
import getProductsController from "../controllers/getProductsController.js";
const router = Router();

router.get('/testing', (req, res)=> {
    res.send('productsRouter route is working ✔')
})
router.post('/get', getProductsController)

export default router;