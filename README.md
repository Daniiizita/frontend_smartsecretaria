# SmartSecretaria

Frontend do SmartSecretaria, uma aplicação de gestão escolar em desenvolvimento. Construído com React, TypeScript e Vite, consome a API Django do projeto.

Este repositório é público para apresentação de portfólio. A cobertura de telas ainda não corresponde a todos os módulos da API, e o produto não está pronto para produção.

## Telas atuais

- **Login** por nome de usuário ou email.
- **Início por perfil**: visão geral da escola para a gestão; "Minhas turmas" para professores; "Meus filhos" (turma, matrícula, professores e documentos) para responsáveis.
- **Alunos e professores**: listagem para a gestão (com cadastro e edição) e "Meus alunos" para professores, somente com dados pedagógicos.
- **Turmas**: lista com filtros (ano letivo, nível, período); página da turma com regente, disciplinas e professores (a gestão atribui direto na tela, inclusive "professor único") e alunos; cadastro e edição pela gestão. Professores veem "Minhas turmas", somente leitura.
- **Usuários e permissões**: contas de acesso e nível de permissão de cada uma, restrito à gestão.
- **Meu perfil**: dados da conta e troca da própria senha, para todos.
- **Notificações** no cabeçalho.

O menu e os botões mudam conforme o perfil, mas isso é apenas conveniência de interface: quem garante o acesso é a API, que aplica as permissões em cada endpoint.

Matrículas, documentos e calendário ainda não têm telas próprias.

## Executar localmente

Requer Node.js e uma API local em `http://127.0.0.1:8000`.

```powershell
npm ci
$env:VITE_API_BASE_URL = "http://127.0.0.1:8000/api"
npm run dev -- --host localhost
```

Abra `http://localhost:5173`. Configure a API e CORS de acordo com o ambiente. Use somente dados fictícios nesta demonstração.

Para ter o que explorar, gere a base de demonstração no backend (`python manage.py seed_demo`, veja o README da API) e entre com `admin_demo`, `secretaria_demo`, `professor_demo` ou `responsavel_demo` para ver cada perfil.

## Lint e build

```powershell
npm run lint
npm run build
```

A integração contínua (GitHub Actions) roda lint, build e `npm audit` a cada push ou pull request para `develop` e `main`.

## Deploy da demonstração

O frontend é publicado na Vercel (`vercel.json` já redireciona as rotas do React para o `index.html`). As variáveis de ambiente ficam no painel da Vercel:

| Variável | Uso |
| --- | --- |
| `VITE_API_BASE_URL` | Endereço da API, terminando em `/api` |
| `VITE_DEMO_MODE` | `true` mostra os botões de demonstração e o aviso de dados fictícios |
| `VITE_DEMO_PASSWORD` | Senha pública das contas de demo (a mesma `DEMO_PASSWORD` da API) |
| `VITE_DEV_MODE` | `false` em produção |

O passo a passo completo, junto com a API no Render, está no `DEPLOY.md` do repositório do backend. Não coloque segredos em variáveis `VITE_`: elas vão para o navegador.

## Autoria e licença

Copyright (c) 2025 Danielle. Os termos de uso estão em [LICENSE](LICENSE). Uso comercial exige autorização prévia por escrito do titular dos direitos. Não inclua credenciais, dados de alunos ou configurações privadas no repositório.
