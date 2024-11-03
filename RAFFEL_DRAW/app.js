const express = require('express');
const app = new express();

const morgan = require('morgan');
const cors = require('cors');
const router = require('./src/routes/api');


app.use([morgan('dev'), cors(), express.json()]);



app.use('/api/v1/tickets',router)

app.use((_req, _res, next)=>{
    const err = new Error('Resource not found');
    err.status = 404;
    next(err);
})

app.use((err, _req, res, next) =>{
    console.log(err);
    if(err.status){
        return res.status(err.status).json({
            message: err.message
        })
    }
    res.status(500).json({message: 'Something went wrong'})
})

module.exports = app