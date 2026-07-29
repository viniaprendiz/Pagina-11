const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Armazenar operaçõesconst operacoes = {};

// Dados de clientes cadastradosconst clientesCadastrados = {
  '39840201808': { nome: 'João Silva', cpf: '39840201808' },
  '88860264634': { nome: 'Júlio César da Silva', cpf: '88860264634' }
};

// URL do Fandiconst FANDI_LOGIN_URL = 'https://jsl.fandi.com.br/Account/Login';const FANDI_OPERACAO_URL = 'https://jsl.fandi.com.br/modulos/eyJjb2RpZ28iOjkxOCwidXJsIjoifi9Nb2R1bG9zL1ZlbmRhcy9PcGVyYWNhby9PcGVyYWNhb0ZpbmFuY2lhZGEzNjBGb3JtLmFzcHg_Q25hX0NvZGlnbz01In0';// POST /api/enviar-fichaapp.post('/api/enviar-ficha', async (req, res) => {
  const { dados } = req.body;

  try {
        // Extrair CPF    const cpfMatch = dados.match(/\d{11}/);
    if (!cpfMatch) {
            return res.status(400).json({
                      sucesso: false,
                      erro: 'CPF não encontrado. Digite um CPF válido com 11 dígitos.'
            });
    }

    const cpf = cpfMatch[0];
        const cliente = clientesCadastrados[cpf];

    if (!cliente) {
            return res.status(400).json({
                      sucesso: false,
                      erro: `CPF ${cpf} não está cadastrado. Use: 39840201808 ou 88860264634`
            });
    }

    // Extrair dados do veículo do texto    const dadosVeiculo = extrairDadosVeiculo(dados);

    const operacaoId = Date.now().toString();
        operacoes[operacaoId] = {
                cpf,
                cliente: cliente.nome,
                veiculo: dadosVeiculo,
                status: 'enviando',
                timestamp: new Date(),
                url: FANDI_OPERACAO_URL
        };

    // Simular envio (em produção seria Puppeteer)
    setTimeout(() => {
                        operacoes[operacaoId].status = 'enviado';
    }, 2000);

    res.json({
            sucesso: true,
            operacaoId,
            cliente: cliente.nome,
            cpf,
            mensagem: 'Ficha enviada com sucesso!',
            url: FANDI_OPERACAO_URL
    });
  } catch (erro) {
        res.status(500).json({
                sucesso: false,
                erro: erro.message
        });
  }
});

// GET /api/status/:operationIdapp.get('/api/status/:operationId', (req, res) => {
  const op = operacoes[req.params.operationId];
  if (!op) {
        return res.status(404).json({ erro: 'Operação não encontrada' });
  }
  res.json(op);
});

// POST /api/enviar-emailapp.post('/api/enviar-email', (req, res) => {
  const { cpf, nome, operacaoId } = req.body;

  // Simular envio de email  console.log(`Email enviado para: marcelo.sinhorine@tdrive.com.br`);
  console.log(`Assunto: Sequenciar ficha`);
  console.log(`CPF: ${cpf}`);
  console.log(`Nome: ${nome}`);

  res.json({
        sucesso: true,
        mensagem: 'Email enviado com sucesso para os 4 destinatários!'
  });
});

// Função auxiliar para extrair dados do veículofunction extrairDadosVeiculo(texto) {
  // Extrai marca, modelo, ano, valor, km  const marca = extrairCampo(texto, 'marca|seção|fiat|toyota|ford');
  const modelo = extrairCampo(texto, 'modelo|argo|corolla|fiesta');
  const ano = extrairCampo(texto, '\d{4}');
  const valor = extrairCampo(texto, 'r\$\s*([\d.]+)');
  const km = extrairCampo(texto, '([\d.]+)\s*km');

  return { marca, modelo, ano, valor, km };
}

function extrairCampo(texto, padrao) {
    const regex = new RegExp(padrao, 'i');
    const match = texto.match(regex);
    return match ? match[0] : 'N/A';
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
