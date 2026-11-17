# Meu Visto Fácil — Product Definition

## 1. Visão do produto

O Meu Visto Fácil é uma plataforma web criada para ajudar pessoas que desejam morar, estudar, trabalhar ou construir uma nova vida em outro país a compreender melhor os caminhos de imigração disponíveis.

A aplicação transforma informações migratórias complexas e espalhadas em uma experiência simples, organizada e personalizada.

O usuário poderá informar seu objetivo e características relevantes do seu perfil, visualizar opções de visto ou permissões compatíveis e gerar um checklist personalizado com documentos, requisitos, etapas e links para fontes oficiais.

O objetivo não é substituir consultoria jurídica ou órgãos governamentais, mas facilitar o entendimento inicial do processo migratório utilizando tecnologia, dados estruturados e inteligência artificial.

---

# 2. Problema

Informações sobre imigração geralmente estão distribuídas entre diferentes páginas governamentais, documentos, FAQs e portais oficiais.

Para uma pessoa que está começando a pesquisar, perguntas simples podem exigir bastante investigação:

* Qual visto ou permissão se aplica ao meu caso?
* Quais documentos são necessários?
* Quanto custa?
* Quanto tempo o processo pode levar?
* Preciso possuir uma oferta de emprego?
* Posso estudar com essa permissão?
* Meu parceiro pode me acompanhar?
* Onde encontro a informação oficial?
* Quais etapas ainda faltam no meu processo?

Além disso, mecanismos de busca e ferramentas de IA podem apresentar informações desatualizadas, incompletas ou sem uma fonte clara.

O Meu Visto Fácil procura reduzir esse problema organizando as informações e mantendo rastreabilidade até fontes oficiais.

---

# 3. Proposta de valor

O Meu Visto Fácil deve permitir que o usuário transforme uma dúvida como:

> "Quero morar e trabalhar na Irlanda. Por onde começo?"

em um caminho estruturado:

Objetivo

→ Perfil

→ Possíveis caminhos de imigração

→ Comparação

→ Escolha de uma opção

→ Checklist personalizado

→ Progresso

→ Fontes oficiais

---

# 4. Público-alvo

O público inicial são pessoas que estão pesquisando possibilidades de imigração e ainda não possuem conhecimento aprofundado sobre vistos e permissões.

Exemplos:

* profissionais interessados em trabalhar no exterior;
* estudantes interessados em estudar fora;
* pessoas avaliando uma mudança internacional;
* pessoas que receberam uma proposta de emprego;
* pessoas que estão organizando sua documentação;
* pessoas que querem entender quais opções podem se encaixar em seu perfil.

O produto deve ser compreensível mesmo para alguém que nunca estudou regras migratórias anteriormente.

---

# 5. País inicial

O MVP terá foco inicial na:

## Irlanda 🇮🇪

A arquitetura deverá permitir a inclusão futura de outros países sem exigir uma reconstrução do produto.

Países considerados para expansão:

* Portugal;
* Alemanha;
* Austrália;
* outros países europeus.

A aplicação não deve possuir regras de negócio excessivamente acopladas à Irlanda.

**Atualização de 16/11/2026:** a direção de longo prazo passou a ser atender qualquer país escolhido pelo usuário, com cobertura crescente e sempre baseada em fontes oficiais revisadas ([ADR 0001](decisions/0001-expansao-multipais-fontes-oficiais.md)). Ordem: Irlanda, Portugal e Espanha, depois Itália, Alemanha e Holanda. Países sem cobertura revisada mostram apenas links oficiais verificados, sem checklist. O produto também ganha um módulo de planejamento da mudança, com calculadora de reserva financeira e ocupações com demanda, incluindo trabalhos sem exigência de diploma filtrados pelo que o visto permite ([ADR 0002](decisions/0002-modulo-de-planejamento.md)), e uma versão Android a partir do próprio site ([ADR 0003](decisions/0003-android-via-pwa.md)).

---

# 6. Objetivos de imigração

O usuário poderá inicialmente explorar caminhos relacionados a:

* trabalho;
* estudo;
* reunião familiar;
* mudança/residência.

Outras categorias poderão ser adicionadas posteriormente.

---

# 7. Jornada principal

A experiência principal deverá seguir aproximadamente este fluxo:

## 7.1 Landing Page

O usuário conhece o produto e entende rapidamente sua proposta.

Principais ações:

* explorar opções de imigração;
* iniciar análise do perfil;
* entrar em uma conta existente;
* criar uma conta.

---

## 7.2 Escolha do destino

O usuário seleciona o país desejado.

No MVP:

Irlanda.

A interface já poderá ser preparada visualmente para mostrar outros países como disponíveis futuramente.

---

## 7.3 Objetivo

O usuário informa seu principal objetivo.

Exemplos:

* quero trabalhar;
* quero estudar;
* quero morar com familiares;
* ainda estou explorando possibilidades.

---

## 7.4 Questionário de perfil

A plataforma realiza perguntas relevantes para identificar possíveis caminhos.

O questionário deve ser dinâmico.

Perguntas podem incluir informações como:

* nacionalidade;
* objetivo;
* existência de oferta de emprego;
* área profissional;
* nível de qualificação;
* interesse em estudar;
* duração planejada da estadia;
* existência de familiares no país.

O sistema não deve solicitar dados pessoais desnecessários.

---

# 8. Recomendação de opções

Com base nas respostas, a aplicação apresenta caminhos potencialmente relevantes.

Exemplo:

Você informou que:

* pretende trabalhar na Irlanda;
* possui formação profissional;
* possui ou pretende obter uma oferta de emprego.

Possíveis caminhos:

### Critical Skills Employment Permit

Compatibilidade estimada: alta

### General Employment Permit

Compatibilidade estimada: média

Cada resultado deverá explicar:

* por que aquela opção apareceu;
* requisitos principais;
* possíveis impedimentos;
* fonte da informação.

A aplicação não deverá afirmar que o usuário é definitivamente elegível.

Em vez disso, utilizar linguagem como:

* "pode ser compatível com seu perfil";
* "vale verificar os seguintes requisitos";
* "com base nas informações fornecidas".

---

# 9. Catálogo de vistos e permissões

O usuário também poderá explorar opções sem preencher o questionário.

Exemplo:

Explorar Irlanda

### Trabalho

* Critical Skills Employment Permit
* General Employment Permit
* outras permissões relevantes

### Estudo

* permissões relacionadas a estudos

### Família

* caminhos relevantes para reunião familiar

Cada página terá informações estruturadas.

---

# 10. Página de detalhes

Cada opção deverá possuir uma página própria.

Informações possíveis:

* descrição;
* para quem é;
* requisitos;
* documentos;
* taxas;
* duração;
* possibilidade de renovação;
* dependentes;
* etapas;
* observações;
* perguntas frequentes;
* fontes oficiais.

Informações sensíveis a mudanças deverão mostrar quando foram verificadas pela plataforma.

---

# 11. Checklist personalizado

Esta será uma das principais funcionalidades do produto.

Após escolher um caminho, o usuário poderá gerar um checklist baseado em seu perfil.

Exemplo:

## Critical Skills Employment Permit

### Documentos

✅ Passaporte

✅ Oferta de emprego

⬜ Contrato de trabalho

⬜ Comprovante de qualificação

⬜ Documentação adicional aplicável

### Processo

⬜ Conferir critérios da ocupação

⬜ Conferir salário mínimo aplicável

⬜ Preparar documentação

⬜ Realizar solicitação

⬜ Acompanhar processo

Cada item deverá poder possuir:

* título;
* descrição;
* categoria;
* status;
* prioridade;
* fonte;
* observações;
* URL oficial.

---

# 12. Acompanhamento de progresso

Usuários autenticados poderão acompanhar processos salvos.

Exemplo:

## Meu processo

Critical Skills Employment Permit

Progresso:

68%

14 de 21 itens concluídos

Categorias:

Documentação — 80%

Requisitos — 100%

Solicitação — 40%

Após a chegada — 0%

O usuário poderá marcar itens como concluídos.

---

# 13. Inteligência artificial

A IA deverá complementar informações estruturadas, e não ser a única fonte de verdade da aplicação.

Funções possíveis da IA:

* explicar conceitos complexos em linguagem simples;
* personalizar descrições;
* auxiliar na geração de checklists;
* identificar quais informações do perfil são relevantes;
* resumir requisitos;
* apresentar próximos passos.

A IA não deverá inventar:

* URLs;
* valores;
* requisitos legais;
* prazos;
* regras migratórias.

Informações críticas deverão vir de dados previamente validados ou possuir referência oficial.

---

# 14. Princípio de fontes confiáveis

Um dos principais diferenciais técnicos do Meu Visto Fácil será sua preocupação com rastreabilidade.

Sempre que possível, informações importantes deverão possuir uma fonte oficial associada.

Exemplo:

Critical Skills Employment Permit

Fonte oficial:

Department of Enterprise, Tourism and Employment

[Ver fonte oficial]

O sistema deverá priorizar domínios governamentais previamente autorizados.

---

# 15. Validação de URLs

Links apresentados ao usuário deverão passar por validação.

A estratégia poderá incluir:

1. allowlist de domínios oficiais;
2. validação da URL;
3. requisição HTTP para verificar disponibilidade;
4. tratamento de redirects;
5. armazenamento da última verificação;
6. fallback quando uma página oficial estiver temporariamente indisponível.

A IA não deverá possuir liberdade para inventar links.

---

# 16. Atualização das informações

Informações migratórias podem mudar.

Por isso, registros importantes deverão possuir metadados como:

* fonte;
* URL;
* data da última verificação;
* data da atualização;
* status da fonte.

Exemplo:

Última verificação:

02/09/2026

Isso aumenta a transparência do produto.

---

# 17. Autenticação

Usuários poderão criar uma conta para salvar seu progresso.

A autenticação deverá permitir inicialmente:

* cadastro;
* login;
* logout;
* recuperação de conta/senha;
* sessão persistente.

Login social poderá ser considerado posteriormente.

---

# 18. Dashboard

Usuários autenticados terão acesso a um dashboard.

Exemplo:

## Olá!

### Seus processos

Critical Skills Employment Permit

68% concluído

[Continuar]

### Explorar

Irlanda

[Ver opções]

### Seu progresso

14 itens concluídos

7 restantes

---

# 19. Histórico

O usuário poderá manter mais de um processo salvo.

Exemplo:

Meus processos

* Critical Skills Employment Permit
* Study Permission

Cada processo manterá seu próprio checklist e progresso.

---

# 20. Responsividade

A aplicação deverá ser totalmente responsiva.

Prioridade:

* desktop;
* tablet;
* mobile.

Embora seja uma aplicação web, sua utilização em smartphones deverá possuir boa experiência.

---

# 21. Acessibilidade

O projeto deverá considerar acessibilidade desde o desenvolvimento inicial.

Objetivos:

* HTML semântico;
* navegação por teclado;
* contraste adequado;
* labels corretos;
* estados de foco visíveis;
* ARIA somente quando necessário;
* suporte adequado a leitores de tela.

Referência:

WCAG.

---

# 22. Estados da aplicação

Todas as interfaces relevantes deverão considerar:

* loading;
* success;
* error;
* empty;
* disabled;
* offline quando aplicável.

Não deverão existir interfaces que assumam que requisições sempre funcionarão.

---

# 23. Disclaimer

O produto deverá informar claramente que:

* não é um escritório de imigração;
* não fornece aconselhamento jurídico;
* não garante elegibilidade;
* informações podem mudar;
* decisões finais devem ser confirmadas com autoridades oficiais.

Ao mesmo tempo, o disclaimer não deverá prejudicar excessivamente a experiência do usuário.

---

# 24. Diferenciais do produto

## Personalização

O sistema adapta informações ao perfil informado.

## Organização

Informações complexas são transformadas em jornadas e checklists.

## Rastreabilidade

Informações relevantes possuem fontes oficiais.

## IA controlada

A IA complementa informações estruturadas em vez de funcionar como fonte irrestrita.

## Acompanhamento

O usuário consegue visualizar o progresso do processo.

---

# 25. MVP

A primeira versão publicável deverá conter:

### Público

* Landing Page
* página sobre o projeto
* exploração da Irlanda
* catálogo inicial de opções migratórias
* página detalhada das opções
* fontes oficiais

### Usuário

* cadastro
* login
* logout

### Personalização

* questionário inicial
* análise básica do perfil
* recomendação de opções potencialmente relevantes

### Checklist

* geração de checklist
* persistência
* marcar itens como concluídos
* progresso

### Inteligência Artificial

* geração/personalização controlada de conteúdo
* respostas estruturadas
* integração com dados confiáveis

### Qualidade

* responsividade
* acessibilidade
* tratamento de erros
* testes
* validação de links
* deploy na Vercel

---

# 26. Fora do MVP

A primeira versão não precisa possuir:

* pagamentos;
* assinatura premium;
* aplicativo mobile nativo;
* dezenas de países;
* marketplace de consultores;
* chat ilimitado com IA;
* upload e análise automática de documentos;
* comunidades;
* integração direta com sistemas governamentais;
* notificações complexas;
* painel administrativo avançado.

Essas funcionalidades poderão ser avaliadas posteriormente.

---

# 27. Roadmap conceitual

## V1 — Irlanda

Produto funcional publicado.

Objetivo:

demonstrar todo o fluxo principal.

## V1.1 — Refinamento

* UX;
* performance;
* SEO;
* acessibilidade;
* testes;
* analytics.

## V1.2 — Mais informações da Irlanda

Aumentar cobertura de permissões e jornadas.

## V2 — Segundo país

Portugal ou outro destino.

Validar a capacidade multi-país da arquitetura.

## V3 — Plataforma

Adicionar mais destinos e funcionalidades avançadas.

---

# 28. Objetivos técnicos

Além de resolver o problema do usuário, este projeto também deverá demonstrar engenharia de software moderna.

O projeto deverá demonstrar:

* React;
* TypeScript;
* desenvolvimento backend com Node.js;
* APIs REST;
* banco de dados;
* autenticação;
* inteligência artificial;
* validação;
* arquitetura;
* testes;
* acessibilidade;
* segurança;
* CI/CD;
* deploy;
* observabilidade;
* documentação técnica.

---

# 29. Objetivo como projeto de portfólio

O Meu Visto Fácil deverá ser suficientemente bem construído para que um desenvolvedor, recrutador ou entrevistador possa:

1. acessar a aplicação pública;
2. compreender rapidamente o problema resolvido;
3. experimentar uma jornada real;
4. analisar o código no GitHub;
5. compreender a arquitetura;
6. visualizar testes e decisões técnicas;
7. perceber claramente a participação de IA sem que o produto seja apenas um wrapper de um modelo.

O projeto deverá parecer um produto real, e não apenas uma demonstração acadêmica.

---

# 30. Métricas iniciais de sucesso

Para o MVP, sucesso significa:

* aplicação publicada e estável;
* fluxo principal funcionando de ponta a ponta;
* usuário conseguindo criar uma conta;
* usuário conseguindo descobrir uma opção;
* usuário conseguindo gerar um checklist;
* usuário conseguindo salvar progresso;
* fontes oficiais claramente apresentadas;
* links válidos;
* layout responsivo;
* testes essenciais passando;
* build e deploy automatizados.

---

# 31. Princípio central

Sempre que houver conflito entre:

* gerar uma resposta rapidamente;

e

* fornecer uma informação migratória rastreável e confiável;

o Meu Visto Fácil deverá priorizar confiabilidade.

A IA deve tornar a informação mais fácil de compreender.

Ela não deve transformar uma informação incerta em uma afirmação aparentemente verdadeira.
