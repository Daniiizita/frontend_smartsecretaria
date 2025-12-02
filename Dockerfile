# Estágio 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de dependências
COPY package.json package-lock.json* ./

# Instala dependências
RUN npm ci

# Copia o código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio 2: Produção com Nginx
FROM nginx:alpine AS production

# Copia os arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]