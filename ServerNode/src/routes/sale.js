const express = require('express');
const { database } = require('../database.js');
const router = express.Router();
var CryptoJS = require("crypto-js");

const pool = require('../database.js');

router.get('/',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    let sale = await pool.query('SELECT * FROM SALE');
    res.json({
        status:"200",
        message:"Sales have been recovered",
        sale: sale
    });
});

router.get('/:id',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    const {id} = req.params;
    let sale = await pool.query('SELECT * FROM SALE WHERE idPerson=?',[id]);
    res.json({
        status:"200",
        message:"Sale has been recovered",
        sale: sale
    });
});

router.post('/create',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    let {pay_id,id_person,id_movie} = req.body;
    sale ={pay_id,id_person,id_movie}
    
    saleIn = await pool.query('INSERT INTO SALE set ?', [sale]);

    res.json({
        status:"200",
        message:"Sale has been registered",
        sale:sale
    });
});

module.exports = router;