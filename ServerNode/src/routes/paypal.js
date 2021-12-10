const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const request = require('request');

const CLIENT = "AZepj8FiBKqdjxN3yX_h8K-a_hLtpjZmGxt90Gs_rJr072RskokqomfP4_AV08Ricklw7Re8i3V52eVt";
const SECRET = "EMPXIzaxmozZkYCtgbIOq9ZsxqDLDcdjl6nD193TrsK9zfuB2Cgnwc-DNVmdwFuDCVfh7f6c0gvUYlBV";
const PAYPAL_API = "https://api-m-sandbox.paypal.com"
const auth = { user: CLIENT, pass: SECRET};


const createPayment = (req, res) => {

    const body = {
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'MXN',
                value: '115'
            }
        }],
        application_context: {
            brand_name: `MiTienda.com`,
            landing_page: 'NO_PREFERENCE', // Default, para mas informacion https://developer.paypal.com/docs/api/orders/v2/#definition-order_application_context
            user_action: 'PAY_NOW', // Accion para que en paypal muestre el monto del pago
            return_url: `http://localhost:3000/execute-payment`, // Url despues de realizar el pago
            cancel_url: `http://localhost:3000/cancel-payment` // Url despues de realizar el pago
        }
    }
    //https://api-m.sandbox.paypal.com/v2/checkout/orders [POST]

    request.post(`${PAYPAL_API}/v2/checkout/orders`, {
        auth,
        body,
        json: true
    }, (err, response) => {
        res.json({ data: response.body })
    })
}