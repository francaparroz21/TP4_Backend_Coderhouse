//Imports
import { Router } from "express";
import fs from "fs"
import { uploaderThumbnails } from "../utils.js";

//Create router
const router = Router();

//Get all products.
router.get("/", async (req, res) => {
    const products = JSON.parse(await fs.promises.readFile('./src/files/products.json', 'utf-8'))
    const limit = req.query.limit

    if (!limit) return res.send({
        status: 'OK.',
        products
    })
    else if (limit >= 0 && limit <= products.length) {
        const productLimited = products.slice(0, limit)
        return res.send({
            status: 'OK.',
            productLimited
        })
    }

    res.status(400).send({
        status: "Bad request.",
        error: `Bad request, limit '${limit}' incorrect.`
    })
})

//Get product by ID.
router.get('/:pid', async (req, res) => {
    let pid = req.params.pid
    let products = JSON.parse(await fs.promises.readFile('./src/files/products.json', 'utf-8'))
    let product = products.find(product => product.id === parseInt(pid))
    if (!product) return res.status(404).send({
        status: 'Not found.',
        error: `Product ID ${pid} incorrect. Out of bounds.`
    })

    res.send({
        status: "OK.",
        product
    })
})

//Post product.
router.post('/', uploaderThumbnails.array('thumbnails'), async (req, res) => {
    let products = JSON.parse(await fs.promises.readFile('./src/files/products.json', 'utf-8'))
    let product = req.body
    let idProduct = products[products.length - 1].id + 1


    if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
        return res.status(400).send({
            status: 'Bad request.',
            error: 'Required fields: -title, -description, -code, -price, -stock, -category'
        })
    }

    let productRepeated = products.find(p => p.code === product.code)

    if (productRepeated) return res.status(400).send({
        status: "Bad request.",
        error: `Code product '${product.code}' already created.`
    })


    req.files.thumbnails = []
    for (let index = 0; index < req.files.length; index++) {
        req.files.thumbnails.push("http://localhost:8080/images/"+ req.files[index].filename)
    }


    products.push({ id: idProduct, thumbnails: [...req.files.thumbnails], status: true, ...product })

    await fs.promises.writeFile('./src/files/products.json', JSON.stringify(products, null, '\t'))

    res.send({
        status: 'OK.',
        product: { id: idProduct, thumbnails: [...req.files.thumbnails], status: true, ...product }
    })
})


//Put any product.
router.put('/:pid', async (req, res) => {
    let idParams = req.params.pid
    let updates = req.body
    let products = JSON.parse(await fs.promises.readFile('./src/files/products.json', 'utf-8'))
    let product = products.find(product => product.id === parseInt(idParams))

    if (!product) return res.status(404).send({
        status: 'Not found.',
        error: `Product ID ${idParams} not found.`
    })

    if (!updates.title && !updates.description && !updates.code && !updates.price && !updates.stock && !updates.category) {
        return res.status(400).send({
            status: 'Bad request.',
            error: 'Required some of these fields: -title, -description, -code, -price, -stock, -category.'
        })
    }

    products.splice(products.indexOf(product), 1, { ...product, ...updates })
    await fs.promises.writeFile('./src/files/products.json', JSON.stringify(products, null, "\t"))
    res.send({
        status: "OK.",
        product: { ...product, ...updates }
    })
})

//Delete product by ID.
router.delete('/:pid', async (req, res) => {
    let idParams = req.params.pid
    let products = JSON.parse(await fs.promises.readFile('./src/files/products.json', 'utf-8'))
    let product = products.find(product => product.id === parseInt(idParams))

    if (!product) return res.status(404).send({
        status: 'Not found.',
        error: `Product ID ${idParams} not found.`
    })


    products.splice(products.indexOf(product), 1)

    await fs.promises.writeFile('./src/files/products.json', JSON.stringify(products, null, '\t'))

    res.send({
        status: "OK.",
        productDeleted: product
    })
})


export default router;

