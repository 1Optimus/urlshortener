import express from 'express'
import { irToUrl, postNewUrl } from '../controllers/BlogController.js'
const router = express.Router()
//Redirect
router.get('/go/:id', irToUrl)
//convertir
router.post('/generate', postNewUrl)

export default router
