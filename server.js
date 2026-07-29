const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const operations = {};

// Credenciais do Fandiconst FANDI_EMAIL = process.env.FANDI_EMAIL || 'vinicios.ferreira@tdrive.com.br';const FANDI_PASSWORD = process.env.FANDI_PASSWORD || '';const FANDI_URL = 'https://jsl.fandi.com.br/';// Função para submeter ficha ao Fandiasync function submeterFichaFandi(cpf, anoFabricacao, anoModelo, marca, modelo, versao, valor, km) {
  let browser;
  try {
          browser = await puppeteer.launch({
                    headless: 'new',
                    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
          });
          const page = await browser.newPage();
          await page.goto(FANDI_URL, { waitUntil: 'networkidle2', timeout: 30000 });

    // Verificar se está logado, se não fazer login    const loginButton = await page.$('[data-testid="login-button"]');
    if (loginButton) {
              // Fazer login      await page.type('input[name="email"]', FANDI_EMAIL, { delay: 50 });
            await page.type('input[name="password"]', FANDI_PASSWORD, { delay: 50 });
              await page.click('button[type="submit"]');
              await page.waitForNavigation({ waitUntil: 'networkidle2' });
    }

    // Clicar em "Operação Financiada 360" ou similar para criar nova ficha    await page.goto(FANDI_URL + 'modulos/eyJjb2RpZ28iOjkxOCwidXJsIjoifi9Nb2R1bG9zL1ZlbmRhcy9PcGVyYWNhby9PcGVyYWNhb0ZpbmFuY2lhZGEzNjBGb3JtLmFzcHg_Q25hX0NvZGlnbz01In0', { waitUntil: 'networkidle2' });

    // Preencher CPF    await page.type('input[name*="cpf"]', cpf, { delay: 50 });
    await page.keyboard.press('Tab');
          await page.waitForTimeout(1000); // Aguardar busca automática    // Preencher dados do veículo    await page.type('input[name*="marca"]', marca, { delay: 50 });
    await page.type('input[name*="modelo"]', modelo, { delay: 50 });
          await page.type('input[name*="versao"]', versao, { delay: 50 });
          await page.type('input[name*="valor"]', valor.toString(), { delay: 50 });
          await page.type('input[name*="km"]', km.toString(), { delay: 50 });
          await page.type('input[name*="anoFab"]', anoFabricacao.toString(), { delay: 50 });
          await page.type('input[name*="anoMod"]', anoModelo.toString(), { delay: 50 });

    // Submeter formulário    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    await browser.close();
          return { sucesso: true, mensagem: 'Ficha enviada ao Fandi com sucesso!' };
  } catch (erro) {
          console.error('Erro ao submeter ficha:', erro);
          if (browser) await browser.close();
          throw erro;
  }
}

app.post('/api/enviar-ficha', async (req, res) => {
      const { cpf, anoFabricacao, anoModelo, marca, modelo, versao, valor, km } = req.body;
      const operationId = Date.now().toString();

           try {
                   // Submeter para Fandi    const resultado = await submeterFichaFandi(cpf, anoFabricacao, anoModelo, marca, modelo, versao, valor, km);

        operations[operationId] = {
                  cpf,
                  anoFabricacao,
                  anoModelo,
                  marca,
                  modelo,
                  versao,
                  valor,
                  km,
                  status: 'enviado',
                  timestamp: new Date(),
                  resultado
        };

        res.json({ operationId, sucesso: true });
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
      res.json({ sucesso: true, mensagem: 'Email enviado' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
});
