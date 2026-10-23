# Spec de UX - Autenticação e perfil com identidade de rua, sheets e zonas reservadas

Issue: #182 (GP-105). Atualiza `specs/autenticacao.md` e `specs/perfil.md` para o E8: identidade de rua, confirmações e seletores como sheet no mobile e Dialog com identidade no web, e zonas reservadas com teclado e com sheet. **Onde esta spec divergir delas, vale esta**; comportamento, validação, estados de dados e microcopy que não aparecem aqui continuam valendo como estão lá. Decisões novas: **UX-A1 a UX-A12** (seção 9).
Base: `design-system.md` v2.0 (seção 13), `specs/home.md` (tab bar ancorada, tokens da seção 11) e a anatomia de sheet e Dialog da `specs/criar-editar-pico.md` 1 (proposta para o GP-103, resumida abaixo).
Decisões do dono aplicadas: D38, D39 (seletores nativos de câmera/galeria/permissão), D40, D41 (fonte de tag só em títulos fixos e marca), **D42** (sem gíria em erro, segurança, exclusão de conta e textos legais), D43.
**Referência visual: protótipo HTML `docs/design/prototipos/autenticacao-perfil.html`** (Figma MCP sem cota no plano Starter; HTML autorizado pelo dono). Ver seção 11.

---

## 0. Cobertura dos critérios da #182

| Critério | Onde |
|---|---|
| Cada tela com frames mobile (375 x 667 e com notch) e web (360, 768 e 1280), claro e escuro, com identidade | Protótipo: cada estado em iPhone SE, iPhone com Dynamic Island e Android 360 x 640, mais web 360, 768 e 1280, nos dois temas. Telas: Login, Cadastro (passos 1 e 3), Esqueci minha senha, Redefinir senha, Termos; Perfil, Editar dados, Alterar senha, Meus picos, Minhas avaliações |
| Toda confirmação/seletor como sheet (mobile) e Dialog com identidade (web): sair, descartar edição do perfil, excluir conta, foto do avatar | Seção 4 |
| Cada frame marca as zonas reservadas e mostra teclado aberto e sheet expandido | "Mostrar zonas reservadas" no protótipo; estados com teclado (`loginKb`, `cad3Kb`, `esqueciKb`, `codigoKb`, `p2Kb`, `p3Kb`, `p4Kb`) e com sheet expandido (`p4`, `p4Kb`); posições na seção 5. As telas de autenticação não têm sheet (não há confirmação nem seletor nesses fluxos) |
| Dono aprova antes de GP-115 e das histórias de identidade de autenticação e perfil | Seção 10 |

## 1. Anatomia usada (resumo; detalhe em `criar-editar-pico.md` 1)
- **Sheet de confirmação:** ilustração vetorial 44, título Inter 20/700, texto Inter 16, ação em cima e "Cancelar"/"Continuar editando" embaixo, foco inicial no seguro. **Fita zebrada** no topo **só quando destrutiva** (descartar, excluir conta, remover foto); "Sair" não é destrutivo e não leva a fita.
- **Sheet de formulário** (excluir conta): título, conteúdo rolável e **rodapé fixo** do sheet com a ação, colado no teclado; fechar pelo X, arraste ou véu.
- **Sheet seletor** (foto de perfil): título Permanent Marker 26 + spray, `ActionRow`s de 64 com ícone em adesivo, Cancelar.
- **Véu e topo máximo:** o véu começa na base do header; nenhum sheet passa de `base do header + 8`. **Nas telas com tab bar, sheet e véu ficam acima dela e não a cobrem** (regra da Home, Z6); tocar numa aba fecha o sheet primeiro.
- **Web:** Dialog Radix com borda 2 `sticker-outline`, sombra rígida `6px 6px 0`, raio 12; destrutivo com fita zebrada e `role="alertdialog"`; véu só abaixo do header. Abaixo de 640 o Dialog vira sheet inferior.

## 2. Autenticação

### 2.1 O que muda em relação à `autenticacao.md`
A autenticação já é a tela mais "de marca" do DS v2 (fita, meio-tom, wordmark). No E8 ela ganha pouco, de propósito: a tela de entrada tem que ser rápida e legível. As mudanças são:
1. **Wordmark com o shape-adesivo** (ilustração vetorial do skate amarelo com rodas laranja, 48, decorativa) ao lado do "GoPicos" em Permanent Marker 40 + spray. Com teclado: 28, sem tagline.
2. **Fita "GO SKATE"** no canto superior esquerdo (giro -7, parcialmente fora da tela) e **meio-tom** no superior direito; no web 1280, um segundo meio-tom no canto inferior esquerdo. **Somem com o teclado aberto** (não podem disputar a área útil nem ficar sob o teclado).
3. **Cadastro:** título de marca "Criar conta" + spray, e o `Stepper` vira a **fita de passo "1 de 3"** (Inter 13/700 `ink` sobre `brand-yellow`; leitor: "Passo 1 de 3"), igual ao criar pico. Subtítulos ("Seus dados", "Seu e-mail", "Crie sua senha") seguem em Inter 20/600.
4. **Esqueci minha senha e Redefinir senha:** título de marca no conteúdo ("Esqueceu a senha?", "Digite o código"); o header do stack tem só o Voltar (não repete o título).
5. **Termos e Privacidade:** título de marca **no header** (título fixo de tela); o texto legal fica todo em Inter, sem gíria e sem decoração (D42).
6. Campos, rótulos, ajudas, erros, banners e botões **continuam em Inter e sem decoração** (CT-ID). Erros e avisos sem gíria (D42).

### 2.2 Botão principal e teclado
- **Login:** o "Entrar" continua fluindo logo após os campos (não fixo). Com o teclado aberto a rolagem deixa Senha, "Esqueci minha senha" e "Entrar" acima do teclado nos três aparelhos-alvo (estado `loginKb`).
- **Cadastro (3 passos), Esqueci minha senha e Redefinir senha:** o botão ("Continuar", "Criar conta", "Enviar código", "Redefinir senha") vira **rodapé fixo** (72 + `insets.bottom`; com teclado, colado no topo do teclado). Motivo: no passo 3 e na redefinição há 3 campos e o aceite; com o teclado aberto o botão no fim da rolagem sumiria (CT-SOBREP). E no cadastro o botão fica no mesmo lugar nos três passos.
- O campo focado rola para ficar 16 abaixo do topo da área visível. Código de 6 dígitos com `keyboardType="number-pad"` e `textContentType="oneTimeCode"`.

### 2.3 Web
- Coluna de 400 centralizada em 768 e 1280; em 360, largura total com margens de 24 (mesmo layout do mobile, com a fita e o meio-tom).
- Fita e meio-tom ficam nos cantos da **viewport**, fora da coluna (nunca atrás de campos).

## 3. Perfil

### 3.1 Perfil (hub, mobile)
- **Header** ancorado (`insets.top + 64`, borda 2, meio-tom): título de tela **"Perfil" em Permanent Marker 24 + spray**. Revê a UX-P2 ("sem TitleBrand"), que veio da regra antiga do DS 13.6; a D41 libera a fonte de tag em título fixo de tela.
- **Cabeçalho do perfil:** avatar xl 96 com **borda 2,5 `sticker-outline` e sombra rígida 4 px** (adesivo), iniciais em `primary-text` sobre `primary-soft`; **nome em Inter 24/800** (conteúdo do usuário, D41); e-mail; **"Membro desde out. 2026" em fita**.
- **Contagens como adesivos:** "12 Picos" (fundo `brand-yellow`, texto `ink`) e "34 Avaliações" (fundo `surface`), borda 2, sombra rígida, giros -1,5 e +1. Continuam sendo botões (levam a Meus picos / Minhas avaliações), alvo inteiro >= 72.
- **Títulos de grupo "Conta" e "Atividade" em fita** (`TapeLabel`), no lugar do `SectionHeader` em `label`.
- Grupos de ajustes com borda 1,5 `border` e raio 12; **Sair** isolado; **Excluir conta** por último, em `error` (sem mudança de ordem).
- Tab bar ancorada da Home, com "Perfil" ativo (ícone preenchido + spray). O último item termina 24 acima da tab bar.

### 3.2 Editar dados e Alterar senha (mobile)
- `ScreenHeader` v3: Voltar + título de marca ("Editar dados", "Alterar senha"). Tab bar escondida (tela de formulário, UX-P4).
- E-mail somente leitura com cadeado, como antes.
- Botão principal em **rodapé fixo** (já era assim na `perfil.md` 11), colado no teclado quando aberto.

### 3.3 Meus picos e Minhas avaliações (mobile)
- Header com Voltar e título de marca; `SpotCard` com chip-adesivo de modalidade; tab bar visível.
- **Vazio:** bloco tracejado 2 `sticker-outline`, ilustração (cone + shape), título Inter 18/700 e convite com gíria do glossário (D42): Meus picos "Você ainda não marcou nenhum pico" / "Conhece um pico? Marca ele aí pra galera." / [Cadastrar pico]; Minhas avaliações "Nenhuma avaliação ainda" / "Colou em algum pico? Conta pra galera como foi." / [Explorar o mapa].

### 3.4 Web
- **360:** hub igual ao mobile, com o header do site (56) no lugar da tab bar.
- **768 e 1280:** header 64, menu lateral de 240 (item ativo com fundo `primary-soft` e barra laranja de 4), conteúdo à direita (até 640). "Meus dados" com **título de marca**, avatar-adesivo 80 + nome + fita "Membro desde", formulário e a **`DangerZone` com fita zebrada no topo** (borda 2 `error`). Alterar senha, Meus picos e Minhas avaliações com título de marca.

## 4. Confirmações e seletores (sheet no mobile, Dialog no web)

| Ação | Hoje | Mobile (E8) | Web (E8) |
|---|---|---|---|
| **Sair** | `Alert.alert` (`useProfileHome.ts`) / Dialog (`ProfileLayout.tsx`) | Sheet de confirmação **acima da tab bar**: ilustração do shape, "Sair do GoPicos?", "Você precisará entrar de novo com seu e-mail e senha.", **[Sair]** (primário, ícone de saída) e [Cancelar] | Dialog 440, sem fita (não destrutivo), [Cancelar] [Sair] |
| **Descartar edição do perfil** | `Alert.alert` (`useEditProfile.ts`) / `beforeunload` | Sheet de confirmação com fita zebrada: "Descartar alterações?", "Você alterou seus dados e ainda não salvou.", [Descartar] / [Continuar editando] | Dialog 440 com fita zebrada (bloqueio de navegação); fechar a aba continua com o `beforeunload` do navegador |
| **Excluir conta** | **Tela cheia** `profile/delete` / `DeleteAccountDialog.tsx` | **Sheet de formulário** com fita zebrada (seção 4.1) | Dialog 480 com fita zebrada, mesmo conteúdo, [Cancelar] [Excluir conta] |
| **Foto de perfil** (pós-MVP, GP-080) | não existe | Sheet seletor "Foto de perfil": Tirar foto, Escolher da galeria, **Remover foto** (vermelho, só se houver), Cancelar; "Remover" troca o conteúdo pela confirmação "Remover foto de perfil?" (D40) | Dialog 440 com arrastar e soltar e "Escolher imagem"; remover com Dialog de confirmação |

### 4.1 Excluir conta em sheet (muda a UX-P9)
- O critério da issue pede sheet no mobile. A UX-P9 tinha escolhido tela cheia porque o texto é longo, há campo de senha e a 130% de fonte um sheet não comportaria. A solução que mantém essas garantias: **sheet de formulário que abre no topo máximo** (base do header + 8), com o conteúdo rolando por dentro e a ação no **rodapé fixo do sheet**.
- Conteúdo, na ordem da `perfil.md` 7.2: título **"Excluir conta"** em Inter 20/700 com o cone (sem marca, D42), "Sua conta será desativada.", os 4 itens (ícone + texto), campo **Senha** com "Digite sua senha para confirmar.", banner de rede quando houver. Rodapé: **[Excluir conta]** (`destructive`, largura total). "Cancelar" sai do rodapé: X, arraste, véu e Voltar fecham (exceto enviando).
- Com o teclado: a tab bar some (`tabBarHideOnKeyboard`), o sheet passa a terminar no teclado, o conteúdo rola até a senha e o rodapé (64) fica visível.
- Estados: enviando ("Excluindo...", não fecha por gesto), senha incorreta (erro no campo), sucesso (Login com o aviso, como antes).
- Para o Dev: a rota `DeleteAccount` deixa de ser tela; o conteúdo vira um `BottomSheet` aberto a partir do hub. **Esta migração não está no inventário do E8** (que lista só os `Alert.alert`); sugerir ao PO incluí-la em GP-112.

## 5. Zonas reservadas e posições calculadas (mobile, retrato)

Zonas: **Z0** status bar/notch e base do sistema, **Z1** header, **Z4** toast, **Z5** sheet, **Z6** tab bar (hub e listas) ou rodapé fixo (formulários), **Z7** teclado. Toast: 8 acima da tab bar ou do rodapé, largura total menos 32, até 96 (sucesso "Perfil atualizado.", "Senha alterada."). Isso **move o toast do topo** (`perfil.md` 3 dizia "topo abaixo da safe-area"), onde ele cobriria o header.

| | iPhone SE 375 x 667 | Android 360 x 640 (3 botões) | Dynamic Island 393 x 852 |
|---|---|---|---|
| Header (Z1) | 20 a 84 | 24 a 88 | 59 a 123 |
| Tab bar (Z6, hub e listas) | 603 a 667 | 528 a 640 (conteúdo até 592) | 754 a 852 (conteúdo até 818) |
| Toast no hub | até 499 a 595 | até 424 a 520 | até 650 a 746 |
| Sheet "Sair" (262, acima da tab bar) | 341 a 603 | 266 a 528 | 492 a 754 |
| Sheet "Foto de perfil" (386) | 217 a 603 | 142 a 528 | 368 a 754 |
| **Sheet "Excluir conta" (expandido)** | 92 a 603 | 96 a 528 | 131 a 754 |
| Teclado (Z7) | 407 a 667 | 336 a 592 | 516 a 852 |
| **"Excluir conta" com teclado** | 92 a 407, rodapé 343 a 407 | 96 a 336, rodapé 272 a 336 | 131 a 516, rodapé 452 a 516 |
| Rodapé fixo dos formulários (Editar dados, Alterar senha, Cadastro, Esqueci, Redefinir) | 595 a 667 | 520 a 592 | 746 a 818 |
| Rodapé fixo com teclado | 335 a 407 | 264 a 336 | 444 a 516 |
| Área visível do formulário com teclado | 84 a 335 (auth sem header: 20 a 335) | 88 a 264 (auth: 24 a 264) | 123 a 444 (auth: 59 a 444) |
| Sheet "Descartar alterações" (270 + bottom) | 397 a 667 | 322 a 640 | 548 a 852 |

No Android 360 x 640, a área visível com teclado no Editar dados (176) cabe o campo focado (94) com folga; no cadastro, passo 3 (sem header), a área de 240 cabe o campo focado e o aceite começa logo abaixo (rolando). Nenhum sheet cobre o header nem a tab bar; nenhum toast fica no topo.

## 6. Acessibilidade
- Decoração (fitas decorativas, meio-tom, spray, shape do wordmark, fita zebrada, ilustrações) oculta do leitor de tela. **Fitas informativas** ("1 de 3", "Membro desde out. 2026", "Conta", "Atividade") são texto lido normalmente (a de passo com o rótulo "Passo 1 de 3").
- Contraste: `ink` sobre `brand-yellow` 11,57:1 (fitas, adesivo "Picos"); `primary-text` sobre `primary-soft` 5,28 / 8,96 (iniciais); borda `sticker-outline` 17,72 / 15,97; destrutivo como na `perfil.md` 7.5.
- Nunca só cor: item ativo do menu web com barra; aba ativa com ícone preenchido + spray; erros com ícone e texto.
- Fonte a 130%: títulos de marca quebram em 2 linhas (o header cresce 28); fitas quebram em 2 linhas; o sheet "Excluir conta" já abre no topo máximo e rola, então não corta conteúdo.
- Foco: abrir um sheet anuncia o título e foca o primeiro elemento (no "Excluir conta", o título, para ler o aviso antes do campo); fechar devolve o foco à linha que abriu.

## 7. Microcopy (só o que muda)

| Onde | Texto |
|---|---|
| Fita de passo | "1 de 3", "2 de 3", "3 de 3" (leitor: "Passo N de 3") |
| Fita do perfil | "Membro desde out. 2026" (leitor: "Membro desde outubro de 2026") |
| Grupos | "Conta", "Atividade" |
| Sair | "Sair do GoPicos?" / "Você precisará entrar de novo com seu e-mail e senha." / "Sair" / "Cancelar" |
| Excluir conta (sheet) | igual à `perfil.md` 7.6; sem botão "Cancelar" no mobile (X fecha) |
| Foto de perfil | "Foto de perfil", "JPG, PNG ou WebP, até 5 MB", "Tirar foto" / "Abre a câmera do aparelho", "Escolher da galeria" / "Depois você ajusta o recorte", "Remover foto" / "Volta para as iniciais", "Remover foto de perfil?" / "Você voltará a ver suas iniciais." |
| Vazios | Meus picos: "Você ainda não marcou nenhum pico" / "Conhece um pico? Marca ele aí pra galera." / "Cadastrar pico"; Minhas avaliações: "Nenhuma avaliação ainda" / "Colou em algum pico? Conta pra galera como foi." / "Explorar o mapa" |

Erros, avisos de segurança, exclusão de conta e textos legais: sem mudança e sem gíria (D42).

## 8. Componentes
Reusa os da `criar-editar-pico.md` 9 (`ScreenHeader` v3, `StepTape`, `CautionTape`, `ActionRow`, `FormFooter`) e o `TapeLabel` da `home.md`. Novos aqui: `StickerAvatar` (avatar com borda e sombra de adesivo; variante do `Avatar`) e `StatSticker` (contagem tocável como adesivo; substitui o `StatTile`). Nenhuma cor nova.

## 9. Decisões e justificativas

**UX-A1. Autenticação muda pouco.** É a tela que já tem mais marca e a que mais precisa ser rápida; o ganho do E8 aqui é consistência (fita de passo, shape no wordmark), não mais decoração.
**UX-A2. Decoração some com o teclado.** Com o teclado aberto cada pixel é do formulário; fitas e meio-tom não podem disputar área nem ficar escondidas pela metade.
**UX-A3. Rodapé fixo no cadastro e na recuperação; login sem.** Formulários de 3 campos + aceite perdem o botão sob o teclado; o login cabe inteiro e um rodapé fixo ali seria peso visual sem ganho.
**UX-A4. Stepper vira fita "1 de 3".** Mesmo componente do criar pico; mais identidade, menos altura.
**UX-A5. Título de marca no Perfil e nas telas do perfil.** A D41 liberou a fonte de tag em títulos fixos; antes (UX-P2) o perfil era a única área do app sem marca.
**UX-A6. Nome e e-mail em Inter, "Membro desde" em fita.** O nome é conteúdo do usuário (D41); a fita dá o toque de rua num dado fixo do app.
**UX-A7. Contagens como adesivos.** Mostram que são tocáveis (borda e sombra de controle) e trazem a cor de rua sem textura.
**UX-A8. Sair não leva a fita zebrada.** Não perde dados; a fita fica reservada ao que é destrutivo, para não perder força.
**UX-A9. Excluir conta em sheet que abre no topo máximo.** Cumpre a D38 sem perder as razões da UX-P9: o texto rola dentro do sheet, a senha tem teclado e o botão fica no rodapé fixo; a 130% nada é cortado.
**UX-A10. Sheets do hub acima da tab bar.** Mesma regra da Home: a navegação nunca fica coberta; tocar numa aba fecha o sheet.
**UX-A11. Toast embaixo, acima da tab bar ou do rodapé.** No topo ele cobre o header (título e Voltar).
**UX-A12. Foto de perfil já desenhada como sheet seletor.** Fica pronta para quando o GP-080 voltar ao escopo, igual ao "Adicionar foto" do criar pico.

## 10. O que o dono precisa avaliar (antes de GP-115 e das histórias de identidade de autenticação e perfil)
- **P-A1.** Excluir conta passar de tela cheia para sheet no mobile (UX-A9, exigido pelo critério); e incluir essa migração em GP-112.
- **P-A2.** Rodapé fixo no cadastro e na recuperação de senha (UX-A3).
- **P-A3.** Título de marca no Perfil e nas telas do perfil (UX-A5) e contagens como adesivos (UX-A7).
- **P-A4.** Toast embaixo no perfil (UX-A11).
- Visual geral: login com o shape no wordmark, fita de passo, hub do perfil, Dialogs do web 768/1280.

## 11. Protótipo e Figma
- **Protótipo HTML:** `docs/design/prototipos/autenticacao-perfil.html`. Arquivo único (só Google Fonts de fora). Cada estado em iPhone SE 375 x 667, iPhone com Dynamic Island 393 x 852 e Android 360 x 640, e no **web em 360, 768 e 1280**; tema claro/escuro e "Mostrar zonas reservadas" no topo. Link direto: `autenticacao-perfil.html#estado=p4Kb&tema=escuro&zonas=1`.
- **Figma:** https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN (página "Telas"; a página "Autenticação v2" continua sendo a referência da v2). **Frames do E8 não criados:** o MCP do plano Starter retornou "You've reached the Figma MCP tool call limit on the Starter plan" nesta rodada. Desenhar a partir do protótipo quando houver cota.

## 12. Ideias pós-MVP
Entrar com biometria; login social; perfil público com os picos da pessoa; adesivos/conquistas no perfil (ex.: "10 picos marcados").
