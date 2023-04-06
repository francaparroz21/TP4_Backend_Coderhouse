//Imports
import { Router } from "express";
import fs from "fs"

//Create router
const router = Router();

//Get all products.
router.get("/", async (req, res) => {
    const products = JSON.parse(await fs.promises.readFile('./src/files/products.json', 'utf-8'))
    const limit = req.query.limit

    if (!limit) return res.status(200).send({ products })
    else if (limit >= 0 && limit <= products.length) {
        const productsLimited = products.slice(0, parseInt(limit))
        return res.send({ productsLimited })
    }

    res.status(400).send({
        error: `Bad request, limit '${limit}' incorrect.`
    })
})

//Get product by ID.
router.get('/:pid', async (req, res) => {
    let pid = req.params.pid
    let products = JSON.parse(await fs.promises.readFile('./src/files/products.json', 'utf-8'))
    let product = products.find(product => product.id === parseInt(pid))
    if (!product) return res.status.send(404)
    res.send({ product })
})

//Post product.
router.post('/', async (req, res) => {
    let products = JSON.parse(await fs.promises.readFile('./src/files/products.json', 'utf-8'))
    let product = req.body
    let idProduct = products.length + 1
    let newProducts = [...products, { id: idProduct, thumbnails: [...product.thumbnails], status: true, ...product }]

    if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
        return res.status(400).send({
            error: 'Required fields: \n -title\n -description \n -code \n -price \n -stock \n -category'
        })
    }

    await fs.promises.writeFile('./src/files/products.json', JSON.stringify(newProducts, null, '\t'))

    res.send({
        status: 'Ok',
        newProducts
    })
})


//Put any product.
router.put('/:pid', async (req, res) => {
    let idParams = req.params.pid
    let updates = req.body
    let products = JSON.parse(await fs.promises.readFile('./src/files/products.json', 'utf-8'))
    let product = products.find(product => product.id === parseInt(idParams))

    if (!updates.title && !updates.description && !updates.code && !updates.price && !updates.stock && !updates.category) {
        return res.status(400).send({
            error: 'Required some of these fields: \n -title\n -description \n -code \n -price \n -stock \n -category'
        })
    }

    let updateProduct = { ...product, ...updates }
    products.splice(products.indexOf(product), 1, updateProduct)

    res.send({
        updateProduct
    })
})

//Delete product by ID.
router.delete('/:pid', async (req, res) => {
    let idParams = req.params.pid
    let products = JSON.parse(await fs.promises.readFile('./src/files/products.json', 'utf-8'))
    let product = products.find(product => product.id === parseInt(idParams))

    if(!product)res.status(421).send({
        error: `Misdirect ${idParams} params.`
    })

    products.splice(product,1)
    await fs.promises.writeFile('./src/files/products.json', JSON.stringify(products, null, '\t'))

    res.send({
        products
    })
})


export default router;

