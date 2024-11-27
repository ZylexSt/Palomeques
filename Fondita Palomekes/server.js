const express = require('express');
const bodyParser = require('body-parser');
const OpenPay = require('openpay');

const app = express();
const openpay = new OpenPay('makgeq4vsdlom88zxw07', 'sk_7a96aadd671e4ada90f06e77e55875ca', false); // Sandbox false = Producción

app.use(bodyParser.json());

app.post('/checkout', (req, res) => {
    const { token_id, description, amount } = req.body;

    openpay.charges.create({
        source_id: token_id,
        method: 'card',
        amount: amount,
        currency: 'MXN',
        description: description,
    }, (error, charge) => {
        if (error) {
            res.status(500).send({ success: false, error });
        } else {
            res.send({ success: true, charge });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en ejecución en el puerto ${PORT}`));
