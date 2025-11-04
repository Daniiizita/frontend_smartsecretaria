# Arquitetura do Projeto - Frontend

``` plaintext
src/
|-- api/
|   |-- axios.ts
|   |-- alunoService.ts
|   |-- professorService.ts
|   |-- ... (outros serviços para cada módulo da sua API)
|-- assets/
|   |-- ... (imagens, fontes, etc.)
|-- components/
|   |-- common/
|   |   |-- Button/
|   |   |-- Input/
|   |   |-- Modal/
|   |   |-- ... (componentes de UI reutilizáveis)
|   |-- StatusCard.tsx
|-- features/
|   |-- alunos/
|   |   |-- AlunoList.tsx
|   |   |-- AlunoForm.tsx
|   |   |-- useAlunos.ts (hook customizado)
|   |-- professores/
|   |   |-- ...
|   |-- turmas/
|   |   |-- ...
|   |-- ... (outras funcionalidades como matricula, calendario, etc.)
|-- hooks/
|   |-- useApi.ts
|   |-- ... (outros hooks globais)
|-- pages/
|   |-- Dashboard.tsx
|   |-- Alunos.tsx
|   |-- Professores.tsx
|   |-- ... (outras páginas principais)
|-- routes/
|   |-- AppRouter.tsx
|-- styles/
|   |-- global.css
|-- types/
|   |-- index.ts
|-- utils/
|   |-- ... (funções utilitárias)
|-- App.tsx
|-- main.tsx


```
