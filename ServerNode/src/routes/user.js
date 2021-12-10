const express = require('express');
const router = express.Router();
var CryptoJS = require("crypto-js");
const pool = require('../database.js');


router.get('/', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let users = await pool.query('SELECT * FROM USER');

    res.json({
        status: "200",
        message: "Users have been recovered",
        users: users
    });
});


router.post('/login', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let { email, password } = req.body;
    let user = await pool.query('SELECT * FROM USER WHERE email=? AND status=?', [email,1]);
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = Math.random().toString(36).substring(0, 8);
    let encToken = CryptoJS.AES.encrypt(token, "A3KfcDnLtmlLhT0zIH1XIIvFe0YuD9Sv").toString();
    if (user.hasOwnProperty(0)) {
        let idUser = user[0].idUser
        let tokendb = { token, idUser };
        let tokenDel = await pool.query('DELETE FROM TOKEN WHERE idUser=?', [idUser]);
        await pool.query('INSERT INTO TOKEN set ?', [tokendb]);
        let namePerson = await pool.query('SELECT name,surname FROM PERSON WHERE idUser=?', [idUser]);
        let bytes = CryptoJS.AES.decrypt(user[0].password, 'A3KfcDnLtmlLhT0zIH1XIIvFe0YuD9Sv');
        let originalText = bytes.toString(CryptoJS.enc.Utf8);
        let nameSurname = `${namePerson[0].name} ${namePerson[0].surname}`;
        let encRol = CryptoJS.AES.encrypt(`${user[0].role}`, "A3KfcDnLtmlLhT0zIH1XIIvFe0YuD9Sv").toString();

        if (password === originalText) {
            res.json({
                status: "200",
                message: "Success",
                token: encToken,
                roleUser: encRol,
                name: nameSurname
            });
        } else {
            res.json({
                status: "500",
                message: "Invalid password or email"
            });
        }
    } else {
        res.json({
            status: "500",
            message: "Invalid password or email"
        });
    }
});
router.post('/returnId', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { token } = req.body;
    let bytes = CryptoJS.AES.decrypt(token, 'A3KfcDnLtmlLhT0zIH1XIIvFe0YuD9Sv');
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    let id = await pool.query('SELECT idUser FROM TOKEN WHERE token=?', [originalText]);
    let { idUser } = id[0];
    res.json({
        status: "200",
        message: "Person has been recovered",
        idPerson: idUser
    });
});

router.post('/chgPassword', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { token, password, oldPassword } = req.body;
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
        let encPassword = CryptoJS.AES.encrypt(password, "A3KfcDnLtmlLhT0zIH1XIIvFe0YuD9Sv").toString();
        await pool.query('UPDATE USER SET password=? WHERE idUser=?', [encPassword, idUser]);
        res.send('Success');
    } else {
        res.send('Error');
    }
});

router.post('/chgPasswordAdmin', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { password, id } = req.body;

    let encPassword = CryptoJS.AES.encrypt(password, "A3KfcDnLtmlLhT0zIH1XIIvFe0YuD9Sv").toString();
    await pool.query('UPDATE USER SET password=? WHERE idUser=?', [encPassword, id]);
    res.send('Success');

});

router.post('/delToken', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { token } = req.body;
    let bytes = CryptoJS.AES.decrypt(token, 'A3KfcDnLtmlLhT0zIH1XIIvFe0YuD9Sv');
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    await pool.query('DELETE FROM TOKEN WHERE token=?', [originalText]);
    res.send('Success');
});

router.get('/:id', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { id } = req.params;
    let user = await pool.query('SELECT * FROM USER WHERE idUser=?', [id]);
    res.json({
        status: "200",
        message: "User has been recovered",
        user: user
    });
});

router.post('/chkEmail', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let { email } = req.body;
    const user = { email };
    const getEmail = await pool.query('SELECT email FROM USER WHERE email=?', [email]);

    if (getEmail.hasOwnProperty(0)) {
        res.send('Exist')
    } else {
        res.send('Not found')
    }

});
router.post('/password', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let { password, email } = req.body;
    password = CryptoJS.AES.encrypt(password, "A3KfcDnLtmlLhT0zIH1XIIvFe0YuD9Sv").toString();
    const user = { password };
    await pool.query('UPDATE USER SET ? WHERE email = ?', [user, email]);
    res.json({
        status: "200",
        message: "User has been update"
    });
});
router.post('/create', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const dateNow = Date.now();
    const date_created = new Date(dateNow);
    const date_updated = new Date(dateNow);
    const { email, password, role, status } = req.body;
    const user = { email, password, date_created, date_updated, role, status };
    await pool.query('INSERT INTO USER set ?', [user]);
    res.json({
        status: "200",
        message: "User has been registered",
        user: user
    });
});



router.post('/update/:id', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const dateNow = Date.now();
    const date_updated = new Date(dateNow);
    const { id } = req.params;
    const { email, password, role, status } = req.body;
    let user;
    if(email===''){
        user = { email, password, date_updated, role, status };
    }else{
        user = { role };
    }
    

    await pool.query('UPDATE USER SET ? WHERE idUser = ?', [user, id]);

    res.json({
        status: "200",
        message: "User has been updated",
        user: user
    });
});

router.post('/delete/:id', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { id } = req.params;
    await pool.query('UPDATE USER SET STATUS = ? WHERE idUser = ?', [0, id]);
    res.json({
        status: "200",
        message: "User has been disabled"
    });
});

module.exports = router;