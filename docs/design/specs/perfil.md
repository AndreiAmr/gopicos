# Spec de UX - Telas de perfil do usuário logado (mobile e web)

Issues: #66 (GP-074 ver e editar perfil, mobile), #67 (GP-075 ver e editar perfil, web), #68 (GP-076 alterar senha, mobile e web), #69 (GP-077 excluir conta, mobile), #70 (GP-078 excluir conta, web), #71 (GP-079 meus picos e minhas avaliações), #72 (GP-080 foto de perfil / avatar).
Nomenclatura: as decisões de UX desta spec são **UX-P1 a UX-P23** (seção 13) e as pendências para o dono são **D30 em diante** (seção 15), para não colidir com UX-1..28 da spec de autenticação, nem com as D1..D17 do backlog nem com as decisões da spec de picos.
Base: `docs/design/design-system.md` **versão 2.0** e o padrão da spec `docs/design/specs/autenticacao.md` (formulário, validação, erros de rede, acessibilidade). Esta spec **não define cor, fonte, espaço ou raio novos**: só usa tokens do DS.
Dependência de outra spec: "Meus picos" usa o `SpotCard` (variante compacta) **definido em `docs/design/specs/picos.md` (PR #112)**; esta spec só diz *como* ele entra no perfil. Rotas e nomes seguem a mesma spec (`/` é o Login, a Home é `/home`, novo pico é `/spot/new-spot`).
Figma e protótipo: ver seção 16.

Regras de negócio que moldam as telas (backlog do PO: GP-070 a GP-080, D4, D7, D14):
- O perfil mostra **nome, e-mail e data de cadastro** (GP-070). A senha nunca aparece.
- **Nome e sobrenome são campos separados** (`firstName`, `lastName`, GP-081), como no cadastro. Limite herdado do cadastro: 40 caracteres cada.
- **E-mail é imutável** (D7): é o login. A tela mostra o e-mail, não permite editar e explica por quê.
- **Avatar é Could** (D7, GP-080): o MVP mostra um avatar com **iniciais**; o envio de foto está especificado na seção 9 para ficar pronto, mas fora do MVP.
- Alterar senha: senha atual + nova (mín. 8) + confirmação (GP-072/076). Senha atual errada = `INVALID_CREDENTIALS`.
- **Excluir conta = desativar** (D4, GP-073): nada é apagado; picos e avaliações ficam com autor "Usuário Desativado"; médias não mudam; o token atual deixa de valer; **entrar de novo reativa** a conta (D14: "Bem-vindo de volta! Sua conta foi reativada."). Exige a senha.
- Só o próprio usuário vê e altera seus dados; a identidade vem do token. `UNAUTHENTICATED` em qualquer tela do perfil leva ao Login com o aviso de sessão expirada (spec de autenticação, 4.3).

---

## 1. Mapa de telas e fluxo

```
 Mobile: aba "Perfil" da TabBar                       Web: menu do usuário no header / URL /perfil
              |                                                     |
              v                                                     v
        [P1] PERFIL (hub) --------------------------------- /perfil (md+: com menu lateral)
         |   |    |    |      |
         |   |    |    |      +--> [P7] Sair (confirmação) --> Login
         |   |    |    +--> [P4] EXCLUIR CONTA (senha) --> Login (aviso "Conta excluída")
         |   |    +--> [P3] ALTERAR SENHA --> volta ao P1 / permanece (toast)
         |   +--> [P2] EDITAR DADOS (nome, sobrenome; e-mail só leitura) --> volta ao P1 (toast)
         +--> [P5] MEUS PICOS --> detalhe do pico (spec de picos)   (vazio: "Cadastrar pico")
         +--> [P6] MINHAS AVALIAÇÕES --> detalhe do pico            (vazio: "Explorar o mapa")
```

Telas: **P1** Perfil (hub), **P2** Editar dados, **P3** Alterar senha, **P4** Excluir conta, **P5** Meus picos, **P6** Minhas avaliações, **P7** Sair (confirmação, diálogo). Avatar (GP-080, Could) é uma ação dentro de P1/P2 (seção 9).

**Rotas web:** `/perfil` (P1 abaixo de `md`; "Meus dados" = P1+P2 acima de `md`, ver UX-P3), `/perfil/senha` (P3), `/perfil/picos` (P5), `/perfil/avaliacoes` (P6). P4 é um **diálogo** aberto por estado da página, sem rota própria (UX-P9). Todas atrás do guard de login (GP-028) e com o título da aba "Perfil - GoPicos".
**Rotas mobile:** a aba `Profile` (já existe na `HomeStack`, hoje com a Home como placeholder) vira um **stack próprio**: `ProfileHome`, `ProfileEdit`, `ChangePassword`, `DeleteAccount`, `MySpots`, `MyReviews`. A TabBar fica visível em P1, P5 e P6 (telas de navegação) e **some** em P2, P3 e P4 (telas de formulário, onde o teclado e o botão precisam do espaço, UX-P4).

Transições de dados:
- P1 carrega o perfil (`me`) e as contagens; P2/P3/P4 recebem o perfil já carregado (sem nova espera).
- Salvar em P2 atualiza o cache (Apollo/Redux): o novo nome aparece **de imediato** em P1, no header e em qualquer lugar que mostre o autor logado (critério de #66: "nome atualizado, inclusive em avaliações futuras", ou seja, as próximas avaliações já saem com o nome novo; as já feitas passam a exibir o nome novo porque o autor é referenciado, não copiado).
- P4 com sucesso: apaga token e estado, navega ao Login com `replace` (sem voltar a telas protegidas).
- "Meus picos"/"Minhas avaliações" abrem o **detalhe do pico** existente (rota/tela da spec de picos); o voltar do sistema retorna à lista no mesmo ponto de rolagem.

## 2. Componentes do DS usados (e o que falta)

Usados como definidos no DS: `Button` (primary, secondary, ghost, **destructive**, lg), `Input`, `Toast`, estados de vazio/erro/loading (skeleton `sunken`), `StarRating` (leitura 16 px) e chip de modalidade. Da spec de autenticação, **reuso**: `PasswordInput`, `AlertBanner` e `TextLink`. Padrões de formulário: autenticação 3.1 a 3.4.

Necessários que o DS ainda não detalha (entram em GP-002/003 junto com os de autenticação):

| Componente | Definição |
|---|---|
| `Avatar` | Círculo (`radius.full`). Tamanhos: `sm` 32, `md` 48, `xl` 96. **Com foto**: imagem recortada em `cover`. **Sem foto (MVP)**: fundo `primary-soft`, **iniciais** (primeira letra do nome + primeira do sobrenome, maiúsculas) em `primary-text`, fonte `h2` no `xl` (escala proporcional nos outros), peso 600, borda 1,5 px `border` só no `xl`. Contraste calculado: `primary-text` sobre `primary-soft` **5,28:1** no claro e **8,96:1** no escuro. `accessibilityLabel`/`alt` vazio quando decorativo ao lado do nome (o nome já é lido); com ação de editar foto (9), vira botão "Alterar foto de perfil". Conta desativada (em outras telas): círculo `sunken` com ícone de usuário. |
| `ProfileHeader` | Bloco do topo de P1: `Avatar xl` + nome completo (`h1`) + e-mail (`body`, `text-muted`) + "Membro desde {mês de ano}" (`caption`, `text-muted`, ex.: "Membro desde outubro de 2026"). Centralizado no mobile; alinhado à esquerda em linha com o avatar na web `md+`. Nome longo: quebra em até 2 linhas e depois reticências com o nome completo no `accessibilityLabel`/`title`. |
| `StatTile` (par) | Duas tiles lado a lado sob o header, **tocáveis**: número (`h2`) + rótulo (`body-sm`): "Picos" e "Avaliações". `surface`, borda `divider`, raio `lg`, altura mín. 64, alvo inteiro 48+. Leva a P5/P6. Se a contagem ainda não carregou, o número vira skeleton; se falhou, "-" e a tile continua tocável. |
| `SettingsRow` / `SettingsGroup` | Linha de lista de ajustes: ícone 24 à esquerda (em `text-muted`), rótulo `body-strong`, valor/descrição opcional (`body-sm`, `text-muted`), `chevron` à direita; altura mín. 56; grupo = `surface`, raio `lg`, bordas `divider` entre linhas; papel `button`/`link`. Variante **destrutiva**: ícone e rótulo em `error`. Uma linha por navegação; nunca duas ações na mesma linha. |
| `DangerZone` (web) | Card com borda `error` 1,5 px, título "Excluir conta" (`h3` em `error`), texto curto e botão `destructive` ou `secondary` com texto `error`. Só web `md+`. No mobile é a `SettingsRow` destrutiva. |
| `ConfirmDialog` | Dialog (web) / alerta nativo ou sheet (mobile) do DS com título, texto, botão secundário "Cancelar" (foco inicial, **sempre à esquerda/primeiro**) e o botão de confirmação à direita. Para ações destrutivas o botão é `destructive`. Fecha com Esc, gesto e "Cancelar". |
| `ListItem` de pico e de avaliação | **Pico:** o **`SpotCard` (variante compacta)**, definido na spec de picos (`docs/design/specs/picos.md`, PR #112); esta spec não o redefine nem tem alternativa: conteúdo, dados e tamanho valem os de lá. O card **não mostra endereço/local** (nenhum contrato o expõe). **Avaliação (novo, `ReviewListItem`):** nome do pico (`h3`, é o link), `StarRating` leitura, data (`caption`), comentário (`body`, até 3 linhas com reticências, o mesmo limite do `ReviewItem` do detalhe em picos.md, que deve ser igual; ver UX-P23), alvo inteiro leva ao pico. |
| `EmptyState` | Do DS (ilustração simples + texto + ação). Aqui com a **camada de marca**: usado nos vazios de P5/P6 (DS 13.6 permite vazio): ilustração de pino/skate, uma linha `h3`, uma de apoio e botão. |
| `SectionHeader` | `label` em `text-muted` acima de um grupo (ex.: "Conta", "Atividade"). `h2` semântico (web) / `accessibilityRole="header"`. |

## 3. Padrões comuns

- **Formulários (P2, P3, P4):** valem integralmente as regras de autenticação 3.1 a 3.4 (rótulo sempre visível; valida no blur antes do 1º envio e a cada digitação depois do 1º erro; foco no 1º campo inválido; erro com ícone + texto + `aria-invalid`; campos `readOnly` durante o envio; botão em `loading`; dados nunca apagados em erro; erros de rede e de servidor da tabela 3.2 com `AlertBanner` e "Tentar novamente").
- **Exceção ao botão sempre habilitado (UX-P6):** em P2 o botão "Salvar alterações" fica **desabilitado enquanto nada mudou** (nome e sobrenome iguais ao salvo, ignorando espaços nas pontas); ao digitar uma mudança habilita. Em P3 e P4 o botão fica sempre habilitado (campos obrigatórios vazios mostram o erro ao tocar, como no Login).
- **Alterações não salvas (P2):** sair com mudanças (voltar, trocar de aba, fechar o diálogo, link do menu) pede `ConfirmDialog`: título "Descartar alterações?", texto "Você alterou seus dados e ainda não salvou.", botões "Continuar editando" (foco, primário) e "Descartar" (`destructive`). Na web também `beforeunload`. Sem mudanças, sai direto.
- **Carregamento inicial (P1, P2, P5, P6):** skeleton em `sunken` com a forma do conteúdo (avatar circular, 2 linhas de texto, tiles); **não** spinner de tela cheia. Mais de 8 s sem resposta: vira o estado de erro de rede com "Tentar novamente".
- **Erro de carregamento (qualquer tela):** `EmptyState` de erro centralizado na área de conteúdo: "Não foi possível carregar seu perfil." + "Tentar novamente" (`secondary`). Mantém a TabBar/header para navegar. Em P5/P6 o erro é só da lista; o resto do perfil segue disponível.
- **Pull to refresh** (mobile) em P1, P5 e P6; na web não há (o usuário recarrega).
- **Toasts de sucesso** (4 s, DS): "Perfil atualizado.", "Senha alterada." — mobile no topo abaixo da safe-area; web canto superior direito, `aria-live="polite"`.
- **Acessibilidade comum:** título da tela é `h1`/`header` e recebe o foco do leitor ao abrir; ordem de foco = visual; 130% de fonte sem truncar o essencial (nome do pico e comentário podem ter reticências, com o texto completo no rótulo); alvos >= 48; tokens apenas, claro e escuro.

---

## 4. Tela P1 - Perfil (hub) (#66, #67)

**Objetivo:** mostrar quem sou eu no app, dar acesso rápido ao que é meu (picos, avaliações) e às ações de conta, sem esconder nada importante e sem deixar a ação destrutiva fácil de tocar por engano.

### 4.1 Hierarquia (mobile, de cima para baixo)
1. `h1` "Perfil" na barra de topo (`h2` 20/26 centralizado ou à esquerda; sem `TitleBrand`, UX-P2) e, no extremo direito, nada (a edição fica em linha, UX-P5).
2. `ProfileHeader`: `Avatar xl` (toque abre a foto na seção 9, só pós-MVP), nome completo, e-mail, "Membro desde ...".
3. `StatTile` x2: "Picos" e "Avaliações".
4. `SectionHeader` "Conta" + `SettingsGroup`: **Editar dados** (ícone lápis, valor: nome completo), **Alterar senha** (ícone cadeado).
5. `SectionHeader` "Atividade" + `SettingsGroup`: **Meus picos**, **Minhas avaliações** (as tiles do item 3 levam ao mesmo lugar; ver UX-P8).
6. `SettingsGroup`: **Sair** (ícone sair, neutro).
7. Espaço extra (`space.8`) e `SettingsRow` destrutiva **Excluir conta** (ícone lixeira, texto `error`), a última da tela, separada do grupo anterior.
8. Rodapé discreto: "GoPicos {versão}" (`caption`, `text-subtle`), só mobile; ajuda no suporte.

Espaço: gutter 16; entre header e tiles `space.6`; entre grupos `space.6`; dentro do grupo `divider`. Tela rola; a TabBar fica fixa embaixo, o último item tem `paddingBottom = altura da TabBar + inset.bottom + space.6`.

### 4.2 Layout web
- **Abaixo de `md` (768):** idêntico ao mobile, em coluna única de até 560 px centralizada, sem TabBar (a navegação é o header do site).
- **`md` e acima:** layout de duas colunas dentro de `max-width` 1120: **menu lateral** de 240 px (itens: Meus dados, Alterar senha, Meus picos, Minhas avaliações; separador; "Sair"; e, no fim, "Excluir conta" em `error`) e **área de conteúdo** de até 640 px à direita. O item ativo tem fundo `primary-soft`, texto `primary-text` e `aria-current="page"` (não só cor: barra de 3 px `primary` à esquerda). `/perfil` abre em "Meus dados": `ProfileHeader` (em linha) acima do formulário de P2 (que na web **fica sempre visível**, sem tela separada, UX-P5) e, no fim do conteúdo, a `DangerZone`.
- Header do site: menu do usuário (avatar `sm` + nome) com "Meu perfil" e "Sair"; é onde a navegação chega a `/perfil` (GP-028).

### 4.3 Estados
| Estado | Comportamento |
|---|---|
| Carregando | Skeleton: círculo 96, duas barras, duas tiles e as linhas do grupo. Os textos fixos (títulos de seção e rótulos das linhas) já aparecem; só os dados viram skeleton. |
| Carregado | Como 4.1. Contagens ausentes: tile mostra só o rótulo, sem "0" falso (UX-P13). |
| Erro | `EmptyState` de erro (seção 3) no lugar de header e tiles; as linhas **Sair** e **Excluir conta** continuam, porque sair da conta não depende do perfil carregado. |
| Pull to refresh | Recarrega o perfil e as contagens. |
| Sessão expirada | `UNAUTHENTICATED` leva ao Login com aviso (autenticação). |

### 4.4 Microcopy
"Perfil", "Membro desde {mês} de {ano}", "Picos", "Avaliações", "Conta", "Editar dados", "Alterar senha", "Atividade", "Meus picos", "Minhas avaliações", "Sair", "Excluir conta", "Não foi possível carregar seu perfil." / "Tentar novamente".

---

## 5. Tela P2 - Editar dados (#66, #67)

**Objetivo:** alterar nome e sobrenome com segurança; deixar claro que o e-mail não muda e por quê.

### 5.1 Hierarquia
1. Cabeçalho com seta voltar (mobile, stack) e `h1` "Editar dados". Na web `md+` o formulário é o conteúdo de "Meus dados" (título `h1` "Meus dados" na área, UX-P5).
2. (Avatar `md` com "Alterar foto": só pós-MVP, seção 9.)
3. Campo **Nome**.
4. Campo **Sobrenome**.
5. Campo **E-mail**, somente leitura: aparência de campo desabilitado (fundo `sunken`, texto `text-muted`, sem borda `border`), ícone de cadeado e texto de apoio abaixo (`body-sm`, `text-muted`): "O e-mail é o seu login e não pode ser alterado."
6. (Condicional) `AlertBanner` de erro de rede/servidor.
7. Botão primário **"Salvar alterações"** (desabilitado enquanto sem mudanças, UX-P6).
8. (Web `md+`) logo abaixo, a `DangerZone` (P4).

### 5.2 Campos e validação
| Campo | Rótulo | Atributos | Validação (cliente) |
|---|---|---|---|
| Nome | "Nome" | `autoComplete="given-name"`, `textContentType="givenName"`, `autoCapitalize="words"`, `maxLength` 40 | vazio ou só espaços: "Informe seu nome."; menos de 2: "O nome precisa ter ao menos 2 caracteres." |
| Sobrenome | "Sobrenome" | `autoComplete="family-name"`, `textContentType="familyName"`, `autoCapitalize="words"`, `maxLength` 40 | "Informe seu sobrenome."; mínimo 2: "O sobrenome precisa ter ao menos 2 caracteres." |
| E-mail | "E-mail" | `readOnly`, `aria-readonly`, **focável** (Tab) para leitura e cópia, com `aria-describedby` apontando para o texto de apoio (UX-P7) | sem validação |

Mesmas regras e mensagens do cadastro (autenticação 5.2), para a pessoa não ver duas regras diferentes para o mesmo dado. Espaços nas pontas são removidos ao salvar. Se o servidor devolver `VALIDATION_ERROR` com `field` (`firstName`/`lastName`), a mensagem do servidor aparece no campo (a do servidor vale sobre a do cliente); sem `field`, `AlertBanner` acima do botão.

### 5.3 Estados
| Estado | Comportamento |
|---|---|
| Padrão | Campos preenchidos com o perfil. Mobile: teclado **não** abre sozinho. Web: foco no Nome ao abrir a tela separada (abaixo de `md`) e **sem autofocus** em `md+` (a página tem conteúdo antes). |
| Sem mudanças | Botão desabilitado (`aria-disabled`, opacidade 0.4). |
| Com mudanças | Botão habilitado. |
| Salvando | Botão `loading` ("Salvar" vira spinner), campos `readOnly`, voltar desativado, anúncio "Salvando". |
| **Sucesso** | Mobile: volta a P1 (`goBack`) com toast "Perfil atualizado." e nome novo já visível. Web: permanece na página, toast "Perfil atualizado.", campos refletem os valores salvos e o botão volta a desabilitado; o foco permanece no botão, que fica desabilitado (o leitor de tela ouve o toast). |
| Erro de campo | Conforme 5.2. |
| Erro de rede/servidor | `AlertBanner` (autenticação 3.2) com "Tentar novamente". Dados preservados. |
| Perfil não carregado | Não abre: P2 só é alcançável com o perfil carregado (a linha em P1 fica desativada enquanto carrega). |
| Sair com mudanças | `ConfirmDialog` "Descartar alterações?" (seção 3). |

### 5.4 Layout
- **Mobile:** tela de formulário sem TabBar, `ScrollView` com `keyboardShouldPersistTaps="handled"` dentro de `KeyboardAvoidingView` (iOS `padding`, Android `adjustResize`); margens `space.4`; campos `space.4`. **Botão fixo acima do teclado** (barra inferior, fundo `bg`, safe-area), como nos passos do cadastro (UX-28): o formulário é curto e o polegar já está no teclado. Enter no último campo (Sobrenome) aciona salvar quando habilitado (`returnKeyType="go"`).
- **Web:** campos em coluna de até 400 px dentro da área de 640; botão logo após o último campo, alinhado à esquerda, largura automática (mín. 160), não largura total (não é fluxo estreito).

### 5.5 Microcopy
| Elemento | Texto |
|---|---|
| Título | "Editar dados" (mobile) / "Meus dados" (web) |
| Rótulos | "Nome", "Sobrenome", "E-mail" |
| Apoio do e-mail | "O e-mail é o seu login e não pode ser alterado." |
| Botão | "Salvar alterações" |
| Toast | "Perfil atualizado." |
| Descartar | "Descartar alterações?" / "Você alterou seus dados e ainda não salvou." / "Continuar editando" / "Descartar" |

---

## 6. Tela P3 - Alterar senha (#68)

**Objetivo:** trocar a senha com a certeza de que foi a própria pessoa (senha atual) e sem erro de digitação (confirmação).

### 6.1 Hierarquia
1. Cabeçalho com voltar e `h1` "Alterar senha" (web: página `/perfil/senha`, `h1` na área de conteúdo).
2. Texto de apoio (`body`, `text-muted`): "Escolha uma senha nova com pelo menos 8 caracteres."
3. **Senha atual** (`PasswordInput`).
4. **Nova senha** (`PasswordInput`) + apoio fixo "Mínimo de 8 caracteres."
5. **Confirmar nova senha** (`PasswordInput`).
6. (Condicional) `AlertBanner` de rede/servidor.
7. Botão primário **"Alterar senha"**.

### 6.2 Campos e validação
| Campo | Rótulo | Atributos | Validação |
|---|---|---|---|
| Senha atual | "Senha atual" | `autoComplete="current-password"`, `textContentType="password"` | vazio: "Informe sua senha atual." (sem regra de tamanho, como no Login) |
| Nova senha | "Nova senha" | `autoComplete="new-password"`, `textContentType="newPassword"` | vazio: "Crie uma nova senha."; menos de 8: "A senha precisa ter ao menos 8 caracteres."; igual à atual: "A nova senha precisa ser diferente da atual." (UX-P10) |
| Confirmar nova senha | "Confirmar nova senha" | `autoComplete="new-password"` | vazio: "Confirme a nova senha."; diferente: **"As senhas não coincidem."** (valida no blur da confirmação, **ao tocar o botão** e revalida quando a nova senha muda; **antes do envio**, como exige #68) |

Colar é permitido em todos (gerenciadores de senha). Cada campo tem seu botão mostrar/ocultar.

### 6.3 Estados
| Estado | Comportamento |
|---|---|
| Padrão | Web: foco em Senha atual. Mobile: teclado não abre sozinho. Botão sempre habilitado. |
| Enviando | Botão `loading` ("Alterando"), campos `readOnly`, anúncio "Alterando senha". |
| **Senha atual incorreta** (`INVALID_CREDENTIALS`) | Erro **no campo Senha atual**: "Senha atual incorreta."; foco no campo com o texto selecionado; os outros dois permanecem preenchidos. (Aqui é correto marcar o campo: a pessoa está logada e o dado é dela; não vaza nada, ao contrário do Login, UX-P11.) |
| **Sucesso** | Mobile: volta a P1 com toast "Senha alterada." Web: permanece em `/perfil/senha`, **limpa os três campos** (senha não fica na tela), toast "Senha alterada." e foco volta ao primeiro campo. A sessão atual continua válida (D33). |
| `VALIDATION_ERROR` | Mensagem do servidor no campo indicado (`newPassword`), ou banner se sem `field`. |
| Rede/servidor | `AlertBanner` com "Tentar novamente"; campos preservados. |
| Sair com campos preenchidos | Sem confirmação (são só senhas digitadas, descartar não perde nada de valor). |

### 6.4 Layout
Mobile: igual a P2 (sem TabBar, botão fixo acima do teclado, ordem Senha atual -> Nova -> Confirmar, `returnKeyType="next"` e `"go"` no último). Web: coluna de até 400 px, botão após o último campo.

### 6.5 Microcopy
"Alterar senha"; "Escolha uma senha nova com pelo menos 8 caracteres."; "Senha atual"; "Nova senha"; "Confirmar nova senha"; "Mínimo de 8 caracteres."; erros acima; botão "Alterar senha"; toast "Senha alterada."

---

## 7. Tela P4 - Excluir conta (#69, #70)

**Objetivo:** permitir desativar a conta com plena consciência do que acontece (e do que **não** acontece), pedindo a senha, sem ser alarmista nem esconder que é reversível.

### 7.1 Formato
- **Mobile:** tela cheia empilhada (`DeleteAccount`), sem TabBar (UX-P9): o texto de aviso é longo, a senha abre o teclado e a 130% de fonte um sheet não comportaria. Cabeçalho com voltar.
- **Web:** `ConfirmDialog` centralizado (abaixo de `sm` vira sheet de tela quase cheia), aberto pelo botão "Excluir conta" da `DangerZone` (ou do item do menu lateral). Foco inicial no `h2` do diálogo; foco preso dentro; Esc e "Cancelar" fecham e devolvem o foco ao botão de origem.

### 7.2 Hierarquia (mesmo conteúdo nas duas plataformas)
1. Título `h1` (mobile) / `h2` do diálogo (web): **"Excluir conta"**.
2. Frase de abertura `body-strong`, sem ícone de erro nem fundo vermelho (UX-P12): **"Sua conta será desativada."**
3. Lista com ícones de check/info (4 itens, `body`, ícone + texto, não só cor):
   - "Seu perfil deixa de aparecer. Seu nome e e-mail ficam ocultos para outras pessoas."
   - "Seus picos e avaliações continuam no GoPicos, com o autor mostrado como \"Usuário Desativado\"."
   - "As notas das suas avaliações continuam contando na média dos picos."
   - "Você pode reativar a conta quando quiser: é só entrar de novo com seu e-mail e senha."
   O 2º item tem **dois textos**. Com contagens carregadas: "Seus {n} picos e {m} avaliações continuam no GoPicos, com o autor mostrado como \"Usuário Desativado\"." (singular: \"Seu 1 pico\", \"1 avaliação\"; se um dos dois for 0, cita só o outro; se ambos forem 0, o item é omitido). **Sem contagens** (ainda carregando, falha ou D35 não entregue): "Seus picos e avaliações continuam no GoPicos, com o autor mostrado como \"Usuário Desativado\"." A tela nunca espera as contagens para abrir; assim #69/#70 não dependem de D35.
4. Campo **Senha** (`PasswordInput`) com texto de apoio: "Digite sua senha para confirmar."
5. (Condicional) `AlertBanner` de rede/servidor.
6. Botões: **"Excluir conta"** (`destructive`) e **"Cancelar"** (`secondary`); disposição em 7.5.

### 7.3 Campo e validação
| Campo | Rótulo | Atributos | Validação |
|---|---|---|---|
| Senha | "Senha" | `autoComplete="current-password"`, `textContentType="password"` | vazio: "Informe sua senha para continuar." |

Não pedimos digitar "EXCLUIR" (UX-P12): a senha já é o atrito e a prova de identidade, e a ação é reversível (D4).

### 7.4 Estados
| Estado | Comportamento |
|---|---|
| Padrão | Botão destrutivo sempre habilitado (vazio mostra o erro do campo). Mobile: teclado não abre sozinho; web: foco inicial no título do diálogo (não no campo, para ler o aviso antes). |
| Enviando | Botão `loading` ("Excluindo"), campo `readOnly`, "Cancelar" desativado, diálogo web não fecha por Esc/clique fora; anúncio "Excluindo conta". |
| **Senha incorreta** (`INVALID_CREDENTIALS`) | Erro no campo: "Senha incorreta."; foco e texto selecionado. Nada muda na conta. |
| **Sucesso** | Backend desativa e invalida o token. O app apaga token (Keychain / armazenamento web) e estado, e navega ao **Login com `replace`** com `AlertBanner` info: **"Conta excluída. Se quiser voltar, entre com seu e-mail e senha e ela será reativada."** (D34). O e-mail vem preenchido no Login (foco na senha). O botão voltar não retorna ao perfil. |
| Rede/servidor | `AlertBanner` com "Tentar novamente"; nada é apagado localmente; a pessoa continua logada. |
| `UNAUTHENTICATED` | Login com aviso de sessão expirada. |

### 7.5 Layout
- **Mobile:** conteúdo rolável; **barra inferior fixa** (acima do teclado, safe-area) com os dois botões empilhados: **"Cancelar" (`secondary`) em cima e `destructive` "Excluir conta" embaixo**, cada um com 48 e `space.3` entre eles. A ordem visual, a de leitura e a de foco coincidem (de cima para baixo), com o foco inicial dos botões em "Cancelar"; o destrutivo fica por último, no fim do caminho do polegar para a confirmação consciente. O escape é fácil pelo "Cancelar", pelo voltar do cabeçalho e pelo gesto do sistema. Variante `destructive`: fundo `error`, texto `#FFFFFF` no claro (contraste **6,68:1**) e `bg` no escuro (`#0F1113` sobre `#FF8A80`, **8,29:1**).
- **Web:** diálogo de 480 px; botões alinhados à direita na ordem **Cancelar | Excluir conta** (convenção de diálogos; "Cancelar" é a ação padrão e recebe o foco ao tabular primeiro após o campo).
- Entrada de P4 em P1/menu: `SettingsRow` destrutiva (mobile) e `DangerZone` (web `md+`); **nada** de excluir conta fica no caminho do polegar do hub além da última linha, para evitar toque acidental.

### 7.6 Microcopy
| Elemento | Texto |
|---|---|
| Título | "Excluir conta" |
| Abertura | "Sua conta será desativada." |
| Itens | ver 7.2 |
| Campo | "Senha" / apoio "Digite sua senha para confirmar." |
| Botões | "Excluir conta", "Cancelar" |
| Erro senha | "Senha incorreta." |
| Aviso no Login | "Conta excluída. Se quiser voltar, entre com seu e-mail e senha e ela será reativada." |
| Loading | "Excluindo..." (anúncio: "Excluindo conta") |

---

## 8. Telas P5 e P6 - Meus picos e Minhas avaliações (#71)

**Objetivo:** reencontrar e abrir o que eu cadastrei e o que eu avaliei, e ter um caminho óbvio quando não há nada.

### 8.1 Estrutura comum
- **Mobile:** telas empilhadas `MySpots` e `MyReviews` no stack do Perfil, **com a TabBar visível** (são telas de navegação). Cabeçalho com voltar e `h1` ("Meus picos" / "Minhas avaliações") com a contagem no `caption` ("3 picos"). Lista em coluna, `FlatList`, `space.3` entre itens, gutter 16, pull to refresh.
- **Web:** página `/perfil/picos` e `/perfil/avaliacoes` (itens do menu lateral). Em `md+` a lista fica na área de 640; de `lg` em diante os **picos** viram **grade de 2 colunas** (o card compacto cabe); as avaliações seguem em coluna (texto longo).
- Ordem: mais recente primeiro (data de criação do pico / da avaliação).
- **Sem paginação no MVP** (D31); se o backend limitar, "Carregar mais" ao fim da lista.

### 8.2 P5 - Meus picos
- Item: `SpotCard` (variante compacta) da spec de picos, sem local/endereço (nenhum contrato o expõe). **Sem** ações de editar/excluir na lista: elas ficam no detalhe do pico (D13: só o autor), para não duplicar fluxos; o card inteiro é o alvo e abre o detalhe. Pico recém-criado sem avaliações: "Sem avaliações ainda" no lugar das estrelas.
- Estados:
  | Estado | Comportamento |
  |---|---|
  | Carregando | 3 skeletons do card compacto. |
  | Com dados | Lista; toque abre o detalhe. |
  | **Vazio** | `EmptyState` com ilustração de marca: título **"Você ainda não cadastrou nenhum pico."**, apoio "Conhece um lugar bom para andar? Cadastre e ajude a galera." e botão primário **"Cadastrar pico"** (atalho): mobile navega à aba/tela de novo pico (`NewSpot`); web leva a `/spot/new-spot` (rota da spec de picos). |
  | Erro | `EmptyState` de erro com "Tentar novamente"; resto do perfil intacto. |
  | Pico removido por outro fluxo | Não acontece no MVP (só o autor remove; ao remover no detalhe, a lista atualiza ao voltar). |

### 8.3 P6 - Minhas avaliações
- Item (`ReviewListItem`): nome do pico, `StarRating` (leitura 16) com "4 de 5", data ("há 2 semanas" no mobile; "12/10/2026" no `title`/leitor), comentário (até 3 linhas; sem comentário: não mostra nada, a avaliação só com estrelas é válida, D3). O alvo inteiro abre o detalhe do pico, onde a avaliação é editável/excluível.
- Estados:
  | Estado | Comportamento |
  |---|---|
  | Carregando | 3 skeletons (linha de título, estrelas, 2 linhas). |
  | **Vazio** | `EmptyState`: **"Você ainda não avaliou nenhum pico."**, apoio "Suas notas ajudam outros skatistas a achar os melhores picos." e botão **"Explorar o mapa"** (mobile: aba Home; web: `/home`; a rota `/` é o Login). |
  | Erro | Igual a P5. |

### 8.4 Acessibilidade e microcopy
Cada item é um único elemento focável com rótulo composto: "{nome do pico}, {modalidade}, nota média {média} de 5, {n} avaliações. Abrir pico." / "{nome do pico}, sua nota {n} de 5, {data}. {comentário}. Abrir pico." Contagem no cabeçalho: "1 pico" / "{n} picos"; "1 avaliação" / "{n} avaliações" (singular correto).

---

## 9. Foto de perfil / avatar (#72, GP-080, Could, fora do MVP)

O backlog marca como Could e "fora do escopo do MVP; registrada para referência futura". Por isso: **o `Avatar` com iniciais entra no MVP** (já é usado em P1, header web e, depois, nas avaliações) e **o envio de foto fica especificado aqui, não implementado** (D30 pergunta se o dono quer antecipar).

Quando ativado:
- **Entrada:** o avatar `xl` de P1 vira botão com selo de câmera (24 px, `primary`, ícone `on-primary`) no canto inferior direito; rótulo "Alterar foto de perfil". Na web `md+` também há "Alterar foto" em P2.
- **Mobile:** toque abre **bottom sheet** (DS) com "Tirar foto", "Escolher da galeria" e, se houver foto, "Remover foto" (`destructive`); "Cancelar" fecha. Permissões de câmera/fotos pedidas **só ao escolher** a opção, com texto explicando o motivo; se negada, `AlertBanner` info com atalho "Abrir ajustes".
- **Web:** `ConfirmDialog` com área de arrastar/clicar (`input type=file`, `accept="image/jpeg,image/png,image/webp"`) e botão "Escolher imagem"; mostra prévia circular.
- **Recorte:** quadrado 1:1 com máscara circular; sem zoom elaborado (arrastar + um controle de zoom com rótulo); botão "Usar esta foto".
- **Limites:** JPEG/PNG/WebP, até 5 MB (mesmo limite das fotos de pico, D9). Fora disso: "A imagem precisa ser JPG, PNG ou WebP e ter até 5 MB." A imagem é reduzida no cliente antes do envio.
- **Estados:** enviando (anel de progresso no avatar, botão desativado, "Enviando foto..."), sucesso (toast "Foto atualizada."), erro (banner com "Tentar novamente", a foto anterior permanece), remoção com `ConfirmDialog` ("Remover foto de perfil?" / "Você voltará a ver suas iniciais.").
- **Acessibilidade:** `alt=""` na imagem (nome já está ao lado); o botão tem rótulo; progresso anunciado.
- **Privacidade:** conta desativada nunca expõe a foto (mesma regra de nome e e-mail, GP-073).

---

## 10. Tela P7 - Sair (confirmação)

Linha "Sair" em P1 (e item do menu na web) abre `ConfirmDialog` (UX-P15): título "Sair do GoPicos?", texto "Você precisará entrar de novo com seu e-mail e senha.", botões "Cancelar" (foco) e "Sair". Ao confirmar: apaga token e estado, `reset` (mobile) / `replace` (web) para o Login, sem aviso. O botão voltar não retorna a telas protegidas (GP-025/GP-028). Em erro de rede não há o que falhar: a sessão é local; apagar é sempre possível.

## 11. Diferenças entre mobile e web

| Tema | Mobile | Web |
|---|---|---|
| Navegação | Aba Perfil + stack (P1 -> P2/P3/P4/P5/P6); TabBar some nos formulários | `/perfil` com menu lateral em `md+`; em `<md` hub como no mobile; menu do usuário no header |
| Editar dados | Tela separada (P2) | Formulário sempre visível em "Meus dados" |
| Excluir conta | Tela cheia com barra inferior | Diálogo (sheet em `<sm`) |
| Salvar | Botão fixo acima do teclado | Botão após o último campo |
| Listas | `FlatList`, pull to refresh | Coluna / grade 2 col. em `lg+` |
| Sair | Diálogo nativo | Diálogo / item do menu |
| Foto (pós-MVP) | Sheet câmera/galeria | Diálogo com arquivo |
| Toast | Topo abaixo da safe-area | Canto superior direito |
| Foco | Título recebe foco do leitor | `h1` com `tabIndex=-1` recebe foco na troca de rota |

Iguais: nomes de componentes, microcopy, regras de validação, estados e tokens.

## 12. Acessibilidade (checklist de aceite)
- Rótulos associados a todos os campos; erros com ícone + texto + `aria-invalid`/`accessibilityState.invalid`, anunciados ao enviar.
- E-mail somente leitura: `aria-readonly`, texto de apoio ligado por `aria-describedby`, aparência diferente sem depender só de cor (cadeado + texto).
- Alvos >= 48 em linhas, tiles, botões e no olho de mostrar senha.
- Diálogos: foco preso, Esc, foco devolvido ao gatilho, `role="dialog"` + `aria-modal` + `aria-labelledby`; excluir conta: `role="alertdialog"`.
- Avatar de iniciais decorativo; ações com rótulo; menu lateral com `aria-current`.
- Contrastes calculados (WCAG 2.x): iniciais `primary-text`/`primary-soft` 5,28:1 (claro) e 8,96:1 (escuro); botão destrutivo 6,68:1 (claro) e 8,29:1 (escuro); `error` sobre `bg` 6,00:1; `error` sobre `surface` escuro 7,57:1; `text-muted` sobre `sunken` 5,88:1 (claro) e 9,84:1 (escuro, campo de e-mail somente leitura).
- 130% de fonte: nada trunca o essencial; barras fixas do mobile (botões) ficam em no máximo 2 botões empilhados e o conteúdo rola por trás.
- Todas as funções por teclado na web; sem armadilha de foco fora dos diálogos.

## 13. Decisões e justificativas

**UX-P1. Perfil como hub de navegação, não como "página gigante".** Perfil junta dados, segurança, atividade e conta; numa tela só ficaria longa e misturaria tarefas de pesos diferentes. O hub mostra identidade + atalhos e cada tarefa tem sua tela (editar, senha, excluir, listas). No mobile isso é o padrão de ajustes que o usuário já conhece (iOS/Android), e na web `md+` o mesmo mapa vira menu lateral (UX-P3), mantendo uma só arquitetura de informação nas duas plataformas.

**UX-P2. Título "Perfil" em Inter, sem `TitleBrand`, `Tape` ou `Halftone`.** O DS (13.6) reserva a camada de grafite para telas de entrada, vazios e destaques, e proíbe em telas densas de uso. Perfil é uma tela de uso recorrente e de formulários; a marca entra só nos **estados vazios** de P5/P6, onde o DS permite e onde há espaço e um clima mais leve. Quem quer personalidade a vê no vazio; quem quer trocar a senha não é distraído.

**UX-P3. Web `md+` com menu lateral; abaixo de `md`, o hub do mobile.** Em tela larga um hub de uma coluna desperdiça espaço e obriga cliques extras; o menu lateral mantém tudo a um clique. Abaixo de `md` a coluna única do hub é a melhor leitura. `/perfil` muda de papel conforme a largura (hub vs. "Meus dados"); é um redirecionamento visual, não de URL, e as sub-rotas existem nos dois casos para links diretos.

**UX-P4. Telas de formulário (P2, P3, P4) escondem a TabBar no mobile.** O teclado, a barra do botão fixo e a TabBar não cabem juntos em telas pequenas; e uma tab ativa no meio de uma edição convida a sair com dado não salvo. Em telas de navegação (P1, P5, P6) a TabBar fica, para a pessoa trocar de aba sem voltar vários passos.

**UX-P5. Editar dados: tela separada no mobile, formulário sempre visível na web.** No celular o campo editável permanente no hub aumentaria a altura e abriria o teclado a cada toque descuidado; uma linha "Editar dados" é mais previsível. Na web há espaço, o teclado físico não esconde nada e um formulário sempre visível economiza um clique. O resultado (campos, validação, textos) é o mesmo.

**UX-P6. "Salvar alterações" desabilitado quando nada mudou (exceção à regra de autenticação 3.1).** Na autenticação, o botão cinza sem explicação confundia ("o que falta?"). Aqui a razão é evidente: **não há o que salvar** porque nada foi alterado, e habilitar um botão que não faz nada induz a dúvida ("salvou?"). Em P3 e P4 (campos obrigatórios) mantemos a regra de sempre habilitado e deixamos o envio mostrar o que falta.

**UX-P7. E-mail visível, bloqueado e explicado.** D7 torna o e-mail imutável (é o login e o destino do código de recuperação). Esconder o campo geraria "onde mudo meu e-mail?"; mostrá-lo como campo desabilitado com a razão em uma frase responde antes da pergunta. Usamos o estilo "somente leitura" (fundo `sunken` + cadeado + texto) e não um campo normal desativado com opacidade, para o contraste do e-mail continuar legível. O campo é **focável** (Tab) com `aria-readonly` e `aria-describedby` para o texto de apoio, assim o leitor de tela encontra o campo e a explicação, e dá para selecionar e copiar. Para o contraste do e-mail continuar legível (o dado é útil: confirmar com qual conta estou logado).

**UX-P8. Contagens em tiles tocáveis e linhas "Meus picos / Minhas avaliações" duplicadas.** As tiles dão um resumo visual e um atalho; as linhas são o caminho previsível para quem navega por lista e para leitores de tela (a ordem de foco entra no grupo "Atividade"). A duplicação é deliberada e barata: ambas são focáveis, e as tiles têm `accessibilityLabel` "Ver meus picos, {n}". Se o dono achar redundante, remover as tiles não afeta nenhuma outra tela.

**UX-P9. Excluir conta: tela cheia no mobile, diálogo na web.** O texto de aviso tem 4 itens e uma senha; um sheet no celular vira rolagem dentro de rolagem, com teclado, e a 130% de fonte quebra. A web tem espaço e o padrão de diálogo (DS) é o esperado para ação destrutiva; abaixo de `sm` o DS já converte em sheet.

**UX-P10. "A nova senha precisa ser diferente da atual" no cliente.** O cliente conhece as duas senhas digitadas e a troca por uma igual é quase sempre engano (a pessoa achou que mudou). O erro é grátis, evita uma ida ao servidor e confirmação falsa de "Senha alterada". Diferente da recuperação, onde o cliente não conhece a senha antiga.

**UX-P11. "Senha atual incorreta" no campo.** No Login a mensagem é genérica para não revelar se o e-mail existe. Aqui a pessoa já está autenticada: não há o que proteger, e apontar o campo errado acelera a correção. O mesmo vale para "Senha incorreta." em excluir conta.

**UX-P12. Excluir conta: aviso em lista, sem pedir para digitar "EXCLUIR", sem alarme.** A ação é **reversível** (D4: entrar de novo reativa), então o atrito alto (digitar uma palavra) seria desproporcional; a senha já é a confirmação de identidade e o texto lista o que acontece e o que **não** acontece (nada é apagado, notas continuam, reativação). O tom é claro, não ameaçador: a frase de abertura é "Sua conta será desativada.", dizendo a verdade do sistema; o botão, porém, chama-se "Excluir conta" (como pede a issue e como o usuário procura) com visual `destructive`. Se o dono preferir atrito maior, ver D32.

**UX-P13. Contagens ausentes são omitidas, nunca "0" falso.** Um "0 picos" durante o carregamento ou numa falha leva a pensar que os picos sumiram. Skeleton enquanto carrega, "-" se falhou.

**UX-P14. "Meus picos" usa o `SpotCard` (variante compacta) definido na spec de picos.** Consistência: o mesmo card, os mesmos dados e o mesmo toque em todo lugar onde há lista de picos. A definição (conteúdo, tamanho, estados) mora só em picos.md (PR #112); aqui não há variante própria nem plano B. O card não mostra endereço porque o pico só tem polígono nos contratos (geocodificar item a item teria custo e limite de API).

**UX-P15. "Sair" com confirmação.** Toque acidental em "Sair" obriga a digitar e-mail e senha de novo (pior no celular, sem gerenciador de senha ativado). A confirmação custa um toque. Fica acima de "Excluir conta" e separada dela por espaço, porque são ações de peso muito diferente.

**UX-P16. Excluir conta é a última linha, com espaço, em `error`, mas sem ocupar destaque.** Colocá-la longe do polegar e visualmente rebaixada evita toque acidental; o `error` a faz reconhecível sem precisar ser vermelha chamativa em cor de fundo. Não usamos `DangerZone` no mobile (ocuparia muita tela).

**UX-P17. Sucesso de edição volta à lista no mobile e fica na página na web.** No celular o fluxo é linear (entrar, mudar, voltar), e o nome novo visível em P1 confirma o salvamento além do toast. Na web a página é o destino: ficar nela é natural, e o toast + botão desabilitado confirmam.

**UX-P18. Alterar senha não encerra a sessão atual nem invalida nenhum token no MVP (D33).** Reautenticar logo após a pessoa ter digitado a senha atual é atrito sem ganho. O risco (token antigo em outro aparelho segue válido até expirar) foi aceito e fica documentado em D33.

**UX-P19. Após excluir conta, vai ao Login com aviso e e-mail preenchido.** Dá fechamento ("deu certo") e reforça que a conta pode voltar. O e-mail preenchido facilita a reativação. O aviso é um `AlertBanner` info no Login, não toast (a tela muda e o toast poderia ser perdido; o banner ensina a regra de D4).

**UX-P20. Avatar de iniciais no MVP.** Dá identidade ao perfil com custo zero (sem upload, sem moderação, sem armazenamento), prepara o componente para a foto e evita perfil "vazio". O envio de foto continua Could (D7).

**UX-P21. Nenhuma ação de editar/excluir dentro das listas de "Meus picos/avaliações".** Elas já existem no detalhe (autor); duplicar criaria dois caminhos com estados e confirmações paralelos e aumentaria o risco de toque acidental numa lista rolável. A lista é só para achar e abrir.

**UX-P22. Nome completo só para o próprio usuário; "Nome S." em todo contexto público (D36, aprovada).** Header do perfil, menu da web e P2 mostram `firstName + " " + lastName`. Em qualquer contexto visto por outras pessoas (autor de pico, de avaliação, cards, listas) o formato é **"Nome S."** (primeiro nome + inicial do sobrenome com ponto, ex.: "Marina S."), para reduzir a exposição do sobrenome. Sem sobrenome: só o nome. Conta desativada: "Usuário Desativado". **Impacto técnico:** o #104 hoje devolve `author.name` completo; o formato público deve ser **montado no backend** (para o sobrenome nem sair da API) a partir de `firstName`/`lastName` (#97), e o cliente só exibe. Vale também para a spec de picos.

**UX-P23. Comentário truncado em 3 linhas em toda lista.** Em "Minhas avaliações" e no `ReviewItem` do detalhe do pico o limite é o mesmo, **3 linhas** com reticências (picos.md fala em 4: ajuste pedido a ela); o texto completo fica no detalhe e no rótulo de acessibilidade.

## 14. Ideias pós-MVP
- Envio de foto de perfil (seção 9), com recorte avançado e remoção.
- Editar e-mail com verificação (hoje imutável, D7).
- "Esqueci a senha atual" dentro de Alterar senha (hoje: sair e usar "Esqueci minha senha").
- Lista de sessões/dispositivos e "sair de todos".
- Exportar meus dados e pedir exclusão definitiva (LGPD).
- Tema claro/escuro manual e idioma.
- Editar/excluir picos e avaliações direto da lista (UX-P21).
- Estatísticas ("você já avaliou 12 picos"), selos.
- Biometria para confirmar ações sensíveis.

## 15. Pendências para o dono (decisões D30 em diante)
Todas aprovadas pelo dono conforme a recomendação (registradas em `docs/produto/backlog.md`). **D27 a D29 ficaram reservadas** (intervalo deixado livre entre as decisões da spec de picos, D18 a D26, e as desta spec, para a spec de picos poder crescer sem colisão); não foram usadas.
1. **D30 - Foto de perfil no MVP?** **Não**; iniciais no MVP (UX-P20), seção 9 pronta para depois. Impacto: antecipar exige backend (upload, remoção) e permissões de câmera/galeria.
2. **D31 - Paginação em Meus picos/Minhas avaliações.** **Lista completa, sem paginação no MVP**; `mySpots`/`myReviews` devolvem tudo por recência. Impacto: backend sem cursor; reavaliar com volume.
3. **D32 - Excluir conta: confirmação extra além da senha.** **Não**; a senha basta porque a ação é reversível (UX-P12). Impacto: nenhum no backend; P4 tem só o campo de senha.
4. **D33 - Alterar senha e sessões.** **No MVP a sessão atual continua válida e NENHUM token é invalidado** (nem o atual, nem os de outros dispositivos) ao trocar a senha; vale o JWT de 7 dias sem refresh (D8). Risco aceito: quem já tinha um token roubado ou em outro aparelho continua com acesso até ele expirar. "Sair de todos os dispositivos"/invalidação ficam pós-MVP. Impacto: backend de GP-072 só troca o hash.
5. **D34 - Aviso no Login após excluir conta.** **Sim.** Impacto em `autenticacao.md`: a tabela de estados do Login (4.3) ganha a linha **"Vindo de excluir conta"** (editada neste PR): `AlertBanner` info "Conta excluída. Se quiser voltar, entre com seu e-mail e senha e ela será reativada.", e-mail preenchido e foco na senha. O Login recebe isso pelos parâmetros da navegação `replace` (mobile) / estado da navegação (web), como o aviso de conta criada (UX-15); nunca pela URL.
6. **D35 - Contagens e "Membro desde" no hub.** **Sim.** Impacto: `me` deve devolver `spotsCount`, `reviewsCount` e `createdAt` (hoje devolve `{id, name, email, createdAt}`, #109). Sem as contagens, as tiles saem (UX-P13) e o aviso de exclusão usa o texto genérico (7.2).
7. **D36 - Autor público.** **"Nome S." em todo contexto público** (UX-P22). Impacto: o formato é montado no backend (#104 devolve `author.name` completo hoje) e vale também em picos.md.
8. **D37 - Nome e sobrenome: 40 caracteres cada.** **Aprovada.** Impacto: o critério do GP-071 (#63, "até 60 caracteres") **será alterado para 40 pelo orquestrador**; depende de GP-081 (#97).

## 16. Figma e protótipo

O limite de chamadas do Figma MCP do plano Starter foi atingido antes de qualquer frame ser desenhado, então **não há frames de Perfil no arquivo do DS** (https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN, página "Telas"). Para não deixar a spec sem referência visual, há um **protótipo HTML estático** (sem dependências, tokens do DS em CSS, claro e escuro) em `docs/design/prototipos/perfil.html`, com: Perfil (mobile e web), Editar dados, Alterar senha, Excluir conta, Sair (P7), Meus picos (cheio e vazio) e Minhas avaliações. A fonte de verdade continua sendo este texto. Quando o limite do Figma for restabelecido, os frames serão desenhados ao lado das telas de autenticação e os links listados aqui.
