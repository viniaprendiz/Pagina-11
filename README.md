# Pagina 11 - Automação

Sistema simples de automação para teste de deploy no Render.

## Arquivos do Projeto

- `package.json` - Dependencias do Node.js
- - `server.js` - Servidor Express com API
  - - `public/index.html` - Frontend HTML
    - - `.env.example` - Exemplo de variáveis de ambiente
      - - `render.yaml` - Configuração de deploy no Render
       
        - ## Como usar
       
        - 1. Clone o repositório
          2. 2. Instale dependências: `npm install`
             3. 3. Inicie o servidor: `npm start`
                4. 4. Acesse em http://localhost:3000
                  
                   5. ## Deploy no Render
                  
                   6. 1. Crie uma conta em render.com
                      2. 2. Conecte seu repositório GitHub
                         3. 3. Configure as variáveis de ambiente
                            4. 4. Deploy será feito automaticamente
                              
                               5. ## API Endpoints
                              
                               6. - `POST /api/enviar-ficha` - Envia dados do cliente
                                  - - `GET /api/status/:operationId` - Verifica status
                                    - - `POST /api/enviar-email` - Envia email
