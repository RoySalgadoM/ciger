const express = require('express');
const { database } = require('../database.js');
const router = express.Router();
var CryptoJS = require("crypto-js");

const pool = require('../database.js');

router.get('/',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    let movie = await pool.query('SELECT * FROM MOVIE');
    res.json({
        status:"200",
        message:"Movies have been recovered",
        movie: movie
    });
});

router.get('/ultimateMovies',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    let movie = await pool.query('Select * From MOVIE where status = ? Order by (date_created) DESC LIMIT 3;',[1]);
    res.json({
        status:"200",
        message:"Movie- has been recovered",
        movie: movie
    });
});

router.get('/:id',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    const {id} = req.params;
    let movie = await pool.query('SELECT * FROM MOVIE WHERE idMovie=?',[id]);
    res.json({
        status:"200",
        message:"Movie has been recovered",
        movie: movie
    });
});

router.post('/create',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    const dateNow = Date.now();
    const date_created = new Date(dateNow);
    const date_updated = new Date(dateNow);
    let status = 1;
    let movie;
    let {title, originalTitle, description, runningTime, image, price, id_category} = req.body;
    movie ={title, originalTitle, description, runningTime, image, price, date_created, date_updated,status,id_category}
    
    movieIn = await pool.query('INSERT INTO MOVIE set ?', [movie]);

    res.json({
        status:"200",
        message:"Movie has been registered",
        movie:movie
    });
});

router.post('/update/:id',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    const dateNow = Date.now();
    const date_updated = new Date(dateNow);
    const {id} = req.params;
    let {title, originalTitle, description, runningTime, image, price, id_category} = req.body;
    let movie = {title, originalTitle, description, runningTime, date_updated, image, price, id_category}
    

    movieIn = await pool.query('UPDATE MOVIE SET ? WHERE idMovie = ?',[movie,id]);
    
    res.json({
        status:"200",
        message:"Movie has been updated",
        movie: movie
    });
});



router.post('/delete/:id',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    const {id} = req.params;
    await pool.query('UPDATE MOVIE SET STATUS=? WHERE idMovie = ?',[0,id]);
    res.json({
        status:"200",
        message:"Movie has been disabled"
    });
});

module.exports = router;