Crie o design completo de um Shopping de Casamento separado do site principal, acessado por www.biancaefabio.com.br/shopping.

Contexto do projeto

O shopping pertence ao site de casamento de Bianca & Fábio.
O site principal já existe e possui visual:

elegante

minimalista

romântico

tons claros e suaves

tipografia delicada

estética clean e sofisticada

foto em preto e branco

aparência editorial/luxuosa, mas acolhedora

O shopping deve manter a mesma identidade visual do site principal, parecendo parte do mesmo ecossistema, porém com estrutura própria de navegação e fluxo de compra.

Objetivo do shopping

Criar uma experiência de “lista de presentes” moderna e divertida, com presentes simbólicos e engraçados, como:

Pizza da madrugada

Jantar romântico

Ajuda na lua de mel

Café da manhã especial

Vinho para comemorar

Noite de filmes

Passeio especial

Combustível da viagem

Sobremesa dos noivos

O convidado entra, faz login/cadastro, escolhe os presentes, adiciona ao carrinho, deixa uma mensagem para os noivos e finaliza o pagamento.

Direção visual

Use um estilo:

clean

romântico

leve

elegante

moderno

refinado

acolhedor

Paleta

Basear em:

off-white

bege claro

nude suave

dourado discreto

cinza claro

preto suave para textos

Tipografia

Combinar:

uma fonte serif elegante para títulos

uma fonte clean e legível para textos, campos e navegação

Sensação

O shopping não deve parecer uma loja comum agressiva.
Deve parecer uma experiência afetiva, charmosa e sofisticada, feita para convidados presentearem os noivos com carinho.

Estrutura do projeto no Figma

Crie o projeto com:

versão desktop

versão mobile

auto layout

componentes reutilizáveis

variants para estados

spacing consistente

design system básico

nomenclatura organizada para facilitar handoff para desenvolvimento

Criar as seguintes páginas/telas
1. Landing do Shopping

Tela inicial do módulo /shopping

Conteúdo

header elegante com logo/nome “Bianca & Fábio”

botão para voltar ao site principal

título principal convidativo

pequeno texto explicando que os presentes são simbólicos e ajudam os noivos a viver momentos especiais

botão “Entrar para Presentear”

botão “Ver Presentes”

destaque visual com 3 a 6 cards de presentes

seção com “Como funciona”

seção com “Deixe uma mensagem para os noivos”

rodapé delicado

Textos sugeridos

Título:
“Escolha um presente com carinho”

Subtítulo:
“Criamos uma seleção de presentes simbólicos e divertidos para fazer parte da nossa nova história.”

Como funciona:

Entre na sua conta

Escolha os presentes

Deixe sua mensagem

Finalize o pagamento

2. Login / Cadastro

Criar uma tela de autenticação bonita e simples.

Blocos

Entrar

Criar conta

Entrar com Google

Campos login

email

senha

Campos cadastro

nome completo

email

senha

confirmar senha

Elementos extras

checkbox “Aceito os termos”

link “Esqueci minha senha”

botão “Entrar com Google”

botão principal destacado

opção de alternar entre login e cadastro sem sair da página

Nomes de variáveis sugeridos

fullName

email

password

confirmPassword

acceptedTerms

authProvider

userAvatar

userInitials

Estados a prever

default

focus

filled

error

success

disabled

loading

3. Página principal do Shopping

Tela com listagem de presentes.

Estrutura

header com logo/nome

menu simples

campo de busca

filtro por categoria

filtro por faixa de preço

ordenação

grid de produtos

mini resumo do carrinho fixo ou flutuante

botão de perfil

Categorias sugeridas

Lua de Mel

Gastronomia

Diversão

Viagem

Momentos a Dois

Extras

Card de produto

Cada card deve conter:

imagem/ilustração delicada ou ícone

nome do presente

descrição curta

preço

categoria

botão “Adicionar ao carrinho”

botão “Ver detalhes”

badge opcional como “Mais escolhido” ou “Favorito dos convidados”

Exemplos de produtos

Pizza da madrugada — R$ 50

Café da manhã romântico — R$ 80

Garrafa de vinho especial — R$ 120

Jantar romântico — R$ 200

Passeio especial — R$ 250

Ajuda na lua de mel — R$ 300

Combustível da viagem — R$ 100

Sessão cinema dos noivos — R$ 70

Estrutura de dados sugerida para cada produto

id

slug

name

shortDescription

description

price

category

imageUrl

isFeatured

isActive

stockType = symbolic

displayOrder

4. Modal ou página de detalhes do presente

Ao clicar em um presente, abrir detalhes.

Deve conter

imagem maior

nome do presente

descrição mais emocional/divertida

preço

seletor de quantidade

botão adicionar ao carrinho

botão favoritar

área com mensagem inspiradora

Variáveis sugeridas

productId

productName

productPrice

quantity

subtotal

selectedProduct

5. Carrinho

Criar página de carrinho elegante e clara.

Conteúdo

lista de itens

imagem pequena

nome

quantidade

preço unitário

subtotal

remover item

alterar quantidade

campo de cupom opcional, mas visualmente discreto

resumo do pedido

botão “Continuar comprando”

botão “Ir para pagamento”

Variáveis sugeridas

cartItems

cartCount

cartSubtotal

cartTotal

appliedCoupon

discountAmount

Estrutura item carrinho

cartItemId

productId

productName

productPrice

quantity

lineTotal

productImage

6. Checkout

Tela de finalização.

Seções

resumo do pedido

dados do convidado

mensagem para os noivos

forma de pagamento

botão final

Campos

nome

email

telefone opcional

mensagem para os noivos

Formas de pagamento

Criar layout preparado para:

PIX

cartão

link de pagamento externo

pagamento via gateway

Mesmo que inicialmente o sistema use link externo, o design deve ficar pronto para integração futura com gateway real.

Variáveis sugeridas

customerName

customerEmail

customerPhone

giftMessage

paymentMethod

paymentStatus

checkoutTotal

orderId

externalPaymentUrl

Métodos de pagamento possíveis

pix

credit_card

payment_link

mercado_pago

manual_redirect

7. Página de sucesso

Tela pós-pagamento.

Conteúdo

mensagem de agradecimento

resumo do presente

nome do convidado

mensagem enviada

botão “Voltar ao shopping”

botão “Ir para o site do casamento”

Estados

pagamento aprovado

aguardando confirmação

falha no pagamento

Variáveis sugeridas

orderStatus

paymentStatus

customerMessage

confirmedItems

8. Perfil do usuário

Criar área simples para o convidado.

Conteúdo

foto/avatar ou inicial

nome

email

mensagens já enviadas

histórico de presentes

status dos pedidos

botão sair

Variáveis sugeridas

userId

userName

userEmail

userPhotoUrl

orders

messages

isLoggedIn

9. Área administrativa conceitual

Criar uma tela administrativa simples para referência visual e futura implementação.

Conteúdo

lista de pedidos

nome do convidado

email

itens comprados

valor total

status do pagamento

data

mensagem para os noivos

filtros

busca

Variáveis sugeridas

adminOrders

orderStatus

paymentStatus

customerInfo

messagePreview

createdAt

Status sugeridos

Pedido:

pending

confirmed

cancelled

Pagamento:

awaiting_payment

paid

failed

refunded

Componentes que devem ser criados

Criar como componentes reutilizáveis:

header

footer

botão primário

botão secundário

botão ghost

input text

input password

select

checkbox

radio group

badge

card de produto

card de resumo de pedido

card de mensagem

card de pedido

modal de produto

toast de sucesso/erro

empty state

loading state

avatar

dropdown do usuário

item de carrinho

stepper de checkout

Estados importantes do layout

Prever estados visuais para:

Autenticação

usuário deslogado

usuário logado

Produto

disponível

destaque

adicionado ao carrinho

hover

desativado

Carrinho

vazio

com itens

atualizando

erro

Pagamento

aguardando

aprovado

recusado

Sistema

loading

empty state

success

error

Handoff para desenvolvimento

Organize os layers, componentes e frames com nomes amigáveis para handoff.

Nomear seções e componentes em inglês técnico

Exemplos:

shopping-landing-page

auth-page

product-grid

product-card

product-details-modal

cart-page

checkout-page

payment-method-selector

success-page

user-profile-page

admin-orders-page

Nomear botões e elementos com labels claros

Exemplos:

btn-login-google

btn-add-to-cart

btn-go-checkout

btn-finish-order

input-email

input-password

textarea-gift-message

Estrutura de rotas sugerida no front-end

O design deve considerar estas rotas:

/shopping

/shopping/login

/shopping/register

/shopping/products

/shopping/products/:slug

/shopping/cart

/shopping/checkout

/shopping/success

/shopping/profile

/shopping/orders

/shopping/admin

Estrutura de dados sugerida para facilitar o back-end

Considere o sistema preparado para as seguintes entidades:

User

id

name

email

passwordHash

provider

avatarUrl

createdAt

Product

id

slug

name

description

price

category

imageUrl

isActive

isFeatured

createdAt

CartItem

id

userId

productId

quantity

createdAt

Order

id

userId

totalAmount

status

paymentStatus

paymentMethod

externalPaymentUrl

createdAt

OrderItem

id

orderId

productId

productName

unitPrice

quantity

totalPrice

GiftMessage

id

userId

orderId

message

createdAt

Regras de UX

experiência simples e emocional

poucos cliques

linguagem carinhosa

interface elegante

sem excesso de informação

foco em conversão com delicadeza

responsivo de verdade

priorizar clareza no mobile

Estilo do texto

Use microcopys românticas, leves e educadas.

Exemplos:

“Escolha um presente com carinho”

“Sua mensagem fará parte da nossa história”

“Obrigado por celebrar esse momento com a gente”

“Seu presente foi recebido com amor”

Pedido final

Entregar o design como um projeto pronto para desenvolvimento, com:

componentes organizados

design system básico

estados de interface

nomes técnicos consistentes

telas desktop e mobile

foco em futura integração com back-end em Node.js/TypeScript

estrutura fácil para implementação de autenticação, carrinho, pedidos e pagamentos