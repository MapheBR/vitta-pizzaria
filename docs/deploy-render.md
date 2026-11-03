# Deploy no Render (Free Tier)

## Pré-requisitos
- Conta no Render (https://render.com)
- Repositório GitHub conectado ao Render

## Passo a Passo

### 1. Conectar Repositório GitHub
1. Acesse https://dashboard.render.com
2. Clique em "New +" e selecione "Web Service"
3. Conecte sua conta GitHub se ainda não estiver conectada
4. Selecione o repositório `MapheBR/vitta-pizzaria`

### 2. Configurar Web Service
O arquivo `render.yaml` já tem a configuração automática, mas se configurar manualmente:

**Name:** vitta-pizzaria
**Region:** Oregon (ou o mais próximo)
**Branch:** master
**Runtime:** Node
**Build Command:** `pnpm install && pnpm build`
**Start Command:** `pntl start`
**Instance Type:** Free

### 3. Configurar Banco de Dados
Se não usar o `render.yaml`:
1. Clique em "New +" → "PostgreSQL"
2. Name: vitta-db
3. Database: vitta
4. User: vitta
5. Region: Mesma região do web service
6. Plan: Free

### 4. Configurar Variáveis de Ambiente
No web service, adicione as seguintes variáveis:

**Obrigatórias:**
- `NODE_ENV`: production
- `PORT`: 3000
- `DATABASE_URL`: (conecte ao banco PostgreSQL criado)
- `MANUS_JWT_SECRET`: (gerar uma string aleatória forte)

**Opcionais:**
- `MANUS_PROJECT_ID`: (se usar Manus OAuth)
- `MANUS_OAUTH_API_URL`: https://oauth.manus.com
- `MANUS_API_URL`: https://api.manus.com
- `MANUS_API_KEY`: (se usar API Manus)

### 5. Deploy Automático
Render fará deploy automático sempre que você fizer push no GitHub:
```bash
git add .
git commit -m "Mensagem do commit"
git push origin master
```

## Limitações do Free Tier
- Web service: dorme após 15 minutos de inatividade, acorda em ~30 segundos
- PostgreSQL: 90 dias de inatividade, depois o banco é deletado
- 512 MB RAM
- 0.1 CPU

## Acessar o Site
Após o deploy, Render fornecerá uma URL como:
https://vitta-pizzaria.onrender.com

## Monitoramento
- Acesse o dashboard do Render para ver logs
- Configurar checks em https://seu-site.onrender.com/api/health
