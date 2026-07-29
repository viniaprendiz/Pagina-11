const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const operations = {};
const FANDI_FORM_URL = 'https://jsl.fandi.com.br/modulos/eyJjb2RpZ28iOjkxOCwidXJsIjoifi9Nb2R1bG9zL1ZlbmRhcy9PcGVyYWNhby9PcGVyYWNhb0ZpbmFuY2lhZGEzNjBGb3JtLmFzcHg_Q25hX0NvZGlnbz01In0';

// Dados de clientes cadastrados - em produção seria um banco de dadosconst clientesCadastrados = {
  '39840201808': { nome: 'João Silva', cpf: '39840201808' },
  '88860264634': { nome: 'Júlio César da Silva', cpf: '88860264634' }
};

app.post('/api/enviar-ficha', (req, res) => {
    const { cpf, anoFabricacao, anoModelo, marca, modelo, versao, valor, km } = req.body;
    const operationId = Date.now().toString();

           try {
                 // Validar CPF    const cliente = clientesCadastrados[cpf];
      if (!cliente) {
              return res.status(400).json({ 
                                                  sucesso: false, 
                        erro: 'CPF não encontrado na base de clientes' 
              });
      }

      // Montar URL do formulário com os dados preenchidos    // Esta URL abre o formulário do Fandi já com alguns dados preenchidos    const urlFormulario = `${FANDI_FORM_URL}?cpf=${cpf}&marca=${encodeURIComponent(marca)}&modelo=${encodeURIComponent(modelo)}&versao=${encodeURIComponent(versao)}&valor=${valor}&km=${km}&anoFab=${anoFabricacao}&anoMod=${anoModelo}`;

      // Armazenar operação    operations[operationId] = {
        cpf,
                cliente: cliente.nome,
                anoFabricacao,
                anoModelo,
                marca,
                modelo,
                versao,
                valor,
                km,
                status: 'pendente_submissao',
                timestamp: new Date(),
                urlFormulario
           };

             // Retornar URL do formulário para o cliente abrir    res.json({ 
               operationId, 
                       sucesso: true,
                       mensagem: 'Abra o link do Fandi para completar e submeter a ficha',
                       urlFormulario,
                       cliente: cliente.nome
});
} catch (erro) {
      operations[operationId] = {
              cpf,
              status: 'erro',
              timestamp: new Date(),
              erro: erro.message
      };
      res.status(500).json({ operationId, sucesso: false, erro: erro.message });
}
});

app.get('/api/status/:operationId', (req, res) => {
    const op = operations[req.params.operationId];
    if (!op) return res.status(404).json({ erro: 'Operação não encontrada' });
    res.json(op);
});

app.post('/api/enviar-email', (req, res) => {
    const { cpf, nome } = req.body;
    // Aqui você pode implementar envio de email para marcelo.sinhorine@tdrive.com.br,   // douglas.pinto@tdrive.com.br, eliane.psilva@tdrive.com.br, feitoyota@automob.com.br  res.json({ sucesso: true, mensagem: 'Email seria enviado para o time' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
