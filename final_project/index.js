const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const axios = require('axios')
const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    let authHeader = req.headers.authorization;
    try {
        let token = authHeader.split(' ')[1];
        if (token){
            let verificationStatus=jwt.verify(token,'access')
            req.session.user=verificationStatus.user;
            next();
        }
    }
    catch(err) 
    {
        console.log(err)
        res.status(401).send('Login to continue...');
    }
});
 
const getAllBooks = async () => {
    const books = await axios.get('http://localhost:5000/')
    console.log(books.data)
}

const getBooksByISBN = async (isbn) => {
    const book = await axios.get(`http://localhost:5000/isbn/${isbn}`)
    console.log(book.data)
} 

const getBooksByAuthor = async (author) => {
    const book = await axios.get(`http://localhost:5000/author/${author}`)
    console.log(book.data)
} 

const getBooksByTitle = async (title) => {
    const book = await axios.get(`http://localhost:5000/title/${title}`)
    console.log(book.data)
} 

getAllBooks()
getBooksByISBN(5)
getBooksByAuthor('Chinua Achebe')
getBooksByTitle('Things Fall Apart')

const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
