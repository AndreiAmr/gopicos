# GoPicos - Visão de Produto

## Problema
Skatistas descobrem "picos" (locais para andar de skate) por boca a boca, redes sociais dispersas ou mapas genéricos, sem informação confiável: se é pago, se tem cobertura para chuva, horário de funcionamento, modalidade ideal, se exige equipamento de proteção, e o que outros skatistas acharam do lugar.

## Público
- **Skatista explorador** (persona principal): procura picos perto de si ou em uma viagem, quer decidir rápido se vale a ida.
- **Skatista colaborador**: conhece picos, cadastra com localização exata (polígono), fotos e detalhes, e mantém as informações corretas.
- **Skatista avaliador**: já foi ao pico e quer deixar nota em estrelas e comentário para a comunidade.

## Proposta de valor
Um mapa colaborativo mundial de picos de skate, com informações práticas e avaliação da comunidade (estrelas + comentários), acessível pelo celular (uso em campo) e pela web (cadastro e consulta detalhada).

## Objetivo atual: finalizar o MVP
Entregar, em **backend, web e mobile**, o ciclo completo:
1. **Login e cadastro** de usuário, com sessão persistente e logout.
2. **CRUD de picos**, com **avaliação por estrelas + comentários** (CRUD da avaliação do próprio usuário).
3. **CRUD do perfil** do usuário logado (ver, editar, alterar senha, excluir conta).
4. Base visual consistente via **novo design system** feito do zero pelo UX, aplicado em web e mobile.

## Escopo do MVP (dentro)
- Autenticação por e-mail/senha com JWT; operações sensíveis exigem usuário autenticado e identificado pelo token.
- Recuperação de senha por código enviado por e-mail.
- Mapa com picos (polígonos GeoJSON `[lng, lat]`), detalhe do pico, criar/editar/excluir (somente o autor).
- Avaliação: nota de 1 a 5 estrelas (obrigatória) + comentário (opcional); média e contagem no pico; usuário edita/exclui a própria avaliação.
- Perfil: visualizar, editar nome, alterar senha, excluir conta (desativação lógica; nada é apagado do banco e o login reativa), ver "meus picos".
- Estados de loading, vazio e erro em todas as telas.
- Busca por lugar e filtros básicos (Should).

## Fora do MVP (explicitamente)
- Verificação de e-mail, login social.
- Respostas a avaliações (threads), curtidas, seguidores, feed social.
- Moderação, denúncia de pico/comentário, detecção de picos duplicados.
- Modo offline, notificações push, rotas/navegação até o pico.
- Internacionalização completa (MVP em pt-BR com textos centralizados para facilitar tradução futura).
- Avatar de perfil e painel administrativo.

## Métricas de sucesso do MVP (qualitativas)
- Um usuário novo consegue: cadastrar-se, ver picos no mapa, cadastrar um pico, avaliar outro pico e editar seu perfil, em web e mobile, sem erro bloqueante.
- Fluxos críticos cobertos por testes (backend integração; mobile E2E Maestro).

## Princípios
- Dados de pico valem pela confiança: só o autor altera/exclui o próprio pico.
- Mobile é o canal de uso em campo; web é paridade funcional.
- O backlog em `docs/produto/backlog.md` é a **fonte única** do que será construído.
- **Identidade de rua em todo o produto** (2026-10-23): toda tela passa a ideia de app para skatistas (grafite, pichação, tags, muro, adesivos, gíria de skate), sem sacrificar a leitura: texto que carrega informação segue legível sob sol e com contraste AA (épico E8).
- **Bottom sheet no mobile, diálogo no web** (D38, decidido pelo dono em 2026-10-23): no app, todo modal, confirmação, menu ou seletor é bottom sheet; no web continua o diálogo, com a identidade de grafite.
- **Nada sobrepõe a navegação**: nenhum elemento cobre tab bar, header, voltar, safe areas, FAB, controles do mapa, toasts ou outros controles, inclusive em tela pequena, com teclado aberto e com sheet expandido.
