//Imports.
import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

//Create express app and their ports.
const app = express();
const PORT = 8080;

//Listen '8080' ports.
app.listen(PORT, ()=>{
    console.log(`Server started on ${PORT} ports.`)
})

//static(public directory), urlencoded & json.
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Routes 'products' & 'carts'.
app.use('/api/products',productsRouter)
app.use('/api/carts', cartsRouter)