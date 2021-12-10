const express = require('express');
const { database } = require('../database.js');
const router = express.Router();

const pool = require('../database.js');

router.get('/',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    let movie = await pool.query('SELECT * FROM MOVIE_HAS_CAST');
    res.json({
        status:"200",
        message:"Movies-cast have been recovered",
        movie: movie
    });
});

router.get('/:id',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    const {id} = req.params;
    let movie = await pool.query('SELECT * FROM MOVIE_HAS_CAST WHERE id_Movie=?',[id]);
    res.json({
        status:"200",
        message:"Movie-cast has been recovered",
        movie: movie
    });
});



router.post('/create',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    let movie;
    let {id_movie, id_cast} = req.body;
    movie ={id_movie, id_cast}
    
    movieIn = await pool.query('INSERT INTO MOVIE_HAS_CAST set ?', [movie]);

    res.json({
        status:"200",
        message:"ADD successful",
        movie:movie
    });
});


router.post('/delete/:id',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    const {id} = req.params;
    await pool.query('DELETE FROM MOVIE_HAS_CAST WHERE id_Movie = ?',[id]);
    res.json({
        status:"200",
        message:"DELETE successful"
    });
});

module.exports = router;