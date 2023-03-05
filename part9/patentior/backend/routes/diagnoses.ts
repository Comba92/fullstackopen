import express from 'express'
import service from '../services/diagnoses'
const router = express.Router()

router.get('/', (_req, res) => {
  res.send(service.get())
})

export default router