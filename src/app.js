import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { __dirname } from "./utils.js";

const app = express();
const PORT = 8080;

//Listen 8080 ports.
app.listen(PORT, ()=>{
    console.log(`Server started on ${PORT} ports.`)
})

//URLENCODED Y JSON.
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'))


app.use('/api/products',productsRouter)
app.use('/api/carts', cartsRouter)