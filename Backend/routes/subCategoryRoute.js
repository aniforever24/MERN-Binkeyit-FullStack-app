// This subcategory router is not authenticated (any user can access it)

import express from 'express'
import getSubCategoriesController from '../controllers/getSubCategoriesController.js';

const router = express.Router();

router.get('/testing', (req, res) => {
    res.send('This unauthenticated subcategory route is working 🙂👍')
})
router.post('/get', getSubCategoriesController)

export default router