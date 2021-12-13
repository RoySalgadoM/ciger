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

router.get('/cast/:id',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    const {id} = req.params;
    let cast = await pool.query('SELECT c.name, c.idCast FROM cast c inner join movie_has_cast m on m.id_cast = c.idCast where m.id_movie = ?;',[id]);
    res.json({
        status:"200",
        message:"Cast has been recovered",
        cast: cast
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
    const {cast} = req.body;
    await pool.query('DELETE FROM MOVIE_HAS_CAST WHERE id_Movie =? AND id_cast = ?',[id,cast]);
    res.json({
        status:"200",
        message:"DELETE successful"
    });
});

module.exports = router;