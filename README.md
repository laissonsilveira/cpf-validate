
# cpf-validate

Servidor de mensageria

## Documentação API

- Disponível em
  - https://laissonsilveira.github.io/cpf-validate/
  - `docs/index.html`
- Para atualizar documentação, executar comando `npm run doc`

## Dependências

- Node.js >= 10
- MongoDB >= 4
- Docker >= 18

## Docker

### Build da imagem

Caso a imagem ainda não esteja hospedada
- `docker build --rm -f "Dockerfile" -t cpf-validate:latest .`

### Executando aplicação

- Configurar arquivo `.env` com os dados de conexão com banco e quantidade de cluster para servidor da API
- Mapear volume do database do containe Mongo
  - Não foi feito configurações de cluster do banco por falta de tempo
- Mapear volume do log do container API
  - Outras configurações podem ser alteradas no arquivo `config/default.json`
- Executar comando `docker-compose up`
  - O comando acima irá subir 2 container
    - Database: MongoDB 4.0.4
    - API: Node.js 10.15.3

## Build sem Docker

### NodeJS / PM2

- Instalar Node.js 10.15.3
- Instalar PM2: `npm install pm2 -g` (Mais detalhes aqui -> http://pm2.keymetrics.io/)
- Configurar PM2 para iniciar junto ao sistema: `pm2 startup`

### Mongo

- Instalar MongoDB 4.0.4
- Ativar autenticação automática do serviço em vim `/etc/mongodb.conf`:
  `security:
    authorization: enabled`
- Acessar mongo: mongo --host <HOSTNAME> --port <PORT> cpf-validate -u 'api_user' -p 'api_pwd' --authenticationDatabase 'admin'
- Criar usuários do banco
  `use admin`
  `db.createUser({user:"USUARIO_ROOT",pwd:"SENHA_ROOT", roles:[{role:"root",db:"admin"}]});`
- Os inseridos devem ser configurados no arquivo de configuração (`config/default.json`)
  `"database": {
    ...
    "user": "USUARIO_ROOT",
    "pass": "SENHA_ROOT"
    ...
  }`

### Testes

- Instalar dependências: `MONGOMS_VERSION=4.0.4 npm install`
  - Variável MONGOMS_VERSION é necessária para escolha da versão do mock do MongoDB que será instalado em cache
- Os testes são executados usando `mocha`
- Para executar os testes: `npm test`
- Um relatório em HTML estará disponível em `test/covarage/mochawesome.html`

### Gerando/Instalando pacote

- Instalar dependências: `npm install`
- Executar comando: `npm run build`
- Pacote `cpf-validate.tgz` gerado na pasta `dist`
- Descompatar arquivo e executar `pm2 start cpf-validate/bin/cpf-validate`
- Outros comandos do pm2 disponíveis: http://pm2.keymetrics.io
