# Spec de UX - Telas de autenticação (mobile e web)

Issues: #24 (GP-022 login mobile), #25 (GP-023 cadastro mobile), #28 (GP-026 login web), #29 (GP-027 cadastro web), #32 (GP-098 recuperar senha, mobile e web), #90 (GP-099 termos de uso e política de privacidade).
Nomenclatura: as decisões desta spec são **UX-1 a UX-19** (seção 10), para não colidir com as decisões D1 a D13 do backlog do PO. Referências a "D" do backlog dizem "do backlog".
Base: `docs/design/design-system.md` **na versão 2.0** (PR #100: paleta laranja, neutros frios, raios menores e camada de expressão de marca de rua/skate; **o PR #100 entra em `main` antes deste (#89)**) (tokens, componentes e regras). Esta spec **não define cor, fonte, espaço ou raio novos**: só usa tokens do DS.
Figma: ver seção 13.

Regras de negócio que moldam as telas (backlog do PO, decisões D1, D4 e D8 do backlog):
- Cadastro em **3 passos**: (1) nome e sobrenome (`firstName`, `lastName`), (2) e-mail e confirmação de e-mail, (3) senha com no mínimo 8 caracteres, confirmação de senha e aceite dos termos. Não existe nickname.
- Login inválido: sempre "E-mail ou senha inválidos" (não revela se o e-mail existe).
- Sessão de 7 dias, sem refresh; ao expirar, volta ao Login.
- Login de conta desativada reativa a conta.
- Recuperação de senha: código de 6 dígitos por e-mail, válido por 15 min, uso único, 5 tentativas erradas invalidam o código, "Reenviar código". A resposta ao pedir o código é sempre a mesma, exista ou não a conta.
- Cadastro exige aceite dos Termos de uso e da Política de privacidade (GP-099). O signup passa a receber o aceite e o backend grava a data e a versão dos termos; sem aceite devolve `VALIDATION_ERROR`.
- Todo o conteúdo do app exige login (D10 do backlog): as telas de autenticação e as de leitura dos termos são as únicas públicas.

---

## 1. Mapa de telas e fluxo

```
              (abre o app / acessa o site)
                         |
           token válido? --sim--> Home (mapa)
                         |
                        não
                         v
   +--------------> [A] LOGIN <------------------------------+
   |                 |    |   \                               |
   |   "Criar conta" |    |    \ "Esqueci minha senha"        |
   |                 v    |     v                             |
   |        [B] CADASTRO  |   [C1] RECUPERAR: e-mail          |
   |           |      |   |        |  (resposta neutra)       |
   |  sucesso: |      |   |        v                          |
   |  volta ao |      |   |   [C2] RECUPERAR: código +        |
   |  Login    |      |   |        nova senha + confirmação   |
   |  (aviso)  |      |   |        |                          |
   |           |  [D/E] Termos / Privacidade (leitura)       |
   |                  |   |        +--> volta ao [A] com e-mail preenchido e aviso
   |  "Já tenho conta"|   | credenciais ok
   +------------------+   v
                        Home (mapa)
```

Telas: **A** Login, **B** Cadastro, **C1** Esqueci minha senha, **C2** Redefinir senha, **D** Termos de uso e **E** Política de privacidade (leitura, públicas). Mobile e web compartilham estrutura, textos e estados.

Rotas web: A = `/` (já existe, `URL.LOGIN`), B = `/cadastro`, C1 = `/recuperar-senha`, C2 = `/recuperar-senha/codigo`, D = `/termos`, E = `/privacidade` (D e E públicas, sem guard). Mobile: `Login`, `Signup`, `ForgotPassword`, `ResetPassword`, `Terms`, `Privacy` num stack de autenticação separado do stack da Home.

Transições de dados entre telas:
- A -> B / A -> C1: se o campo e-mail do Login já tem texto, ele é levado como valor inicial (menos digitação).
- C1 -> C2: o e-mail vai por parâmetro de rota (mobile) ou estado de navegação/Redux (web), **nunca na URL**. Se C2 for aberta sem e-mail (recarregar a página no web), redireciona para C1.
- C2 -> A: o e-mail volta preenchido e o foco vai ao campo de senha.
- B -> A: depois de criar a conta **o app não entra logado** (UX-15): vai ao Login (`replace`) com o e-mail preenchido, foco na senha e `AlertBanner` success "Conta criada! Entre com seu e-mail e senha."
- B é um fluxo de 3 passos (B1 nome e sobrenome, B2 e-mail e confirmação, B3 senha, confirmação e aceite); dentro dele "Voltar" retorna ao passo anterior sem perder dados e `EMAIL_ALREADY_EXISTS`, que só vem no envio final, leva de volta ao B2.
- B -> D / E: os links do aceite abrem as telas de leitura sem perder o que foi digitado em B (ver tela B e seção 7A).
- A -> destino: depois do login, a pessoa vai para a **rota pretendida** (a que tentou abrir antes de ser mandada ao Login, GP-028 / #30) e, se não houver, para a Home. No mobile vale o mesmo para links profundos futuros; no MVP o destino é a Home.

## 2. Componentes do DS usados (e o que falta)

Usados como definidos na seção 8 do DS: `Button` (primary lg, ghost/link), `Input` (altura 48, fonte 16, rótulo sempre visível, erro com borda `error` + ícone + mensagem), `Toast`, estados de loading.

Necessários que o DS ainda não detalha (devem entrar em GP-002/003; spec abaixo para o Dev e o UX não divergirem):

| Componente | Definição |
|---|---|
| `PasswordInput` | `Input` com botão à direita (alvo 48x48) que alterna mostrar/ocultar. Ícone olho / olho cortado. `aria-label`/`accessibilityLabel`: "Mostrar senha" / "Ocultar senha"; `aria-pressed`/`accessibilityState.checked` reflete o estado. Começa oculta. |
| `AlertBanner` | Bloco inline que não some sozinho. **Borda total de 1,5 px** na cor da variante (`error`, `success` ou `info`) **mais uma faixa de acento de 4 px à esquerda**, na mesma cor (a faixa e o ícone reforçam a cor sem depender só dela). Fundo `sunken`, raio `md`, padding `space.3` (12). **Ícone 20x20** (alerta, check, info) alinhado ao topo da primeira linha, `space.2` de distância do texto, na cor da variante. **Tipografia:** `body-sm` (14/20) em `text` (contraste de `text`/`sunken` já verificado no DS). **Ação opcional** ("Tentar novamente", "Reenviar código"): `TextLink` em `label` (14/20, 600), alvo mínimo 48 de altura. Layout: ícone + texto em linha; a ação fica **à direita** apenas quando cabe sem quebrar o texto em mais de 2 linhas; caso contrário, e sempre com fonte em 130% ou largura menor que 360, **a ação quebra para uma linha própria, abaixo do texto, alinhada à esquerda do texto** (ao lado do ícone, não sob ele). Nunca truncar o texto. `role="alert"` para `error`, `role="status"` para `success`/`info`. |
| `TextLink` | Duas variantes: **ação** (padrão) e **apoio** (`quiet`: `body-sm` em `text-muted`, sublinhado; usada em "Esqueci minha senha"). A variante de ação: texto em `primary-text`, peso 600, **sempre sublinhado** (distingue de texto comum sem depender de cor). Alvo mínimo 48 de altura no mobile (`hitSlop`); na web, altura mínima de 24 px com padding vertical para chegar a 44 em linhas isoladas. **Estados:** default `primary-text`; hover (web) `primary-hover`; **pressed** (mobile e web) `primary-hover` + opacidade 0.8; **focus** (teclado/leitor) anel `focus` de 2 px com `offset` 2 px e raio `sm`, nunca removido; desativado (durante envio ou espera) `text-subtle`, sem sublinhado, `aria-disabled`. **Dentro de mensagem de erro** (ex.: "Este e-mail já tem cadastro. Entrar"): o texto do erro continua em `error` e o link fica em `primary-text` sublinhado, na mesma linha; se não couber, o link quebra para a linha seguinte junto com a mensagem, mantendo a ordem de leitura. O link faz parte do mesmo parágrafo do erro, então o leitor de tela lê "Este e-mail já tem cadastro. Entrar" e o link é alcançável por tab logo depois do campo. |
| `AuthLayout` | Casca das 6 telas (Login, Cadastro, Esqueci minha senha, Redefinir senha, Termos e Privacidade): fundo `bg`, `Tape` e `Halftone` nos cantos superiores, `Wordmark` (Login) ou `TitleBrand` (demais) e conteúdo; os decorativos são ocultados com teclado aberto ou altura de janela menor que 600 para nunca competir com o formulário. wordmark + título + conteúdo. Uma implementação por plataforma (ver seções 3 e 4). |
| `Checkbox` | Caixa 24x24 visual dentro de alvo 48x48; raio `sm`; borda `border` 2 px; marcado = fundo `primary` e check em `on-primary`; foco = anel `focus`; erro = borda `error` + mensagem; desativado = opacidade 0.4. Rótulo ao lado em `body`, clicável (alterna). Usado no aceite dos termos. |
| `Wordmark` / `TitleBrand` / `Tape` / `Halftone` | **Camada de marca do DS v2.0** (seção 13 do DS): logo (tile amarelo com pino e skatista, do modelo do dono) + "GoPicos" em fonte display (Permanent Marker) com traço de spray `primary` abaixo; `TitleBrand` = título de tela em fonte display (mín. 24 px) com spray; fita e meio-tom decorativos nos cantos. Todo decorativo é `aria-hidden`, SVG, fora da área dos campos. O `Wordmark` tem `aria-label="GoPicos"`. |
| `Stepper` | Indicador de progresso do cadastro: texto "Passo {n} de 3" (`label`) + 3 segmentos de 4 px (feitos e atual em `primary`, futuros em `divider`). `role="group"` com `aria-label="Passo {n} de 3"`; o texto é a informação, a barra é reforço. |

## 3. Padrões comuns (valem para as seis telas)

### 3.1 Formulário e validação
- Campos: rótulo `label` acima (sempre visível, nunca só placeholder), input, mensagem de apoio/erro abaixo (`body-sm`). Espaço entre campos `space.4`.
- **Quando validar**: no primeiro envio valida tudo; antes disso, cada campo valida ao sair dele (blur). Depois de um erro, o campo revalida a cada digitação e o erro some assim que fica válido. Não mostrar erro enquanto a pessoa ainda digita pela primeira vez (irritante e especialmente ruim no teclado de celular).
- **Envio com erro**: o foco vai para o primeiro campo inválido e o leitor de tela anuncia o erro. No mobile, a tela rola até ele.
- Erro de campo = borda `error` + ícone de alerta + texto em `error` (nunca só cor, princípio 6 do DS). O campo ligado ao erro usa `aria-invalid` e `aria-describedby` apontando para o elemento da mensagem (web). No mobile, **o erro é parte do `accessibilityLabel` do campo** (ex.: "E-mail, erro: informe um e-mail válido") e `accessibilityState.invalid`/`isError`; **não usamos `accessibilityHint`**, que o leitor pode omitir ou ler em outro momento. Ao enviar com erro, o texto também é anunciado (`announceForAccessibility`).
- **Botão primário durante o envio**: estado `loading` do DS (spinner no lugar do rótulo, largura mantida, toque desativado) e `aria-busy`/`accessibilityState.busy`. Os campos também ficam não editáveis (`readOnly`, sem escurecer) para a pessoa não alterar dados no meio do envio. O botão fica sempre habilitado antes do envio: **não** desabilitar o botão por formulário incompleto, porque um botão cinza sem explicação não diz o que falta; deixamos o envio mostrar os erros.
- Enter/“ok” do teclado: avança de campo; no último campo envia (`returnKeyType="next"` / `"go"`; web é um `<form>` real, Enter envia).
- Dados digitados **nunca são apagados** em erro de servidor ou de rede (exigência de #28). Exceções: senha é apagada só no sucesso (a tela sai) e no erro "E-mail ou senha inválidos" a senha permanece mas selecionada (ver Login).

### 3.2 Erros de rede e de servidor (iguais em todas as telas)
| Situação | Apresentação | Texto |
|---|---|---|
| Sem conexão / timeout | `AlertBanner` error acima do botão primário, com ação "Tentar novamente" que reenvia o formulário | "Sem conexão. Verifique sua internet e tente de novo." |
| Erro inesperado do servidor | `AlertBanner` error, mesma posição | "Algo deu errado do nosso lado. Tente de novo em instantes." |

O MVP não tem limite de tentativas de login no backend, então **não há mensagem de "muitas tentativas" no Login** (ficaria sem erro real que a dispare). Se o backend passar a limitar, entra como pós-MVP. O banner some no próximo envio. Nunca mostramos texto técnico ou o `type` do erro. O banner não é toast porque exige ação e o toast some (DS: "aviso de erro nunca some sozinho se exigir ação").

### 3.3 Acessibilidade comum
- Título da tela é um `h1` (web) / `accessibilityRole="header"` (mobile) e recebe o foco do leitor de tela ao abrir a tela.
- Ordem de foco = ordem visual. Anel de foco `focus` 2 px sempre visível na web.
- `autoComplete`/`textContentType` para gerenciadores de senha e preenchimento do sistema (tabela em cada tela). Isso é decisivo para quem usa gerenciador de senha e para o iOS/Android sugerirem senha forte.
- Teste obrigatório a 130% de fonte: nada trunca; o layout rola.
- Reduzir movimento: transições entre telas viram fade curto (regra do DS).
- Temas claro e escuro: só tokens. Nenhuma tela usa hex.

### 3.4 Teclado e e-mail
- E-mail: `keyboardType="email-address"` / `inputMode="email"`, `autoCapitalize="none"`, `autoCorrect={false}`, `spellCheck=false`. Espaços nas pontas são removidos antes de validar (colar e-mail com espaço é comum). Comparação do e-mail sem diferenciar maiúsculas (backlog).
- Nome: `autoCapitalize="words"`, `textContentType="name"`.

---

## 4. Tela A - Login (#24 mobile, #28 web)

**Objetivo:** entrar rápido, com a identidade de skate do app. Quem já tem conta quase sempre usa gerenciador de senha ou biometria do sistema; a tela precisa ser curta e previsível.

### 4.1 Hierarquia (de cima para baixo)
Segue o modelo do dono (Figma `3VexamkeziZHB1RPfTKedg`, node `16:37`): bloco de marca, formulário simples, ação principal, divisor e link de cadastro. Diferenças deliberadas e justificadas em UX-20 e UX-21.
0. (Invisível) `h1` "Entrar", só para leitor de tela (a tela não tem título visível: a marca cumpre esse papel, como no modelo).
1. `Wordmark`: logo + "GoPicos" em fonte display + spray `primary`
2. Tagline em `body-sm` `text-muted`: "Localize o pico perfeito para andar de skate" (texto do modelo)
3. (Condicional) `AlertBanner` de contexto: sessão expirada, cadastro concluído, senha alterada (a conta reativada **não** é banner, é toast na Home)
4. Campo **E-mail**
5. Campo **Senha** (`PasswordInput`)
6. `TextLink` apoio "Esqueci minha senha", alinhado à direita **abaixo** do campo senha (como no modelo; no caminho do polegar)
7. (Condicional) `AlertBanner` de erro de rede/servidor
8. Botão primário "Entrar"
9. `DividerLink`: linha `divider` e, abaixo, "Não tem conta?" + `TextLink` "Cadastre-se"
Decoração (fora do formulário): `Tape` no canto superior esquerdo, `Halftone` no superior direito.

### 4.2 Campos
| Campo | Rótulo | Placeholder | Atributos | Validação (cliente) |
|---|---|---|---|---|
| E-mail | "E-mail" | "voce@exemplo.com" | `autoComplete="username"` / `email`; iOS `textContentType="username"`; Android `autoComplete="email"` | obrigatório: "Informe seu e-mail."; formato: "Informe um e-mail válido." |
| Senha | "Senha" | (vazio) | `autoComplete="current-password"`; iOS `textContentType="password"` | obrigatório: "Informe sua senha." (sem regra de tamanho no login; a regra de 8 caracteres é do cadastro e não deve bloquear quem tem senha antiga) |

Observação: no Login, e-mail e senha são validados **só quanto a "vazio" e formato do e-mail**. Não mostramos "senha com menos de 8 caracteres" aqui, porque seria uma pista a mais sobre o formato esperado e só atrapalha.

### 4.3 Estados
| Estado | Comportamento |
|---|---|
| Padrão | Foco inicial no e-mail na web (`autofocus`). No mobile **não** abre o teclado automaticamente (cobriria o botão e a pessoa nem viu a tela ainda). |
| Digitando / foco | Anel `focus` 2 px. |
| Erro de campo | Texto abaixo do campo, só quando vazio ou e-mail malformado (ver 3.1). Botão permanece habilitado. |
| **Enviando (loading)** | Botão em `loading` ("Entrar" vira spinner, largura mantida), campos somente leitura, links "Esqueci minha senha" e "Criar conta" desativados. Anunciar "Entrando" ao leitor de tela. |
| **Credenciais inválidas** | `AlertBanner` error acima do botão: **"E-mail ou senha inválidos"** (texto exato, mesma mensagem para e-mail inexistente e senha errada, regra do backlog). **Não** marcar o campo e-mail nem o campo senha em vermelho (isso revelaria qual falhou). O e-mail digitado permanece; o campo senha mantém o valor e o foco volta a ele, com o texto selecionado para trocar rápido. |
| **Erro de rede** | Banner 3.2 com "Tentar novamente". Campos preenchidos preservados. |
| Sucesso | Mobile: token no Keychain e `reset` do navigator para a Home (sem botão voltar ao Login). Web: redireciona para **a rota pretendida guardada pelo guard (GP-028 / #30), ou `/home` se não houver**, com `replace` (voltar do navegador não retorna ao Login). O botão continua em `loading` até a navegação para não haver "piscada" do formulário. |
| Sessão expirada | **Só** quando havia um token salvo e ele expirou ou foi rejeitado (o app detecta `UNAUTHENTICATED` **com token presente**, apaga o token e navega ao Login). `UNAUTHENTICATED` sem token (primeiro acesso, logout, usuário que nunca entrou) **não** mostra o banner. `AlertBanner` info no topo: **"Sua sessão expirou. Entre de novo para continuar."** |
| Vindo do cadastro (UX-15) | `AlertBanner` success: "Conta criada! Entre com seu e-mail e senha." |
| Vindo da recuperação de senha | `AlertBanner` success: **"Senha alterada. Entre com a nova senha."** E-mail preenchido, foco na senha. |
| Vindo de excluir conta (spec de perfil, D34) | `AlertBanner` info: **"Conta excluída. Se quiser voltar, entre com seu e-mail e senha e ela será reativada."** E-mail preenchido, foco na senha. Chega por parâmetro da navegação (`replace`), nunca pela URL. |
| **Conta reativada** | Decisão UX-14: toast na Home (o login devolve `reactivated: true`), **"Bem-vindo de volta! Sua conta foi reativada."** |

### 4.4 Layout mobile
- Tela em `bg`. O bloco (marca + formulário + divisor) fica **centralizado verticalmente** quando cabe (como no modelo); se não cabe (teclado aberto, fonte 130%), vira rolagem normal. Implementação: `ScrollView` com `contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}`, `keyboardShouldPersistTaps="handled"`, dentro de `KeyboardAvoidingView` (iOS `padding`; Android `adjustResize`).
- Margens laterais `space.8` (32, equivalente aos 33 do modelo); marca e formulário alinhados à esquerda na mesma margem.
- Espaço: marca -> formulário `space.8`; entre campos `space.4`; campo senha -> link de apoio `space.2`; link -> botão `space.4`; botão -> divisor `space.6`.
- **Botão "Entrar" e o divisor fluem logo após o último campo** (não fixos): login tem um passo só e o botão aparece com teclado aberto por causa da rolagem.
- Safe-area: `useSafeAreaInsets` em cima e embaixo; `paddingBottom = inset.bottom + space.6`.
- Botão: largura total, `lg` 48, raio `md`, rótulo `button` em `on-primary` (texto escuro sobre o laranja). `TextLink` com alvo 48.
- `Tape` e `Halftone` absolutos no topo, `aria-hidden`/`importantForAccessibility="no"`, ocultos quando o teclado abre.
- Biometria e login social: fora do MVP.

### 4.5 Layout web
- `bg` na viewport; **coluna de 400 px centralizada** na horizontal e na vertical (sem card, como o modelo, que não tem cartão). Abaixo de `sm` (640) ocupa a largura com margem `space.4`, igual ao mobile.
- Campos em `surface` com borda `border` (ver UX-27), então continuam visíveis sobre o fundo.
- `Tape` no canto superior esquerdo da viewport e `Halftone` no superior direito; em `lg` e acima, um segundo `Halftone` no canto inferior esquerdo.
- Ordem de tab: e-mail -> senha -> mostrar senha -> "Esqueci minha senha" -> Entrar -> "Cadastre-se".
- Sem painel de ilustração lateral no MVP (ver UX-6).

### 4.6 Microcopy
| Elemento | Texto |
|---|---|
| Título (só leitor de tela) | "Entrar" |
| Tagline | "Localize o pico perfeito para andar de skate" |
| Botão | "Entrar" / carregando: (spinner, anúncio "Entrando") |
| Link de apoio | "Esqueci minha senha" |
| Divisor | "Não tem conta?" + "Cadastre-se" |
| Erro credenciais | "E-mail ou senha inválidos" |

---

## 5. Tela B - Cadastro em 3 passos (#25 mobile, #29 web)

**Objetivo:** criar a conta com o mínimo de atrito e de cansaço: cada passo tem 2 campos e uma só ideia, o progresso é visível, dá para voltar sem perder nada. Depois de criada, a pessoa vai ao Login (UX-15).

### 5.1 Estrutura comum aos 3 passos
Ordem vertical: `Tape`/`Halftone` (decoração) -> (passos 2 e 3) "← Voltar" -> `TitleBrand` "Criar conta" (é o `h1`) -> `Stepper` -> subtítulo do passo (`h2`, 20/26 Inter 600) -> campos -> (passo 3) aceite -> (se houver) `AlertBanner` de rede -> botão primário -> (passo 1) rodapé "Já tem conta? Entrar".

| Passo | Subtítulo (`h2`) | Campos | Botão |
|---|---|---|---|
| 1 | "Seus dados" | Nome (`firstName`), Sobrenome (`lastName`) | "Continuar" |
| 2 | "Seu e-mail" | E-mail, Confirmar e-mail | "Continuar" |
| 3 | "Crie sua senha" | Senha, Confirmar senha, aceite dos termos | "Criar conta" |

**Rotas web:** `/cadastro` (passo 1), `/cadastro/email` (passo 2), `/cadastro/senha` (passo 3). Cada passo é uma entrada de histórico, então o botão voltar do navegador volta ao passo anterior. Acesso direto ao passo 2 ou 3 sem os passos anteriores válidos redireciona ao passo 1. **Mobile:** uma única tela `Signup` com o passo em estado; o botão/gesto voltar do sistema (Android) e a seta "← Voltar" retornam ao passo anterior; no passo 1 saem da tela. Dados dos passos ficam em memória (Redux/form state compartilhado), **a senha nunca é gravada em armazenamento persistente**; recarregar a página web ou fechar o app reinicia o cadastro.

### 5.2 Campos e validação por passo
| Campo | Rótulo | Placeholder | Atributos | Validação |
|---|---|---|---|---|
| Nome | "Nome" | "Marina" | `autoComplete="given-name"`, `textContentType="givenName"`, `autoCapitalize="words"`, `maxLength` 40 | obrigatório "Informe seu nome."; só espaços igual; mínimo 2: "O nome precisa ter ao menos 2 caracteres." |
| Sobrenome | "Sobrenome" | "Souza" | `autoComplete="family-name"`, `textContentType="familyName"`, `autoCapitalize="words"`, `maxLength` 40 | "Informe seu sobrenome."; mínimo 2: "O sobrenome precisa ter ao menos 2 caracteres." |
| E-mail | "E-mail" | "voce@exemplo.com" | `autoComplete="email"`, `textContentType="emailAddress"` | "Informe seu e-mail."; formato: "Informe um e-mail válido." |
| Confirmar e-mail | "Confirmar e-mail" | "Repita o e-mail" | `autoComplete="off"` (evita o navegador preencher igual por engano), mesmos atributos de teclado | "Confirme seu e-mail."; diferente do e-mail: **"Os e-mails não coincidem."** (comparação sem espaços nas pontas e sem diferenciar maiúsculas) |
| Senha | "Senha" | - | `autoComplete="new-password"`, `textContentType="newPassword"`; `PasswordInput` | "Crie uma senha."; menos de 8: "A senha precisa ter ao menos 8 caracteres."; apoio fixo "Mínimo de 8 caracteres." |
| Confirmar senha | "Confirmar senha" | - | `autoComplete="new-password"`; `PasswordInput` (botão mostrar próprio) | "Confirme sua senha."; diferente: **"As senhas não coincidem."** |
| Aceite | texto do checkbox | - | `Checkbox` desmarcado por padrão | **"Aceite os termos para continuar."** |

**Regras de validação por passo**
- Tocar **Continuar** valida **só os campos do passo atual**. Se houver erro, não avança, o foco vai ao primeiro campo inválido (rola até ele no mobile) e o leitor de tela anuncia o erro. Se estiver tudo certo, avança, o foco vai ao `h2` do novo passo (`tabIndex=-1`) e é anunciado "Passo {n} de 3: {subtítulo}".
- Antes do primeiro envio do passo, cada campo valida no blur; depois do primeiro erro, revalida a cada digitação (regra 3.1). A confirmação (e-mail ou senha) revalida quando o **campo original muda** e a confirmação já foi preenchida.
- **Colar é permitido** em todos os campos, inclusive confirmações (bloquear colar prejudica gerenciadores de senha e acessibilidade); a confirmação existe para pegar erro de digitação, não para impedir o gerenciador.
- Ao voltar, os campos do passo anterior estão preenchidos e **sem mensagens de erro** (revalidam ao continuar).
- Na web, o passo é um `<form>`: Enter envia o passo. Mobile: último campo do passo `returnKeyType="next"`/`"go"` aciona o botão.

### 5.3 Aceite dos termos (passo 3, GP-099)
Texto: "Li e aceito os [Termos de uso] e a [Política de privacidade]." Fica depois das senhas e antes do botão.
- **Rótulo associado:** web `<input type="checkbox" id="accept-terms">` + `<label for="accept-terms">` com todo o texto (links dentro do label não alternam a caixa). Mobile: caixa + texto são um elemento `accessibilityRole="checkbox"` com `accessibilityLabel="Li e aceito os Termos de uso e a Política de privacidade"` e `accessibilityState.checked`; os dois links são elementos separados (`accessibilityRole="link"`) e também ações personalizadas ("Abrir Termos de uso", "Abrir Política de privacidade").
- **Alvo:** caixa de 24 px dentro de alvo 48x48; tocar no texto alterna; links têm alvo próprio de 48 de altura e **não** alteram a marcação.
- **Ordem de tabulação (passo 3):** Voltar -> Senha -> mostrar -> Confirmar senha -> mostrar -> checkbox -> "Termos de uso" -> "Política de privacidade" -> "Criar conta".
- **Estados:** padrão desmarcado; foco anel `focus`; marcado fundo `primary` + check `on-primary`; erro (enviar sem marcar) borda `error` + ícone + "Aceite os termos para continuar." em `error`, ligada ao checkbox por `aria-describedby`/`accessibilityLabel`, foco no checkbox se for o primeiro inválido, some ao marcar; loading (enviando) não interativa, mantendo a aparência, links desativados; desabilitado só durante o envio (opacidade 0.4 se aparecer desativado fora disso).
- **Links:** web abre em nova aba (`target="_blank"`, `rel="noopener"`, rótulo "(abre em nova aba)"); mobile abre a tela de leitura empilhada e, ao voltar, o cadastro está intacto (o estado fica no navigator).
- **Backend:** o signup recebe o aceite e a versão vigente dos termos e grava data e versão; sem aceite devolve `VALIDATION_ERROR`, que a tela mostra no aceite com o mesmo texto.

### 5.4 Envio final e erros (passo 3 -> servidor)
| Situação | Comportamento |
|---|---|
| **Enviando** | Botão "Criar conta" em `loading` (largura mantida), campos e checkbox somente leitura, "Voltar" e links desativados, anúncio "Criando sua conta". Impede cadastro duplicado. |
| **Sucesso** | Conta criada, **sem login** (UX-15): navega ao Login com `replace`, e-mail preenchido, foco na senha e `AlertBanner` success "Conta criada! Entre com seu e-mail e senha." Nada do cadastro (inclusive senha) permanece em memória. |
| **`EMAIL_ALREADY_EXISTS`** (só chega no envio final) | **Volta ao passo 2** (`replace` do passo, Stepper "Passo 2 de 3"), com o erro **no campo E-mail**: "Este e-mail já tem cadastro." + `TextLink` "Entrar" (leva ao Login com o e-mail preenchido); foco no campo E-mail e anúncio ao leitor de tela ("Voltamos ao passo 2: este e-mail já tem cadastro."). Confirmação de e-mail, nome, senha e aceite **preservados**; ao trocar o e-mail, a confirmação precisa coincidir de novo antes de continuar. |
| `VALIDATION_ERROR` com campo indicado | A tela **leva ao passo do campo** (`firstName`/`lastName` -> 1; `email` -> 2; `password`/`acceptedTerms` -> 3) e mostra a mensagem **do servidor** no campo (ver abaixo). Hoje o backend devolve `field: 'name'` (campo único); o mapeamento `firstName`/`lastName` -> passo 1 só vale depois da issue #97. Até lá, `name` leva ao passo 1 e a mensagem aparece no campo Nome. O aceite dos termos usa o campo `acceptedTerms` (passo 3). |
| `VALIDATION_ERROR` **sem `field`** (ou com campo desconhecido) | **Fallback:** `AlertBanner` de erro no **passo atual**, acima do botão, com a mensagem do servidor; sem mudar de passo, dados preservados. |

**Qual mensagem vale:** se o servidor rejeita algo que o cliente já tinha validado (regra diferente entre as duas pontas), vale a **mensagem do servidor**, que é a fonte de verdade; a validação do cliente existe só para poupar a ida à rede.
| **Erro de rede / servidor** | `AlertBanner` (3.2) acima do botão no passo 3 com "Tentar novamente"; permanece no passo 3; dados preservados. |

### 5.5 Layout
- **Mobile:** mesma casca do Login (fundo, `Tape`/`Halftone`, margens `space.8`), alinhada à esquerda, **sem centralização vertical** (o conteúdo começa abaixo da decoração, para os passos não "pularem" ao trocar). `TitleBrand` 30/36, `Stepper` logo abaixo. **Botão "Continuar"/"Criar conta" ancorado acima do teclado**: barra inferior fixa (fundo `bg`, padding `space.4`, safe-area) que acompanha o teclado (`KeyboardAvoidingView`/`KeyboardStickyView`; no Android `adjustResize`), conteúdo rolável atrás com `paddingBottom` suficiente. Motivo: num passo de 2 campos o polegar já está perto e o botão nunca depende de rolagem; o passo 3, mais longo, rola por trás da barra. Se o Dev constatar problema técnico com a barra fixa, o fallback aceitável é o botão fluir após o último campo (como no Login), sem mudar a spec visual.
- **Transição entre passos:** deslizar horizontal de 200 ms (sentido do avanço/retorno); com "reduzir movimento", fade de 120 ms.
- **Web:** coluna de 400 px centralizada (sem card), `Tape`/`Halftone` nos cantos; "← Voltar" no topo da coluna; botão largura total logo após o último campo do passo; altura do conteúdo varia por passo, e o bloco permanece centralizado.
- Tela rola com 130% de fonte; o texto do aceite quebra sem truncar.

### 5.6 Microcopy
| Elemento | Texto |
|---|---|
| Título | "Criar conta" |
| Indicador | "Passo 1 de 3", "Passo 2 de 3", "Passo 3 de 3" |
| Subtítulos | "Seus dados", "Seu e-mail", "Crie sua senha" |
| Botões | "Continuar" (passos 1 e 2), "Criar conta" (passo 3), "← Voltar" |
| Rótulos | "Nome", "Sobrenome", "E-mail", "Confirmar e-mail", "Senha", "Confirmar senha" |
| Apoio da senha | "Mínimo de 8 caracteres." |
| Erros de confirmação | "Os e-mails não coincidem.", "As senhas não coincidem." |
| E-mail duplicado | "Este e-mail já tem cadastro." + "Entrar" |
| Aceite | "Li e aceito os Termos de uso e a Política de privacidade." / erro "Aceite os termos para continuar." |
| Rodapé (passo 1) | "Já tem conta?" + "Entrar" |

---

## 6. Tela C1 - Esqueci minha senha (#32)

**Objetivo:** pedir o código sem revelar se o e-mail existe.

### 6.1 Hierarquia
1. Botão/ícone voltar (mobile: seta no cabeçalho do stack, alvo 48; web: `TextLink` "Voltar para entrar" no topo da coluna)
2. `h1`: "Esqueceu a senha?"
3. Texto `body` `text-muted`: "Informe o e-mail da sua conta. Se ele estiver cadastrado, enviamos um código de 6 dígitos."
4. Campo **E-mail** (preenchido com o que estava no Login, se houver)
5. (Condicional) `AlertBanner` de rede/servidor
6. Botão primário "Enviar código"

### 6.2 Estados
| Estado | Comportamento |
|---|---|
| Padrão | Foco no e-mail na web. |
| Erro de campo | Vazio: "Informe seu e-mail."; malformado: "Informe um e-mail válido." |
| Enviando | Botão `loading`, campo somente leitura, anúncio "Enviando código". |
| **Sucesso (sempre igual)** | Grava o horário do envio (ver "Contagem do reenvio" na tela C2), e então toast `info`/`success` de 4 s: **"Se o e-mail estiver cadastrado, enviamos um código."** e navega para C2. A mensagem e a navegação são **idênticas** quer a conta exista ou não, e o tempo de resposta percebido também (o backend deve responder igual; a tela não tem nenhum outro ramo). Toast com `aria-live="polite"`; como a tela muda, o mesmo texto aparece de forma fixa em C2 (ver 7.1) para o leitor de tela e para quem perdeu o toast. |
| Erro de rede | Banner 3.2 com "Tentar novamente". |

### 6.3 Layout
- Mobile: mesma casca do Login, sem wordmark grande (cabeçalho com seta voltar + título). Web: mesma coluna de 400 px. Título em `TitleBrand`.
- Atributos do campo: `autoComplete="email"`, `textContentType="emailAddress"`, `returnKeyType="go"`.

### 6.4 Microcopy
| Elemento | Texto |
|---|---|
| Título | "Esqueceu a senha?" |
| Explicação | "Informe o e-mail da sua conta. Se ele estiver cadastrado, enviamos um código de 6 dígitos." |
| Botão | "Enviar código" |
| Voltar (web) | "Voltar para entrar" |
| Toast | "Se o e-mail estiver cadastrado, enviamos um código." |

---

## 7. Tela C2 - Redefinir senha (#32)

**Objetivo:** digitar o código, definir a nova senha e voltar ao Login. Código + nova senha + confirmação ficam na **mesma tela** (como pede a issue), para a pessoa não perder o contexto nem precisar de uma 4ª tela.

### 7.1 Hierarquia
1. Voltar (para C1, para corrigir o e-mail)
2. `h1`: "Digite o código"
3. Texto de apoio: **"Se o e-mail estiver cadastrado, enviamos um código de 6 dígitos para {e-mail}. Ele vale por 15 minutos."** (e-mail exibido em `body-strong`)
4. Campo **Código** (campo único, ver UX-5)
5. Campo **Nova senha** (`PasswordInput`) + apoio "Mínimo de 8 caracteres."
6. Campo **Confirmar nova senha** (`PasswordInput`)
7. (Condicional) `AlertBanner` de rede/servidor
8. Botão primário "Redefinir senha"
9. Linha de reenvio: "Não chegou?" + `TextLink` "Reenviar código". **Ao abrir C2 a contagem já está rodando**, então a linha abre como "Reenviar código em 30s" (texto desativado) e vira link ao chegar a zero.

### 7.2 Campos
| Campo | Rótulo | Atributos | Validação |
|---|---|---|---|
| Código | "Código de 6 dígitos" | `inputMode="numeric"` / `keyboardType="number-pad"`, `autoComplete="one-time-code"`, iOS `textContentType="oneTimeCode"`, `maxLength` 6, `autoCapitalize="none"`; fonte `h2` com `letter-spacing` positivo (4 px) e `tabular-nums`, alinhado à esquerda; aceita colar com espaços/traço (remove tudo que não for dígito) | vazio ou menos de 6 dígitos: "Digite os 6 dígitos do código." |
| Nova senha | "Nova senha" | `autoComplete="new-password"`, `textContentType="newPassword"` | vazio: "Crie uma nova senha."; menos de 8: "A senha precisa ter ao menos 8 caracteres." |
| Confirmar nova senha | "Confirmar nova senha" | `autoComplete="new-password"` | diferente: **"As senhas não coincidem."** (valida no blur do campo e revalida quando a nova senha muda) |

Quando o código chega pelo SMS/e-mail e o sistema oferece o preenchimento automático (iOS sugere código na barra do teclado), ele preenche o campo único sem esforço: motivo da decisão UX-5.

### 7.3 Estados
| Estado | Comportamento |
|---|---|
| Padrão | Foco no Código na web; no mobile, abre o teclado numérico no Código (aqui faz sentido: é a única ação possível e a pessoa acabou de pedir o código). |
| Erros de campo | Conforme 3.1. |
| Enviando | Botão `loading` ("Redefinindo"), campos somente leitura, "Reenviar código" desativado. |
| **Código inválido, expirado ou já usado** (`INVALID_RESET_CODE`) | Erro no campo Código: **"Código inválido ou expirado."** e, na linha de reenvio, `TextLink` "Reenviar código" em destaque (a linha passa a ser `body-strong`); **o destaque respeita a contagem**: se ainda houver espera, a linha continua desativada com o tempo restante ("Reenviar código em {n}s") e só ganha o destaque quando o link é liberado. O servidor não diz se foi inválido ou expirado (não deve), por isso a mensagem cobre os dois. Nova senha e confirmação preservadas. O campo Código fica com foco e texto selecionado. |
| **5 tentativas erradas** | O cliente conta as falhas `INVALID_RESET_CODE` da sessão da tela. Na 5a, o campo Código e o botão ficam desabilitados e aparece `AlertBanner` error: **"Muitas tentativas incorretas. Peça um novo código."** com a ação "Reenviar código", **que também respeita a contagem**: durante a espera aparece desativada com o tempo restante ("Reenviar código em {n}s") e é liberada ao zerar. Como o servidor invalida o código nesse ponto, qualquer dígito digitado já não adiantaria. Se a pessoa sair e voltar, o contador do servidor continua valendo (o cliente mostra o erro padrão de código inválido e a opção de reenviar). Não exibimos "restam N tentativas" (não é exigido e ajuda a atacante). **Foco:** como o campo Código e o botão ficam desabilitados, o foco vai para o `AlertBanner` (que é `role="alert"`, então o leitor anuncia o texto) e, se a ação estiver liberada, fica nela (o único controle útil naquele momento); se a contagem ainda estiver rodando, o foco fica no próprio banner e a ação é liberada e anunciada quando zerar. Depois do reenvio, o foco volta ao campo Código já reabilitado e limpo. |
| **Contagem do reenvio (30 s)** | Começa em **todo envio de código**: ao sair de C1 para C2 e a cada reenvio. Por isso C2 abre já com "Reenviar código em 30s". Durante a contagem toda ação de reenviar (a linha de reenvio, o destaque do erro de código inválido e a ação do banner da 5a tentativa) aparece **desativada com o tempo restante**. O **horário do último envio fica guardado** (mobile: armazenamento local do app; web: `sessionStorage`/estado persistido), e o restante é calculado como 30 s menos o tempo decorrido; assim a contagem sobrevive a sair e voltar da tela, a recarregar a página e a fechar e reabrir o app. Se já passaram 30 s, abre liberado. O contador visível atualiza a cada segundo, mas o leitor de tela só é avisado no início e quando libera ("Já é possível reenviar o código"). |
| **Reenviar código** | Disponível só com a contagem zerada. Toque chama o mesmo pedido de C1, mostra toast **"Se o e-mail estiver cadastrado, enviamos um novo código."**, limpa o campo Código e o contador de tentativas, **grava o novo horário de envio** e reinicia a contagem de 30 s (link vira texto desativado "Reenviar código em 30s"). Códigos anteriores deixam de valer (regra do backend), o que o texto do toast informa de forma implícita ("novo código"). |
| **Erro de rede** | Banner 3.2 com "Tentar novamente". |
| **Sucesso** | Navega ao Login (A) com `replace`, e-mail preenchido, foco na senha, `AlertBanner` success **"Senha alterada. Entre com a nova senha."** Não fazemos login automático: a issue pede voltar ao Login, e entrar com a senha nova confirma que ela foi anotada/memorizada. |
| Senha igual à antiga | Sem tratamento (o backend não distingue). |
| Conta desativada | Sem diferença na tela (regra do backend: redefinir não reativa, o próximo login reativa). |

### 7.4 Layout
- **Mobile:** cabeçalho com seta voltar; campos em coluna; tela rola com o teclado aberto; teclado inicial numérico no Código, depois "next" para as senhas; botão no fim do conteúdo.
- **Web:** coluna de 400 px; "Voltar" no topo da coluna. Título em `TitleBrand`. Ordem de tab: Código -> Nova senha -> mostrar -> Confirmar -> mostrar -> Redefinir senha -> Reenviar código.

### 7.5 Microcopy
| Elemento | Texto |
|---|---|
| Título | "Digite o código" |
| Apoio | "Se o e-mail estiver cadastrado, enviamos um código de 6 dígitos para {e-mail}. Ele vale por 15 minutos." |
| Rótulos | "Código de 6 dígitos", "Nova senha", "Confirmar nova senha" |
| Botão | "Redefinir senha" |
| Reenvio | "Não chegou?" + "Reenviar código" (liberado) / "Reenviar código em {n}s" (em contagem, a tela abre assim) |
| Erro código | "Código inválido ou expirado." |
| Erro tentativas | "Muitas tentativas incorretas. Peça um novo código." |
| Toast reenvio | "Se o e-mail estiver cadastrado, enviamos um novo código." |

---

## 7A. Telas D e E - Termos de uso e Política de privacidade (#90)

**Objetivo:** permitir ler os textos antes de aceitar, sem login. O conteúdo jurídico é fornecido pelo dono; a estrutura entra agora com **texto provisório marcado como tal**.

**Hierarquia (iguais nas duas telas):**
1. Cabeçalho: voltar + título (`h1`): "Termos de uso" / "Política de privacidade".
2. `AlertBanner` info fixo no topo (não dispensável): **"Texto provisório. O conteúdo definitivo será publicado antes do lançamento."** Sai quando o texto real for entregue.
3. Metadado em `body-sm` `text-muted`: "Versão {versão} - atualizado em {data}" (a mesma versão que o cadastro envia no aceite).
4. Corpo: seções com `h2` e parágrafos `body` (16/24). Seções-modelo: "Quem somos", "Dados que coletamos", "Como usamos seus dados", "Seus direitos", "Contato", cada uma com "[Texto provisório]". Estrutura real de títulos, para o leitor de tela navegar por seções.
5. Rodapé com link cruzado: "Ler também: Política de privacidade" / "Termos de uso".

**Estados:** conteúdo estático embutido (sem rede): sem loading nem erro de rede. Se um dia vier de endpoint, vale o padrão da seção 3.2. Não há botão "Aceitar": o aceite é só no cadastro.

**Web:** `/termos` e `/privacidade`, sem guard, coluna de leitura com `max-width` 720 (cerca de 70 caracteres), wordmark que leva a `/`, link "Voltar para o cadastro" (`/cadastro`). Título da aba "Termos de uso - GoPicos".
**Mobile:** tela empilhada no stack de autenticação, rolável, com seta voltar e safe-area. A issue admite "tela ou link para a web"; recomendamos **tela nativa** (funciona offline, não tira a pessoa do app, mantém o formulário no navigator). As páginas web continuam necessárias como URL pública exigida pelas lojas.

**Acessibilidade:** `h1` > `h2`; contraste padrão; leitura a 130% sem rolagem horizontal.

---

## 8. Diferenças entre mobile e web

| Tema | Mobile | Web |
|---|---|---|
| Casca | Tela cheia em `bg`, conteúdo alinhado à esquerda, centralizado na vertical no Login e rolagem quando não cabe | Coluna de 400 px centralizada, sem card, a partir de `sm`; abaixo disso igual ao mobile |
| Teclado | `KeyboardAvoidingView`, `returnKeyType`, `keyboardType`, teclado não abre sozinho (exceto no Código) | `<form>`, Enter envia, `autofocus` no primeiro campo, `inputMode` |
| Safe-area | `useSafeAreaInsets` em cima e embaixo | não se aplica (usar `env(safe-area-inset-*)` apenas se a página for usada como PWA, fora do MVP) |
| Sessão | Token no Keychain; `reset` do navigator para a Home | Token persistido (decisão técnica do Dev; sugerimos armazenamento que sobreviva ao fechamento da aba); `navigate(rotaPretendida ?? '/home', { replace: true })` (Home como fallback) |
| Termos e privacidade | Tela nativa empilhada; ao voltar, o cadastro está intacto | Nova aba em `/termos` e `/privacidade`; o formulário continua na aba original |
| Voltar | Seta no cabeçalho + gesto/botão do sistema; no cadastro volta de passo | `TextLink` "Voltar" + botão voltar do navegador (cada passo do cadastro é uma rota) |
| Cadastro em passos | Tela única com passo em estado; botão ancorado acima do teclado | Rotas `/cadastro`, `/cadastro/email`, `/cadastro/senha`; botão após o último campo |
| Voltar ao Login após sucesso | `replace`, sem voltar ao formulário de reset | `replace`, idem |
| Preenchimento | Teclado do sistema sugere senha, código, e-mail | Gerenciador de senha do navegador (`autocomplete`); `name`/`id` estáveis nos inputs |
| Toast | Topo da tela, abaixo da safe-area | Canto superior direito, `aria-live="polite"` |
| Foco do leitor de tela | Foco no título ao abrir a tela | `h1` recebe `tabIndex={-1}` e foco ao trocar de rota |
| Hover | não existe | Botão e links com hover (`primary-hover`) |

Mesmo em web e mobile: nomes de componentes, microcopy, regras de validação, ordem dos campos, estados e tokens.

## 9. Acessibilidade (checklist de aceite)
- Todos os campos com rótulo associado (`<label for>` / `accessibilityLabel`); placeholders não carregam informação essencial.
- Erros: ícone + texto + `aria-invalid`; anunciados ao enviar (`role="alert"` / `AccessibilityInfo.announceForAccessibility`).
- Alvos de toque >= 48 (inclusive o olho de mostrar senha e os `TextLink`).
- Contrastes (já verificados no DS): texto de erro `error` (escuro) sobre `surface` 7,57; `primary-text` sobre `bg` 5,43 no claro e 11,22 no escuro (valores do DS v2.0); borda de campo `border` >= 3:1.
- O Login não distingue "e-mail inexistente" de "senha errada" nem visual nem semanticamente (nem em `aria-invalid`).
- Toda funcionalidade por teclado na web; sem armadilhas de foco.
- Nunca bloquear colar nos campos de senha ou do código.
- Leitor de tela anuncia "carregando"/"entrando" via `aria-busy` + região `aria-live`.

## 10. Decisões e justificativas

**UX-1. Login e cadastro em telas separadas, ligadas por link, sem abas.** Abas alternando "Entrar | Criar conta" escondem a ação principal (cada tela quer um botão principal diferente) e complicam foco e estado. Telas separadas dão URL própria na web (`/cadastro`, atende #29) e título claro para leitores de tela.

**UX-2. Conta reativada: mostrar aviso, leve (toast na Home).** Aprovado pelo dono (UX-14). Quem desativou a conta pode ter esquecido; entrar e ver tudo "de volta" sem explicação pode confundir, e é uma mudança de estado da conta que a pessoa tem o direito de saber. Porém, **bloquear o login com confirmação** ("sua conta está desativada, deseja reativar?") seria contrário à regra de negócio do backlog (a reativação é automática no login) e adicionaria atrito. Então: login segue normal e, na Home, um toast de 4 s: "Bem-vindo de volta! Sua conta foi reativada." O backend devolve `reactivated: boolean` no login (issue #23) e a tela mostra o toast só quando for `true`.

**UX-3. (substituída por UX-15).** A proposta inicial de login automático após o cadastro foi rejeitada pelo dono.

**UX-4. (substituída por UX-24).** A proposta inicial de cadastro sem confirmação de senha foi trocada pela decisão do dono: confirmação de senha no passo 3.

**UX-5. Código em campo único, não em 6 caixinhas.** Seis caixas são bonitas mas frágeis: quebram colar, preenchimento automático do iOS/Android (`oneTimeCode`), uso de leitor de tela, correção com backspace e fonte escalada. Um único campo com espaçamento entre letras entrega a mesma leitura visual com todos os recursos do sistema funcionando, e é mais simples de implementar nas duas plataformas.

**UX-6. Web: coluna centralizada (sem card), sem ilustração lateral.** (Atualizada com o modelo do dono: sem card.) Não há logo, fotos nem identidade ilustrada definidas; uma coluna decorativa seria preenchida com um retângulo vazio. Card centralizado reaproveita 100% do layout mobile em telas pequenas e facilita manutenção. Ideia pós-MVP: painel lateral com foto de pico quando houver acervo.

**UX-7. Botão sempre habilitado antes do envio.** Botão cinza por padrão não explica o que falta, especialmente com sol forte (princípio 1 do DS). O envio dispara a validação e leva o foco ao primeiro erro. O desabilitado fica reservado para o estado "enviando" (exigência das issues) e para as tentativas esgotadas.

**UX-8. Erro "E-mail ou senha inválidos" num banner, sem destacar campos.** Cumpre a regra de não revelar qual dado falhou e evita a ambiguidade de pintar os dois campos de vermelho. A senha permanece (não apagamos o que a pessoa digitou, #28) mas selecionada para facilitar a correção.

**UX-9. Mensagem neutra e navegação idêntica em "Esqueci minha senha".** Qualquer diferença (texto, tempo, tela) permite descobrir e-mails cadastrados. Por isso o toast é fixo e C2 repete o texto "Se o e-mail estiver cadastrado...". O custo é que quem errou o e-mail só percebe quando o código não chega; mitigamos com o botão "Voltar" em C2 (corrigir e-mail) e o "Reenviar código".

**UX-10. Contagem de tentativas no cliente e espera de 30 s no reenvio.** A regra de 5 tentativas é do servidor; o cliente só a espelha para não deixar a pessoa digitando num código já morto. A espera de 30 s no "Reenviar" evita toques repetidos que geram vários e-mails e dão a impressão de que "não funciona"; é puramente de UX (o backend deve aplicar o seu próprio limite). **Aprovada pelo dono (UX-16) e agora critério de aceite da issue #32.**

**UX-11. Nenhuma tela de auth usa o mapa ou imagens.** O DS diz que o mapa é o protagonista, mas aqui ainda não há mapa e o acesso é obrigatório (D10 do backlog); o foco é o formulário.

**UX-12. Mensagens de erro de rede em banner persistente, não toast.** Exigem ação ("Tentar novamente") e o DS proíbe sumir sozinho.

**UX-13. (substituída por UX-21).** O wordmark provisório foi substituído pelo logo do modelo do dono com a fonte display da camada de marca.

**UX-14. Aviso de conta reativada: sim (decisão do dono).** Ver UX-2.

**UX-15. Cadastro não entra logado (decisão do dono).** Após criar a conta, vai ao Login com e-mail preenchido, foco na senha e aviso "Conta criada! Entre com seu e-mail e senha.". Separa criação de acesso e simplifica o backend (signup não devolve token). Custo de UX: uma digitação de senha a mais; mitigado por e-mail preenchido, foco na senha e gerenciadores de senha, que oferecem salvar a credencial no cadastro e preenchê-la no Login (`new-password` -> `current-password`).

**UX-16. Espera de 30 s no "Reenviar código" (decisão do dono).** Critério de aceite da issue #32. Ver UX-10.

**UX-17. Termos de uso e política de privacidade no MVP (decisão do dono, issue #90).** Aceite obrigatório no cadastro, enviado ao backend (data e versão gravadas), e páginas de leitura públicas. Decisões de design: caixa **desmarcada por padrão** (consentimento deve ser ato ativo; exigência comum das lojas e da LGPD), links separados do toque da caixa para não marcar sem querer, links da web em nova aba para não perder o formulário, tela nativa no mobile para funcionar offline, banner fixo de "texto provisório" para ninguém confundir o modelo com o texto jurídico.

**UX-18. Rota pretendida e banner de sessão expirada (QA).** Voltar à rota pretendida (GP-028) evita perder o contexto de quem abriu um link; o banner de sessão expirada só aparece quando havia token salvo, porque "sessão expirou" para quem nunca entrou seria falso e confuso.

**UX-19. Sem mensagem de "muitas tentativas" no Login (QA).** Não há limite de tentativas de login no backend nem no backlog; uma mensagem sem erro real que a dispare seria código morto e promessa falsa.

**UX-20. Login segue o modelo do dono.** Marca no topo, campos em duas linhas com rótulo acima, link de apoio sublinhado à direita, botão de largura total, divisor e link de cadastro, tudo centralizado na vertical. Diferenças deliberadas: (a) campos de 48 px e fonte 16 em vez de 35 px e 12 px (alvo de toque e legibilidade sob sol; o iOS dá zoom em fonte de input menor que 16); (b) borda `border` mantida nos campos (campo branco sobre `bg` frio tem cerca de 1,1:1, abaixo dos 3:1 de AA para componentes); (c) rótulo em 14 px, não 12; (d) botão laranja com texto escuro (branco sobre laranja vivo reprova AA; ver DS D11); (e) "Cadastre-se" e "Esqueci minha senha" com o mesmo texto do modelo.

**UX-21. Camada de marca nas telas de entrada.** Seguindo a diretriz do dono (skatistas, grafite e tags): `Wordmark` e `TitleBrand` em fonte display (Permanent Marker, Apache 2.0), traço de spray, fita e meio-tom. Ficam **fora da área do formulário** e atrás de nada; campos, rótulos, botões, erros e mensagens permanecem em Inter, limpos. Sem imagens raster (SVG leves).

**UX-22. Cadastro em 3 passos.** Passos curtos de 2 campos reduzem a sensação de formulário longo e dão pontos de recuperação de erro (cada passo valida sozinho). Custo: mais toques; mitigado por botão sempre à mão (ancorado acima do teclado no mobile), voltar sem perda e progresso visível ("Passo n de 3", texto + barra, nunca só cor).

**UX-23. Confirmação de e-mail no passo 2.** Pedido do dono; evita conta criada com e-mail errado (que não receberia o código de recuperação). Colar permitido para não prejudicar acessibilidade e gerenciadores.

**UX-24. Confirmação de senha no passo 3 (decisão do dono, substitui UX-4).** Cada campo de senha tem seu botão "mostrar". A validação ocorre **antes de enviar** (ao sair da confirmação e ao tocar "Criar conta"), com "As senhas não coincidem.". Justificativa do dono respeitada; a única ressalva de UX é o custo de digitar duas vezes no celular, que o botão mostrar e o gerenciador de senha atenuam.

**UX-25. `EMAIL_ALREADY_EXISTS` volta ao passo 2.** O erro só chega no envio final (passo 3), mas o campo culpado está no passo 2; levar a pessoa ao campo com o erro e preservar o resto é melhor do que mostrar um erro no passo 3 sobre um campo que não está na tela.

**UX-26. Nome e sobrenome separados (`firstName`, `lastName`).** O backend armazenará separado (decisão do dono); a tela pede os dois e o app pode derivar o nome de exibição. Atributos de preenchimento automático `given-name`/`family-name`.

**UX-27. Borda de campo e tamanhos acima do modelo.** Ver UX-20 (a) e (b); alternativa sem borda possível se o dono aceitar contraste menor, não recomendada.

**UX-28. Botão ancorado no mobile só nos passos do cadastro.** No Login o botão flui (um passo, formulário curto); nos passos o polegar fica no teclado e o avanço é a ação constante, então a barra fixa compensa.

## 11. Ideias pós-MVP
- Login com Apple/Google e biometria (Face ID/impressão digital) para reentrar.
- Verificação de e-mail no cadastro (GP-096).
- Medidor de força da senha e verificação contra senhas vazadas.
- Reaceite quando a versão dos termos mudar (o backend já grava a versão).
- Limite de tentativas de login com mensagem própria, se o backend vier a limitar.
- Painel lateral com foto de pico na web.
- Link direto do e-mail com o código preenchido (deep link).
- Toggle de tema.

## 12. Pendências para o dono
Decididas: UX-14 a UX-17 e UX-23/24 (confirmações), 22 (passos). Dependem do PR #100 (DS v2.0). Resta apenas:
1. Aprovar a **direção de marca** de grafite/skate (fonte Permanent Marker, spray, fita, meio-tom, sticker) vista na prancha "Marca - direção" do Figma.
2. Confirmar **texto escuro sobre o laranja** do botão (recomendado, AA) ou preferir texto branco com laranja mais escuro (DS D11).
3. Confirmar a borda nos campos (UX-27) apesar de o modelo não ter borda.
4. Conteúdo jurídico definitivo dos Termos e da Política (texto provisório hoje) e logo final (usamos o glifo do modelo).

## 13. Figma
Arquivo do DS: https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN
Página **Telas** (antes "Autenticação v2") (frames de referência com a camada de marca aplicada; a fonte de verdade é este texto). Nos frames, o glifo do skatista é uma versão simplificada; o arquivo oficial é `docs/design/assets/logo-gopicos.svg`.
- Login: mobile claro https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-2 | mobile escuro https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-93 | web claro https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-184 | web escuro https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-324
- Cadastro passo 1: https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-464 | https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-547 | https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-630 | https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-762
- Cadastro passo 2 (erro de e-mails diferentes): https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-894 | https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-976 | https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-1058 | https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-1189
- Cadastro passo 3 (erro de senhas e aceite): https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-1320 | https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-1416 | https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-1512 | https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-1657
- Prancha de direção de marca (moodboard e componentes): https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=22-3
Modelo do dono (referência): https://www.figma.com/design/3VexamkeziZHB1RPfTKedg/GO-picos?node-id=16-37
- Esqueci minha senha (mobile claro | mobile escuro | web claro): https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=25-2 | https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=25-18 | https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=25-34
- Redefinir senha, com contagem "Reenviar código em 30s" e erro de confirmação (mobile claro | mobile escuro | web claro): https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=25-51 | https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=25-85 | https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=25-119
- Termos de uso (Política de privacidade segue o mesmo layout): https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=25-154 | https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=25-177 | https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=25-200
A página do arquivo agora se chama **Telas** (ids dos frames inalterados) e também abriga as telas de Picos. Não desenhados (descritos só no texto): estados de loading e de rede, e a Política de privacidade (mesmo layout dos Termos).
