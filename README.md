# SmartSecretaria

Frontend do SmartSecretaria, uma aplicação de gestão escolar em desenvolvimento. Construído com React, TypeScript e Vite, consome a API Django do projeto.

Este repositório é público para apresentação de portfólio. A interface atual inclui login, dashboard, alunos, professores e turmas. A cobertura de telas ainda não corresponde a todos os módulos da API, e o produto não está pronto para produção.

## Executar localmente

Requer Node.js e uma API local em `http://127.0.0.1:8000`.

```powershell
npm ci
$env:VITE_API_BASE_URL = "http://127.0.0.1:8000/api"
npm run dev -- --host localhost
```

Abra `http://localhost:5173`. Configure a API e CORS de acordo com o ambiente. Use somente dados fictícios nesta demonstração.

## Build

```powershell
npm run build
```

## Autoria e licença

Copyright (c) 2025 Danielle. Os termos de uso estão em [LICENSE](LICENSE). Uso comercial exige autorização prévia por escrito do titular dos direitos. Não inclua credenciais, dados de alunos ou configurações privadas no repositório.
