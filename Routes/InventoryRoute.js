import express from 'express'
import { getInventory } from '../Controllers/InventoryController.js'

const router = express.Route()

router.get("/inventory", getInventory)

export default router