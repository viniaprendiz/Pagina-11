const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const operations = {};

app.post('/api/enviar-ficha', (req, res) => {
    const { cpf, nome } = req.body;
    const operationId = Date.now().toString();

           operations[operationId] = {
                 cpf,
                 nome,
                 status: 'completed',
                 timestamp: new Date()
           };

           res.json({ operationId });
});

app.get('/api/status/:operationId', (req, res) => {
    const op = operations[req.params.operationId];
    if (!op) return res.status(404).json({ error: 'Not found' });
    res.json(op);
});

app.post('/api/enviar-email', (req, res) => {
    const { cpf, nome } = req.body;
    res.json({ success: true, message: 'Email sent' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
