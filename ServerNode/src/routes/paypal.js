const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const pool = require('../database.js');
const request = require('request');
const router = express.Router();
const CLIENT = "AZepj8FiBKqdjxN3yX_h8K-a_hLtpjZmGxt90Gs_rJr072RskokqomfP4_AV08Ricklw7Re8i3V52eVt";
const SECRET = "EMPXIzaxmozZkYCtgbIOq9ZsxqDLDcdjl6nD193TrsK9zfuB2Cgnwc-DNVmdwFuDCVfh7f6c0gvUYlBV";
const PAYPAL_API = "https://api-m.sandbox.paypal.com"
const auth = { user: CLIENT, pass: SECRET};

const executePayment=async(req,res)=>{
    let {pay_id, payer_id, id_movie,id_person} = req.body;
    let sale = {pay_id,id_movie,id_person}
    const body = {
        "payer_id": payer_id
    }

    request.post(`https://api.sandbox.paypal.com/v1/payments/payment/${pay_id}/execute`, {
        auth,
        body,
        json: true
    }, async(err, response) => {
        await pool.query('INSERT INTO SALE set ?', [sale]);
        res.json(response)
    })
}


const capturePayment=async(req,res)=>{
    let {pay_id} = req.body;
    
    const body = {
        
    }
    console.log(pay_id)

    request.get(`https://api.sandbox.paypal.com/v1/payments/payment/${pay_id}`, {
        auth,
        body,
        json: true
    }, (err, response) => {
        res.json(response)
    })
}

const createPayment = (req, res) => {
    let {total, name} = req.body;
    const body = {
        intent: "sale",
        payer: {
            "payment_method": "paypal"
        },
        transactions: [{
            "amount": {
              "total": total,
              "currency": "MXN",
              
            },
            "description": "Compra de la película "+name,
            "soft_descriptor": "Cine",
    }],
        "redirect_urls": {
            "return_url": "http://127.0.0.1:5500/index.html",
            "cancel_url": "http://127.0.0.1:5500/index.html"
          }
        
    }
    request.post(`${PAYPAL_API}/v1/payments/payment`, {
        auth,
        body,
        json: true
    }, (err, response) => {
        res.json(response)
    })
}

router.post('/create-payment',createPayment);
router.post('/execute-payment',executePayment);
router.post('/capture-payment',capturePayment);

module.exports = router;