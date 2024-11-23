const express = require('express')
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongoConnect = require('./db/connect');
mongoConnect();
const path = require('path')
const fs = require('fs')
const cors = require('cors')

const router = require('./Router/userRouter')
const authRouter = require('../server/Router/authRouter')
const productRouter = require('./Router/sellerRouter')

app.use(cors());
app.use(express.json({limit : "500mb"}));
app.use(express.urlencoded({extended : true}));
app.use(express.static('../client'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use(router)
app.use(authRouter)
app.use(productRouter)


app.listen(process.env.PORT,()=>{
    console.log(`server is running at http://localhost:${process.env.PORT}`);

})