const express = require('express');
const { database } = require('../database.js');
const router = express.Router();
var CryptoJS = require("crypto-js");

const pool = require('../database.js');
router.post('/token',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    const {token} = req.body;
    let bytes = CryptoJS.AES.decrypt(token, 'A3KfcDnLtmlLhT0zIH1XIIvFe0YuD9Sv');
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    let id = await pool.query('SELECT idUser,token FROM TOKEN WHERE token=?',[originalText]);
    let {idUser} = id[0];
    let person = await pool.query('select p.name, p.surname, p.secondSurname, u.email from PERSON p INNER JOIN USER u on p.idUser = u.idUser where u.idUser = ?;',[idUser]);
    
    res.json({
        status:"200",
        message:"Person has been recovered",
        person: person
    });
});


router.post('/delAccUser', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { token, oldPassword } = req.body;
    let bytes = CryptoJS.AES.decrypt(token, 'A3KfcDnLtmlLhT0zIH1XIIvFe0YuD9Sv');
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    let id = await pool.query('SELECT idUser FROM TOKEN WHERE token=?', [originalText]);
    let { idUser } = id[0];
    let getPassword = await pool.query('SELECT password FROM USER WHERE idUser=?', [idUser]);

    let passGet = getPassword[0].password;

    let bytesPass = CryptoJS.AES.decrypt(passGet, 'A3KfcDnLtmlLhT0zIH1XIIvFe0YuD9Sv');
    let originalPassword = bytesPass.toString(CryptoJS.enc.Utf8);
    console.log(originalPassword)
    if (originalPassword === oldPassword) {
        await pool.query('UPDATE USER SET status=? WHERE idUser=?', [0, idUser]);
        await pool.query('UPDATE PERSON SET status=? WHERE idPerson=?', [0, idUser]);
        res.send('Success');
    } else {
        res.send('Error');
    }
});

router.get('/',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    let people = await pool.query('SELECT * FROM PERSON');
    res.json({
        status:"200",
        message:"People have been recovered",
        people: people
    });
});

router.get('/:id',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    const {id} = req.params;
    let person = await pool.query('SELECT * FROM PERSON WHERE idPerson=?',[id]);
    res.json({
        status:"200",
        message:"Person has been recovered",
        person: person
    });
});

router.post('/create',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    const dateNow = Date.now();
    const date_created = new Date(dateNow);
    const date_updated = new Date(dateNow);
    let status = 1;
    let user;
    let {email, password, role} = req.body;
    if(role===''){
        role=2
        user={email, password, date_created,date_updated,role, status};
    }else{
        user={email, password, date_created,date_updated,role, status};
    }
    password = CryptoJS.AES.encrypt(password, "A3KfcDnLtmlLhT0zIH1XIIvFe0YuD9Sv").toString();
    
    
    userInsert = await pool.query('INSERT INTO USER set ?', [user]);
    const {insertId} = userInsert;
    const idUser = insertId
    const {name, surname, secondSurname} = req.body;
    const person={name, surname, secondSurname,date_created,date_updated, status, idUser};
    await pool.query('INSERT INTO PERSON set ?', [person]);

    res.json({
        status:"200",
        message:"Person has been registered",
        person: person,
        user:user
    });
});

router.post('/update/:id',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    const dateNow = Date.now();
    const date_updated = new Date(dateNow);
    const {id} = req.params;
    const {name, surname, secondSurname} = req.body;
    let person;
    if(secondSurname!=''){
        person= {name, surname, secondSurname,date_updated};
    }else{
        person= {name, surname,date_updated};
    }
    

    updatePerson = await pool.query('UPDATE PERSON SET ? WHERE idPerson = ?',[person,id]);
    
    res.json({
        status:"200",
        message:"Person has been updated",
        person: updatePerson
    });
});



router.post('/delete/:id',async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    const {id} = req.params;
    await pool.query('UPDATE PERSON SET STATUS=? WHERE idPerson = ?',[0,id]);
    res.json({
        status:"200",
        message:"People has been disabled"
    });
});

module.exports = router;