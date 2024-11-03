const express = require('express')
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongoConnect = require('./db/connect');
mongoConnect();

const router = require('./Router/userRouter')
const authRouter = require('../server/Router/authRouter')
const productRouter = require('./Router/productRouter')


app.use(express.json({limit : "500mb"}));
app.use(express.urlencoded({extended : true}));
app.use(express.static('../client'));
app.use(router)
app.use(authRouter)
app.use(productRouter)


app.listen(process.env.PORT,()=>{
    console.log(`server is running at http://localhost:${process.env.PORT}`);

})