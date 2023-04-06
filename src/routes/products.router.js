//Imports
import { Router } from "express";
import fs from "fs"

//Create router
const router = Router();

//Get all products.
router.get("/",async(req,res)=>{
    const products = JSON.parse(await fs.promises.readFile('./src/files/products.json','utf-8'))
    const limit = req.query.limit

    if (!limit) return res.send({
        status: 'Ok',
        products
    })

    const productsLimited = products.slice(0,parseInt(limit))

    res.send({
        status: 'Ok',
        productsLimited
    })
})

//Get product by ID.
router.get('/:pid', async (req, res) => {
    let pid = req.params.pid
    let products = await fs.promises.readFile('./src/files/products.json','utf-8')
    let product = products.find(product => product.id === parseInt(pid))
    if (!product) return res.status.send(404)
    res.send({ product })
})

export default router;

