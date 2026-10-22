# Spec de UX - Telas de autenticação (mobile e web)

Issues: #24 (GP-022 login mobile), #25 (GP-023 cadastro mobile), #28 (GP-026 login web), #29 (GP-027 cadastro web), #32 (GP-098 recuperar senha, mobile e web), #90 (GP-099 termos de uso e política de privacidade).
Nomenclatura: as decisões desta spec são **UX-1 a UX-19** (seção 10), para não colidir com as decisões D1 a D13 do backlog do PO. Referências a "D" do backlog dizem "do backlog".
Base: `docs/design/design-system.md` (tokens, componentes e regras). Esta spec **não define cor, fonte, espaço ou raio novos**: só usa tokens do DS.
Figma: ver seção 13.

Regras de negócio que moldam as telas (backlog do PO, decisões D1, D4 e D8 do backlog):
- Cadastro: nome, e-mail e senha com no mínimo 8 caracteres. Não existe nickname.
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
- B -> D / E: os links do aceite abrem as telas de leitura sem perder o que foi digitado em B (ver tela B e seção 7A).
- A -> destino: depois do login, a pessoa vai para a **rota pretendida** (a que tentou abrir antes de ser mandada ao Login, GP-028 / #30) e, se não houver, para a Home. No mobile vale o mesmo para links profundos futuros; no MVP o destino é a Home.

## 2. Componentes do DS usados (e o que falta)

Usados como definidos na seção 8 do DS: `Button` (primary lg, ghost/link), `Input` (altura 48, fonte 16, rótulo sempre visível, erro com borda `error` + ícone + mensagem), `Toast`, estados de loading.

Necessários que o DS ainda não detalha (devem entrar em GP-002/003; spec abaixo para o Dev e o UX não divergirem):

| Componente | Definição |
|---|---|
| `PasswordInput` | `Input` com botão à direita (alvo 48x48) que alterna mostrar/ocultar. Ícone olho / olho cortado. `aria-label`/`accessibilityLabel`: "Mostrar senha" / "Ocultar senha"; `aria-pressed`/`accessibilityState.checked` reflete o estado. Começa oculta. |
| `AlertBanner` | Bloco inline que não some sozinho. **Borda total de 1,5 px** na cor da variante (`error`, `success` ou `info`) **mais uma faixa de acento de 4 px à esquerda**, na mesma cor (a faixa e o ícone reforçam a cor sem depender só dela). Fundo `sunken`, raio `md`, padding `space.3` (12). **Ícone 20x20** (alerta, check, info) alinhado ao topo da primeira linha, `space.2` de distância do texto, na cor da variante. **Tipografia:** `body-sm` (14/20) em `text` (contraste de `text`/`sunken` já verificado no DS). **Ação opcional** ("Tentar novamente", "Reenviar código"): `TextLink` em `label` (14/20, 600), alvo mínimo 48 de altura. Layout: ícone + texto em linha; a ação fica **à direita** apenas quando cabe sem quebrar o texto em mais de 2 linhas; caso contrário, e sempre com fonte em 130% ou largura menor que 360, **a ação quebra para uma linha própria, abaixo do texto, alinhada à esquerda do texto** (ao lado do ícone, não sob ele). Nunca truncar o texto. `role="alert"` para `error`, `role="status"` para `success`/`info`. |
| `TextLink` | Texto em `primary-text`, peso 600, **sempre sublinhado** (distingue de texto comum sem depender de cor). Alvo mínimo 48 de altura no mobile (`hitSlop`); na web, altura mínima de 24 px com padding vertical para chegar a 44 em linhas isoladas. **Estados:** default `primary-text`; hover (web) `primary-hover`; **pressed** (mobile e web) `primary-hover` + opacidade 0.8; **focus** (teclado/leitor) anel `focus` de 2 px com `offset` 2 px e raio `sm`, nunca removido; desativado (durante envio ou espera) `text-subtle`, sem sublinhado, `aria-disabled`. **Dentro de mensagem de erro** (ex.: "Este e-mail já tem cadastro. Entrar"): o texto do erro continua em `error` e o link fica em `primary-text` sublinhado, na mesma linha; se não couber, o link quebra para a linha seguinte junto com a mensagem, mantendo a ordem de leitura. O link faz parte do mesmo parágrafo do erro, então o leitor de tela lê "Este e-mail já tem cadastro. Entrar" e o link é alcançável por tab logo depois do campo. |
| `AuthLayout` | Casca das 4 telas: wordmark + título + conteúdo. Uma implementação por plataforma (ver seções 3 e 4). |
| `Checkbox` | Caixa 24x24 visual dentro de alvo 48x48; raio `sm`; borda `border` 2 px; marcado = fundo `primary` e check em `on-primary`; foco = anel `focus`; erro = borda `error` + mensagem; desativado = opacidade 0.4. Rótulo ao lado em `body`, clicável (alterna). Usado no aceite dos termos. |
| `Wordmark` (placeholder) | Texto "GoPicos" em `display` 700: "Go" em `text`, "Picos" em `primary-text`. Contraste de `primary-text` sobre `bg`: 6,80 claro / 9,59 escuro (AA). Quando houver logo definitivo, troca-se só este componente. `accessibilityRole="header"` não se aplica; é decorativo-informativo com `aria-label="GoPicos"`. |

## 3. Padrões comuns (valem para as quatro telas)

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

**Objetivo:** entrar rápido. Quem já tem conta quase sempre usa gerenciador de senha ou biometria do sistema; a tela precisa ser curta e previsível.

### 4.1 Hierarquia (de cima para baixo)
1. `Wordmark`
2. Título `h1`: "Entrar"
3. Subtítulo `body` em `text-muted`: "Bem-vindo de volta. Encontre e avalie picos de skate."
4. (Condicional) `AlertBanner` de contexto: sessão expirada, cadastro concluído, senha alterada, conta reativada (ver estados)
5. Campo **E-mail**
6. Campo **Senha** (`PasswordInput`) com `TextLink` "Esqueci minha senha" alinhado à direita, **abaixo** do campo (fica no caminho do polegar e não disputa linha com o rótulo)
7. (Condicional) `AlertBanner` de erro de rede/servidor
8. Botão primário "Entrar"
9. Rodapé: "Não tem conta?" + `TextLink` "Criar conta"

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
| **Conta reativada** | Decisão UX-14: toast na Home (o login devolve `reactivated: true`), **"Bem-vindo de volta! Sua conta foi reativada."** |

### 4.4 Layout mobile
- Tela em `bg`, conteúdo em `ScrollView` com `keyboardShouldPersistTaps="handled"` dentro de `KeyboardAvoidingView` (iOS `padding`; Android `adjustResize`). Gutter `space.4`, conteúdo alinhado à esquerda (leitura mais rápida e menos "landing page").
- Wordmark no topo com `space.10` de margem superior abaixo da safe-area; título logo abaixo.
- **Botão "Entrar" e rodapé fluem logo após o último campo** (não fixos no pé da tela): com teclado aberto o botão fica visível porque a tela rola; se fosse fixo no rodapé, o teclado o empurraria sobre os campos em telas pequenas. Em telas altas, o conteúdo é ancorado no topo e sobra espaço embaixo.
- Safe-area: padding superior e inferior respeitam `useSafeAreaInsets`; o `ScrollView` tem `paddingBottom = inset.bottom + space.6`.
- Botão: largura total, `lg` 48, `radius.md`. `TextLink`s com alvo 48.
- Biometria e login social: fora do MVP.

### 4.5 Layout web
- `bg` na viewport; formulário num `Card` (`surface`, raio `lg`, `elevation.1`, borda `divider`) **centralizado** horizontal e verticalmente (a partir de `sm`, 640 px), largura máxima 420 px, padding `space.8` (`space.6` abaixo de 640 px). Abaixo de `sm` o card perde borda/sombra e ocupa a tela com gutter `space.4`: vira a mesma tela do mobile.
- Wordmark acima do card, centralizado, `space.6` de distância.
- Título e textos dentro do card ficam alinhados à esquerda; botão largura total do card.
- Tab/Enter: ordem e-mail -> senha -> mostrar senha -> "Esqueci minha senha" -> Entrar -> "Criar conta".
- Sem painel de ilustração lateral no MVP (ver UX-6).

### 4.6 Microcopy
| Elemento | Texto |
|---|---|
| Título | "Entrar" |
| Subtítulo | "Bem-vindo de volta. Encontre e avalie picos de skate." |
| Botão | "Entrar" / carregando: (spinner, anúncio "Entrando") |
| Link | "Esqueci minha senha" |
| Rodapé | "Não tem conta?" + "Criar conta" |
| Erro credenciais | "E-mail ou senha inválidos" |

---

## 5. Tela B - Cadastro (#25 mobile, #29 web)

**Objetivo:** criar a conta com o mínimo de atrito: três campos, sem confirmação de senha (ver UX-4), mais o aceite dos termos. Depois de criada, a pessoa vai ao Login (UX-15).

### 5.1 Hierarquia
1. `Wordmark`
2. Título `h1`: "Criar conta"
3. Subtítulo: "Cadastre picos, avalie e descubra onde andar."
4. Campo **Nome**
5. Campo **E-mail**
6. Campo **Senha** (`PasswordInput`) com texto de apoio fixo abaixo: "Mínimo de 8 caracteres."
7. **Aceite obrigatório** (`Checkbox` + texto com links): "Li e aceito os Termos de uso e a Política de privacidade."
8. (Condicional) `AlertBanner` de rede/servidor
9. Botão primário "Criar conta"
10. Rodapé: "Já tem conta?" + `TextLink` "Entrar"

### 5.2 Campos
| Campo | Rótulo | Placeholder | Atributos | Validação |
|---|---|---|---|---|
| Nome | "Nome" | "Como você quer ser chamado" | `autoComplete="name"`, `textContentType="name"`, `autoCapitalize="words"`, `maxLength` 80 | obrigatório: "Informe seu nome."; só espaços: igual; mínimo 2 caracteres: "O nome precisa ter ao menos 2 caracteres." |
| E-mail | "E-mail" | "voce@exemplo.com" | `autoComplete="email"`, `textContentType="emailAddress"` | obrigatório: "Informe seu e-mail."; formato: "Informe um e-mail válido." |
| Senha | "Senha" | (vazio) | `autoComplete="new-password"`, iOS `textContentType="newPassword"` (habilita "Usar senha forte") | obrigatório: "Crie uma senha."; menos de 8: "A senha precisa ter ao menos 8 caracteres." |
| Aceite | texto do próprio checkbox | - | `Checkbox` desmarcado por padrão (nunca pré-marcado) | desmarcado ao enviar: **"Aceite os termos para continuar."** |

**Texto de apoio da senha** ("Mínimo de 8 caracteres.") é visível desde o início, em `text-muted`; quando há erro, é substituído pela mensagem de erro (que repete a regra). Assim a regra aparece **antes** de errar, não só depois. Não há medidor de força nem exigência de maiúscula/símbolo: o backlog só pede 8 caracteres e regras extras gerariam rejeições que o backend não tem.

**Aceite dos termos (GP-099).** Texto: "Li e aceito os [Termos de uso] e a [Política de privacidade]."
- **Rótulo associado:** web `<input type="checkbox" id="accept-terms">` + `<label for="accept-terms">` com todo o texto (os links dentro do label não alternam a caixa ao serem ativados). Mobile: o conjunto caixa + texto é um elemento com `accessibilityRole="checkbox"`, `accessibilityLabel="Li e aceito os Termos de uso e a Política de privacidade"` e `accessibilityState.checked`; os dois links são elementos separados (`accessibilityRole="link"`) e também expostos como ações personalizadas ("Abrir Termos de uso", "Abrir Política de privacidade").
- **Alvo de toque:** caixa visual 24 px dentro de alvo 48x48; tocar no texto também alterna; os links têm alvo próprio de 48 de altura e tocá-los **não** altera a marcação.
- **Ordem de tabulação:** Nome -> E-mail -> Senha -> mostrar senha -> checkbox -> link "Termos de uso" -> link "Política de privacidade" -> "Criar conta" -> "Entrar".
- **Estados:** *padrão* desmarcado; *foco* anel `focus`; *marcado* fundo `primary` + check `on-primary`; *erro* (enviar sem marcar) borda `error` na caixa + ícone + **"Aceite os termos para continuar."** em `error` abaixo, ligada ao checkbox por `aria-describedby`/rótulo, foco no checkbox se for o primeiro campo inválido, e o erro some ao marcar; *loading (enviando)* a caixa fica não interativa mantendo a aparência marcada (os links também ficam desativados); *desabilitado* só durante o envio, opacidade 0.4 se algum dia precisar aparecer desativado fora disso.
- **Links:** na web abrem em nova aba (`target="_blank"`, `rel="noopener"`, rótulo "Termos de uso (abre em nova aba)") para não perder o formulário; no mobile abrem a tela de leitura empilhada (D)/(E) e, ao voltar, o formulário está intacto (estado no navigator).
- **Backend:** o signup recebe o aceite (booleano e a versão vigente dos termos, definidos no GP-099) e grava data e versão; sem aceite devolve `VALIDATION_ERROR`, que a tela mostra no mesmo lugar com o mesmo texto "Aceite os termos para continuar."

### 5.3 Estados
| Estado | Comportamento |
|---|---|
| Padrão | Web: foco no Nome. Mobile: sem teclado automático. |
| Erro de campo | Conforme 3.1, por campo, antes do envio (exigência de #29: "validações (yup) aparecem por campo antes do envio"). |
| **Enviando** | Botão em `loading`, campos somente leitura, link "Entrar" desativado. Anúncio: "Criando sua conta". O botão **não pode ser tocado de novo** (evita cadastro duplicado, exigência de #25). |
| **E-mail já cadastrado** (`EMAIL_ALREADY_EXISTS`) | Erro **no campo e-mail**: "Este e-mail já tem cadastro." seguido de `TextLink` "Entrar" na mesma linha, que leva ao Login com o e-mail preenchido. Foco no campo e-mail. Demais campos preservados. |
| Erro de validação do servidor (`VALIDATION_ERROR` indicando campo) | Mensagem no campo indicado, usando o texto do cliente da tabela acima (o texto do servidor só é usado se não houver equivalente). |
| **Erro de rede** | Banner 3.2. Dados preservados. |
| **Sucesso** | A conta é criada e a pessoa **não** entra logada (UX-15). Navega ao Login (A) com `replace` (voltar não retorna ao formulário), e-mail preenchido, foco na senha e `AlertBanner` success **"Conta criada! Entre com seu e-mail e senha."** Nenhum token é salvo. O botão fica em `loading` até a navegação. |

### 5.4 Layout
- **Mobile:** igual ao Login (mesma casca), rolagem com teclado, botão e rodapé fluindo após o último campo. Os três campos + botão cabem sem rolar em telas de 667 pt de altura sem teclado; com teclado a rolagem leva o campo ativo para cima do teclado (`scrollToFocusedInput`).
- **Web:** mesmo `Card` centralizado de 420 px. Em telas largas não usamos duas colunas: três campos ficam melhor em coluna única.
- `returnKeyType`: Nome "next", E-mail "next", Senha "go" (envia; com o aceite desmarcado mostra o erro do aceite e leva o foco a ele).
- O aceite fica **depois** da senha e **antes** do botão: o último passo antes de "Criar conta" é confirmar. Com 130% de fonte o texto do aceite quebra em várias linhas, sem truncar.

### 5.5 Microcopy
| Elemento | Texto |
|---|---|
| Título | "Criar conta" |
| Subtítulo | "Cadastre picos, avalie e descubra onde andar." |
| Botão | "Criar conta" |
| Apoio da senha | "Mínimo de 8 caracteres." |
| E-mail duplicado | "Este e-mail já tem cadastro." + "Entrar" |
| Aceite | "Li e aceito os Termos de uso e a Política de privacidade." |
| Erro do aceite | "Aceite os termos para continuar." |
| Rodapé | "Já tem conta?" + "Entrar" |

---

## 6. Tela C1 - Esqueci minha senha (#32)

**Objetivo:** pedir o código sem revelar se o e-mail existe.

### 6.1 Hierarquia
1. Botão/ícone voltar (mobile: seta no cabeçalho do stack, alvo 48; web: `TextLink` "Voltar para entrar" no topo do card)
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
| **Sucesso (sempre igual)** | Toast `info`/`success` de 4 s: **"Se o e-mail estiver cadastrado, enviamos um código."** e navega para C2. A mensagem e a navegação são **idênticas** quer a conta exista ou não, e o tempo de resposta percebido também (o backend deve responder igual; a tela não tem nenhum outro ramo). Toast com `aria-live="polite"`; como a tela muda, o mesmo texto aparece de forma fixa em C2 (ver 7.1) para o leitor de tela e para quem perdeu o toast. |
| Erro de rede | Banner 3.2 com "Tentar novamente". |

### 6.3 Layout
- Mobile: mesma casca do Login, sem wordmark grande (cabeçalho com seta voltar + título). Web: mesmo card de 420 px.
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
9. Linha de reenvio: "Não chegou?" + `TextLink` "Reenviar código" (ou contagem, ver abaixo)

### 7.2 Campos
| Campo | Rótulo | Atributos | Validação |
|---|---|---|---|
| Código | "Código de 6 dígitos" | `inputMode="numeric"` / `keyboardType="number-pad"`, `autoComplete="one-time-code"`, iOS `textContentType="oneTimeCode"`, `maxLength` 6, `autoCapitalize="none"`; fonte `h2` com `letter-spacing` positivo (4 px) e `tabular-nums`, alinhado à esquerda; aceita colar com espaços/traço (remove tudo que não for dígito) | vazio ou menos de 6 dígitos: "Digite os 6 dígitos do código." |
| Nova senha | "Nova senha" | `autoComplete="new-password"`, `textContentType="newPassword"` | vazio: "Crie uma nova senha."; menos de 8: "A senha precisa ter ao menos 8 caracteres." |
| Confirmar nova senha | "Confirmar nova senha" | `autoComplete="new-password"` | diferente: "As senhas não são iguais." (valida no blur do campo e revalida quando a nova senha muda) |

Quando o código chega pelo SMS/e-mail e o sistema oferece o preenchimento automático (iOS sugere código na barra do teclado), ele preenche o campo único sem esforço: motivo da decisão UX-5.

### 7.3 Estados
| Estado | Comportamento |
|---|---|
| Padrão | Foco no Código na web; no mobile, abre o teclado numérico no Código (aqui faz sentido: é a única ação possível e a pessoa acabou de pedir o código). |
| Erros de campo | Conforme 3.1. |
| Enviando | Botão `loading` ("Redefinindo"), campos somente leitura, "Reenviar código" desativado. |
| **Código inválido, expirado ou já usado** (`INVALID_RESET_CODE`) | Erro no campo Código: **"Código inválido ou expirado."** e, na linha de reenvio, `TextLink` "Reenviar código" em destaque (a linha passa a ser `body-strong`). O servidor não diz se foi inválido ou expirado (não deve), por isso a mensagem cobre os dois. Nova senha e confirmação preservadas. O campo Código fica com foco e texto selecionado. |
| **5 tentativas erradas** | O cliente conta as falhas `INVALID_RESET_CODE` da sessão da tela. Na 5a, o campo Código e o botão ficam desabilitados e aparece `AlertBanner` error: **"Muitas tentativas incorretas. Peça um novo código."** com ação "Reenviar código". Como o servidor invalida o código nesse ponto, qualquer dígito digitado já não adiantaria. Se a pessoa sair e voltar, o contador do servidor continua valendo (o cliente mostra o erro padrão de código inválido e a opção de reenviar). Não exibimos "restam N tentativas" (não é exigido e ajuda a atacante). **Foco:** como o campo Código e o botão ficam desabilitados, o foco vai para o `AlertBanner` (que é `role="alert"`, então o leitor anuncia o texto) e fica na ação "Reenviar código" dentro dele, o único controle útil naquele momento. Depois do reenvio, o foco volta ao campo Código já reabilitado e limpo. |
| **Reenviar código** | Toque em "Reenviar código" chama o mesmo pedido de C1, mostra toast **"Se o e-mail estiver cadastrado, enviamos um novo código."**, limpa o campo Código e o contador de tentativas, e inicia **espera de 30 s** em que o link vira texto desativado: "Reenviar código em 30s" (contagem regressiva a cada segundo, mas o leitor de tela só é avisado no início e no fim, para não ler todo segundo). Códigos anteriores deixam de valer (regra do backend), o que o texto da toast informa de forma implícita ("novo código"). |
| **Erro de rede** | Banner 3.2 com "Tentar novamente". |
| **Sucesso** | Navega ao Login (A) com `replace`, e-mail preenchido, foco na senha, `AlertBanner` success **"Senha alterada. Entre com a nova senha."** Não fazemos login automático: a issue pede voltar ao Login, e entrar com a senha nova confirma que ela foi anotada/memorizada. |
| Senha igual à antiga | Sem tratamento (o backend não distingue). |
| Conta desativada | Sem diferença na tela (regra do backend: redefinir não reativa, o próximo login reativa). |

### 7.4 Layout
- **Mobile:** cabeçalho com seta voltar; campos em coluna; tela rola com o teclado aberto; teclado inicial numérico no Código, depois "next" para as senhas; botão no fim do conteúdo.
- **Web:** card de 420 px; "Voltar" no topo do card. Ordem de tab: Código -> Nova senha -> mostrar -> Confirmar -> mostrar -> Redefinir senha -> Reenviar código.

### 7.5 Microcopy
| Elemento | Texto |
|---|---|
| Título | "Digite o código" |
| Apoio | "Se o e-mail estiver cadastrado, enviamos um código de 6 dígitos para {e-mail}. Ele vale por 15 minutos." |
| Rótulos | "Código de 6 dígitos", "Nova senha", "Confirmar nova senha" |
| Botão | "Redefinir senha" |
| Reenvio | "Não chegou?" + "Reenviar código" / "Reenviar código em {n}s" |
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
| Casca | Tela cheia em `bg`, sem card, conteúdo alinhado à esquerda, rolagem | Card `surface` centralizado (max 420) a partir de `sm`; abaixo disso igual ao mobile |
| Teclado | `KeyboardAvoidingView`, `returnKeyType`, `keyboardType`, teclado não abre sozinho (exceto no Código) | `<form>`, Enter envia, `autofocus` no primeiro campo, `inputMode` |
| Safe-area | `useSafeAreaInsets` em cima e embaixo | não se aplica (usar `env(safe-area-inset-*)` apenas se a página for usada como PWA, fora do MVP) |
| Sessão | Token no Keychain; `reset` do navigator para a Home | Token persistido (decisão técnica do Dev; sugerimos armazenamento que sobreviva ao fechamento da aba); `navigate('/home', { replace: true })` |
| Termos e privacidade | Tela nativa empilhada; ao voltar, o cadastro está intacto | Nova aba em `/termos` e `/privacidade`; o formulário continua na aba original |
| Voltar | Seta no cabeçalho + gesto/botão do sistema | `TextLink` "Voltar" no card + botão voltar do navegador |
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
- Contrastes (já verificados no DS): texto de erro `error`/`surface` 6,68 claro e 7,60 escuro; `primary-text` sobre `bg` 6,80 / 9,59; borda de campo `border` >= 3:1.
- O Login não distingue "e-mail inexistente" de "senha errada" nem visual nem semanticamente (nem em `aria-invalid`).
- Toda funcionalidade por teclado na web; sem armadilhas de foco.
- Nunca bloquear colar nos campos de senha ou do código.
- Leitor de tela anuncia "carregando"/"entrando" via `aria-busy` + região `aria-live`.

## 10. Decisões e justificativas

**UX-1. Login e cadastro em telas separadas, ligadas por link, sem abas.** Abas alternando "Entrar | Criar conta" escondem a ação principal (cada tela quer um botão principal diferente) e complicam foco e estado. Telas separadas dão URL própria na web (`/cadastro`, atende #29) e título claro para leitores de tela.

**UX-2. Conta reativada: mostrar aviso, leve (toast na Home).** Aprovado pelo dono (UX-14). Quem desativou a conta pode ter esquecido; entrar e ver tudo "de volta" sem explicação pode confundir, e é uma mudança de estado da conta que a pessoa tem o direito de saber. Porém, **bloquear o login com confirmação** ("sua conta está desativada, deseja reativar?") seria contrário à regra de negócio do backlog (a reativação é automática no login) e adicionaria atrito. Então: login segue normal e, na Home, um toast de 4 s: "Bem-vindo de volta! Sua conta foi reativada." O backend devolve `reactivated: boolean` no login (issue #23) e a tela mostra o toast só quando for `true`.

**UX-3. (substituída por UX-15).** A proposta inicial de login automático após o cadastro foi rejeitada pelo dono.

**UX-4. Sem campo "confirmar senha" no cadastro; com botão "mostrar senha".** O campo de confirmação existe para prevenir erro de digitação, mas dobra o trabalho no celular, onde digitar senha é caro. O botão olho resolve o mesmo problema com menos esforço, e a recuperação de senha existe como rede de segurança. Na redefinição **mantemos** a confirmação, porque (1) a issue exige e (2) lá um erro de digitação já deixaria a pessoa sem acesso e fazendo o fluxo de novo.

**UX-5. Código em campo único, não em 6 caixinhas.** Seis caixas são bonitas mas frágeis: quebram colar, preenchimento automático do iOS/Android (`oneTimeCode`), uso de leitor de tela, correção com backspace e fonte escalada. Um único campo com espaçamento entre letras entrega a mesma leitura visual com todos os recursos do sistema funcionando, e é mais simples de implementar nas duas plataformas.

**UX-6. Web: card centralizado, sem ilustração lateral.** Não há logo, fotos nem identidade ilustrada definidas; uma coluna decorativa seria preenchida com um retângulo vazio. Card centralizado reaproveita 100% do layout mobile em telas pequenas e facilita manutenção. Ideia pós-MVP: painel lateral com foto de pico quando houver acervo.

**UX-7. Botão sempre habilitado antes do envio.** Botão cinza por padrão não explica o que falta, especialmente com sol forte (princípio 1 do DS). O envio dispara a validação e leva o foco ao primeiro erro. O desabilitado fica reservado para o estado "enviando" (exigência das issues) e para as tentativas esgotadas.

**UX-8. Erro "E-mail ou senha inválidos" num banner, sem destacar campos.** Cumpre a regra de não revelar qual dado falhou e evita a ambiguidade de pintar os dois campos de vermelho. A senha permanece (não apagamos o que a pessoa digitou, #28) mas selecionada para facilitar a correção.

**UX-9. Mensagem neutra e navegação idêntica em "Esqueci minha senha".** Qualquer diferença (texto, tempo, tela) permite descobrir e-mails cadastrados. Por isso o toast é fixo e C2 repete o texto "Se o e-mail estiver cadastrado...". O custo é que quem errou o e-mail só percebe quando o código não chega; mitigamos com o botão "Voltar" em C2 (corrigir e-mail) e o "Reenviar código".

**UX-10. Contagem de tentativas no cliente e espera de 30 s no reenvio.** A regra de 5 tentativas é do servidor; o cliente só a espelha para não deixar a pessoa digitando num código já morto. A espera de 30 s no "Reenviar" evita toques repetidos que geram vários e-mails e dão a impressão de que "não funciona"; é puramente de UX (o backend deve aplicar o seu próprio limite). **Aprovada pelo dono (UX-16) e agora critério de aceite da issue #32.**

**UX-11. Nenhuma tela de auth usa o mapa ou imagens.** O DS diz que o mapa é o protagonista, mas aqui ainda não há mapa e o acesso é obrigatório (D10 do backlog); o foco é o formulário.

**UX-12. Mensagens de erro de rede em banner persistente, não toast.** Exigem ação ("Tentar novamente") e o DS proíbe sumir sozinho.

**UX-13. Wordmark placeholder com "Picos" em `primary-text`.** Dá presença da marca com o único acento do DS e contraste AA nos dois temas, sem inventar logotipo. Substituível sem refazer as telas.

**UX-14. Aviso de conta reativada: sim (decisão do dono).** Ver UX-2.

**UX-15. Cadastro não entra logado (decisão do dono).** Após criar a conta, vai ao Login com e-mail preenchido, foco na senha e aviso "Conta criada! Entre com seu e-mail e senha.". Separa criação de acesso e simplifica o backend (signup não devolve token). Custo de UX: uma digitação de senha a mais; mitigado por e-mail preenchido, foco na senha e gerenciadores de senha, que oferecem salvar a credencial no cadastro e preenchê-la no Login (`new-password` -> `current-password`).

**UX-16. Espera de 30 s no "Reenviar código" (decisão do dono).** Critério de aceite da issue #32. Ver UX-10.

**UX-17. Termos de uso e política de privacidade no MVP (decisão do dono, issue #90).** Aceite obrigatório no cadastro, enviado ao backend (data e versão gravadas), e páginas de leitura públicas. Decisões de design: caixa **desmarcada por padrão** (consentimento deve ser ato ativo; exigência comum das lojas e da LGPD), links separados do toque da caixa para não marcar sem querer, links da web em nova aba para não perder o formulário, tela nativa no mobile para funcionar offline, banner fixo de "texto provisório" para ninguém confundir o modelo com o texto jurídico.

**UX-18. Rota pretendida e banner de sessão expirada (QA).** Voltar à rota pretendida (GP-028) evita perder o contexto de quem abriu um link; o banner de sessão expirada só aparece quando havia token salvo, porque "sessão expirou" para quem nunca entrou seria falso e confuso.

**UX-19. Sem mensagem de "muitas tentativas" no Login (QA).** Não há limite de tentativas de login no backend nem no backlog; uma mensagem sem erro real que a dispare seria código morto e promessa falsa.

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
As decisões anteriores foram resolvidas (UX-14 a UX-17). Resta apenas:
1. Fornecer o conteúdo jurídico definitivo dos Termos de uso e da Política de privacidade (hoje texto provisório).
2. Logo definitivo (a spec usa wordmark provisório).

## 13. Figma
Arquivo do DS: https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN
Página **Autenticação** do mesmo arquivo (frames de referência; a fonte de verdade é este texto):
- Mobile / Login: https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=10-3
- Mobile / Login, erro de credenciais: https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=10-22
- Mobile / Cadastro, e-mail duplicado: https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=10-41
- Mobile / Esqueci minha senha: https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=10-65
- Mobile / Redefinir senha, código inválido: https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=10-75
- Mobile / Login e Redefinir senha no tema escuro: https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=10-100 e https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=10-119
- Web / Login: https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=10-144
- Web / Cadastro: https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=10-164
- Web / Esqueci minha senha: https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=10-189
- Web / Redefinir senha: https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=10-201

Os frames mostram layout, hierarquia e estados principais; estados de loading, rede e sucesso estão descritos só no texto.
