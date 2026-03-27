---
locale: pt
sourceSlug: valdoria_ctf
sourceHash: pending
title: CTF de Valdoria
description: Voltando à 1984, Buscando por "bandeiras"
publishedAt: 2026-03-14
draft: false
featured: true
tags: [security, pentesting, capture the flag]
---

## Contexto Inicial

Durante o processo de estágio da Tempest Security Intelligence, participei da etapa de prova técnica, que tinha 64 questões e 5 dias para conclusão. Nela, foram apresentadas 2 questões na área de Consultoria Técnica que requeriam acesso ao site que descreverei a seguir, que são:

1: Qual o valor do Fundo Soberano Secreto presente na dashboard do operador?

2: Após decifrar o arquivo secreto, qual o verdadeiro nome do(a) espião/espiã de Valdoria?

Este é o writeup de como foi feito.

## Compreendendo a Aplicação

Fui introduzido ao site do governo fictício por uma tela inicial com uma "fleur-de-lis", representando a nobreza francesa, com o resto do site apresentando uma estética que é claramente inspirada pelo livro 1984. 

Temos uma página inicial, que exibe um mapa com descrições sobre cada província e atualizações dos indicadores econômicos fictícios da república.
Um blog onde falam sobre acontecimentos gerais recentes da nação. Documentos onde são apresentadas informações governamentais e confidenciais.
Contato, onde você pode fazer sugestões de melhoria por um formulário.
Alistamento, onde você "pode" se alistar (por coerção).
Uma página de login, que é acessada pelo caminho ``/administrator``.


## Navegando (ou Spidering)

Mapeando a aplicação com a ferramenta BurpSuite, reparei dentro de ``/documentos`` os documentos restritos, com permissão de acesso somente em 2028 e 2031, respectivamente. Ficou aparente que a flag ou possível pista estaria por ali, comecei a ver então como era estruturada a requisição dos downloads para os arquivos disponíveis e, após certo tempo, percebo a requisição ``GET /api/documents``, me apresentando a seguinte resposta (abreviada pelo tamanho). Claramente uma vulnerabilidade IDOR.

``` JSON
[
  {
    "id": "ffc12911f62475e3d7dca83444ca605d",
    "title": "Decreto Nº 1.247 — Regulamentação do Comércio Interprovincial",
    "category": "Decreto",
    "date": "2025-11-15",
    "description": "Regulamenta o comércio entre as províncias de Valdoria, estabelecendo taxas e procedimentos alfandegários internos.",
    "classified": false,
    "fileSize": "245 KB",
    "author": "Ministério do Comércio e Indústria",
    "downloadUrl": "/api/documents/ffc12911f62475e3d7dca83444ca605d/download",
    "locked": false
  },
  {
    "id": "a46ed6282a1e70f160cf5b29c39cd82a",
    "title": "Memorando Interno Nº 0087/2026 — Contratação para o Setor de TI",
    "category": "Memorando",
    "date": "2026-01-22",
    "description": "Comunica a contratação de novo profissional para o setor de TI e a criação do Sistema de Gerenciamento de Recursos de Valdoria.",
    "classified": true,
    "releaseDate": "2028-01-22",
    "fileSize": "— — —",
    "author": "Ministério da Tecnologia e Inovação",
    "downloadUrl": "/api/documents/a46ed6282a1e70f160cf5b29c39cd82a/download",
    "locked": true
  },
  {
    "id": "2898aded643bfc3f68d8d42b7012848b",
    "title": "Operação Aurora Boreal — Relatório de Inteligência",
    "category": "Inteligência",
    "date": "",
    "description": "[ULTRASSECRETO] Relatório completo sobre operações de inteligência na fronteira norte de Valdoria.",
    "classified": true,
    "releaseDate": "2031-01-22",
    "fileSize": "— — —",
    "author": "Diretoria de Inteligência Nacional",
    "downloadUrl": "/api/documents/2898aded643bfc3f68d8d42b7012848b/download",
    "locked": true
  }
]
```


## Bloco Cifrado?

Seguindo a requisição ``GET /api/documents/2898aded643bfc368d8d42b7012848b/download``, faço o download do arquivo PDF que contém um bloco de mensagem cifrada com AES256.

![Mensagem_cifrada](public/writing/valdoria_ctf/cifrado.png)
``` Bloco referente: 
aa18bb7a48d5dca23f1ad5c17588a62024b5dc05630fad5c4e15f9204f0f58cf0e40f5a8a68f6b5cf53d2106365a2c634734991cc72e4a341829f24b85cb319e81a093c28eeb0830d3d40fed7e69d408ac9e96d5cfda0c55e6c179fa4ba367744c8677b36897c532227e4b4fa1cd6ec46d7060af1f4c2ae9c4d07d6515d4221aea461ea72b7ee0142e7f9cfec9ee9fd766a6edae8b55433c6ba20ca5d344efd3f3c831689c8a948df8b0fcbecf7888c9f93a24de2aafd42dbf16e8fc2137d392ce5e5af7784685dcb2480499384f8efa9f9a846c2ddabcc99312fd52422f2a2a614b40e946a376b12ed0d7e683870c9b6f7ab6ca7d7c81df2dc220ce280dedefffa6c026d29d5881248f63634895aafd991b6db6c1e05aefc9376951fee65ae8501353e32efa7df95d2b44e971fd744ed280f99c825bdef279ceaaaa87e2d9ba0b2087c3c1e97dea988613ed3451664259d4ee395dfc12d7e340c4a1e36c74eee02711bc4e94040b7224382ed404eab35aba6e55468920348ee631c9cbf567b289d8803ce98c77eebb87f04520de67387b5b8bb5c2c156f419b0ade7fe875d6ab9bde4823b3a8fd0e70601344b378cbb554878e3a104f1132fda9918cd0e68f86205d6c780961d5cc57a9af36b1976602bf6836651ce18680f30d696ec8886ecfb2feaf68127a142d311aa241f0750cfbca58b23f0a0533e6d4a7448ea0072b9011aa9a3676ac3963e163cd34cd7b82625df4550d822961e892ac5d91485ee9e0c112a28b620782e1748723a7f87ae80c24cab1df8fcec8751c2ccb516c7bf13229d1d8d8c455ae63a4c3624b6abe6b2e9a8fd18f1c5a689f3b00960fccb7ee5896afce09a1789730395e8886dbe8bb212be4ae4110b4fb4bf6ab3285737850e4d88dd93f26b8acee1369e83914b4e8d373c9af73c99048c28a402e27090a702db0652ec2faf2e95b792de63ea6f18554d316f89b58a21ec7b116756a9ffffef5584b123978b182eb666a75b05503438bed194f232f04d056fd82f9c2960ee1ab5e1b665c75ea56cd4df378c0c77bc3e916df817865b0b253fcea292c8fb600bcebe0b796fc1d3f817171018d39266789b91b9c3dc348f11cd0b59eb8c65c19eb1148332f6d6518e3172c790ed1abb224a2b17e64f7d6ebb93b5666e91abe50f39b0485c47a80433f7fb6f16460746fbc724b2c5f863c3a055854ab48f74c6489c86cea6cdcbb22596c82ea3c76702a4684747e1e28c1c6fe276e280f9cadb08896e24b91ff56d84ed49ca3fa5bb14301326ab6e89318789aa8956c6d35e9a492c249af303c0e84adfe7a735308ab576bfc7d07c6f89313027911b5154b9386222da442fe757532c0d42a7bc19b6ed8a49a7639c8737907fbc8ef4bc698880484db6f2640b542714ad7205a88e20ebdc79b5b47a97836734438d5f4ff4516c8d1fce3959435958d6844be1788b4b650b68bc633c8dfa7c85671656298ce27b646122966b3c4a46dda0ae32274d57335a8d66e2030977c39f25088ea2998912ef739c0d01568f79ec35f1792d0f5fdde5a9cb908da8d050fba866c06dc798bf6a05fc98d939d092e44562c21584dbac8ba887e2b4232737e50e9f1b630e6576030902a803b84187d22c97d3cf7dc91d2c6be0d66e3774521f28d186df93801851b69cbdc754fb2b2f091202925d95d4de50b4578a1ae1b48802734d63e5d257a9af6731e6f59c34e4102bc08994ab49fbfd365add0d3b1ffe49d86e014a4085ca9350a6a7609c7e29bfe905ff5dabbcf23dc5eab2c95fdda040a0d933397d681b04c540a7899d1b8ed8d6a0a7c9b3bc0286471730bdd6e0dd26c3d6e2be35e51f8dc06cd5f382fb90a66546a480f2a8d4dc80e7237878a140fc0db79d8e09059e5cf91960433b014314366afda56ae54c826162b0c9a55a9d97623327f7010135bf6ada659116912f970b48511399d68e8aa487f52d4c66a1809c58af655ed8cc
```

Importando 'pycryptodome' em uma venv Python e executando o código abaixo, pude descriptografar o arquivo.

```python
from Crypto.Cipher import AES
from Crypto.Hash import SHA256
import binascii

# 0. Seed e Mensagem Cifrada
data_semente = "22-01-2026"
payload_hex = "aa18bb7a48d5dca23f1ad5c17588a62024b5dc05630fad5c4e15f9204f0f58cf0e40f5a8a68f6b5cf53d2106365a2c634734991cc72e4a341829f24b85cb319e81a093c28eeb0830d3d40fed7e69d408ac9e96d5cfda0c55e6c179fa4ba367744c8677b36897c532227e4b4fa1cd6ec46d7060af1f4c2ae9c4d07d6515d4221aea461ea72b7ee0142e7f9cfec9ee9fd766a6edae8b55433c6ba20ca5d344efd3f3c831689c8a948df8b0fcbecf7888c9f93a24de2aafd42dbf16e8fc2137d392ce5e5af7784685dcb2480499384f8efa9f9a846c2ddabcc99312fd52422f2a2a614b40e946a376b12ed0d7e683870c9b6f7ab6ca7d7c81df2dc220ce280dedefffa6c026d29d5881248f63634895aafd991b6db6c1e05aefc9376951fee65ae8501353e32efa7df95d2b44e971fd744ed280f99c825bdef279ceaaaa87e2d9ba0b2087c3c1e97dea988613ed3451664259d4ee395dfc12d7e340c4a1e36c74eee02711bc4e94040b7224382ed404eab35aba6e55468920348ee631c9cbf567b289d8803ce98c77eebb87f04520de67387b5b8bb5c2c156f419b0ade7fe875d6ab9bde4823b3a8fd0e70601344b378cbb554878e3a104f1132fda9918cd0e68f86205d6c780961d5cc57a9af36b1976602bf6836651ce18680f30d696ec8886ecfb2feaf68127a142d311aa241f0750cfbca58b23f0a0533e6d4a7448ea0072b9011aa9a3676ac3963e163cd34cd7b82625df4550d822961e892ac5d91485ee9e0c112a28b620782e1748723a7f87ae80c24cab1df8fcec8751c2ccb516c7bf13229d1d8d8c455ae63a4c3624b6abe6b2e9a8fd18f1c5a689f3b00960fccb7ee5896afce09a1789730395e8886dbe8bb212be4ae4110b4fb4bf6ab3285737850e4d88dd93f26b8acee1369e83914b4e8d373c9af73c99048c28a402e27090a702db0652ec2faf2e95b792de63ea6f18554d316f89b58a21ec7b116756a9ffffef5584b123978b182eb666a75b05503438bed194f232f04d056fd82f9c2960ee1ab5e1b665c75ea56cd4df378c0c77bc3e916df817865b0b253fcea292c8fb600bcebe0b796fc1d3f817171018d39266789b91b9c3dc348f11cd0b59eb8c65c19eb1148332f6d6518e3172c790ed1abb224a2b17e64f7d6ebb93b5666e91abe50f39b0485c47a80433f7fb6f16460746fbc724b2c5f863c3a055854ab48f74c6489c86cea6cdcbb22596c82ea3c76702a4684747e1e28c1c6fe276e280f9cadb08896e24b91ff56d84ed49ca3fa5bb14301326ab6e89318789aa8956c6d35e9a492c249af303c0e84adfe7a735308ab576bfc7d07c6f89313027911b5154b9386222da442fe757532c0d42a7bc19b6ed8a49a7639c8737907fbc8ef4bc698880484db6f2640b542714ad7205a88e20ebdc79b5b47a97836734438d5f4ff4516c8d1fce3959435958d6844be1788b4b650b68bc633c8dfa7c85671656298ce27b646122966b3c4a46dda0ae32274d57335a8d66e2030977c39f25088ea2998912ef739c0d01568f79ec35f1792d0f5fdde5a9cb908da8d050fba866c06dc798bf6a05fc98d939d092e44562c21584dbac8ba887e2b4232737e50e9f1b630e6576030902a803b84187d22c97d3cf7dc91d2c6be0d66e3774521f28d186df93801851b69cbdc754fb2b2f091202925d95d4de50b4578a1ae1b48802734d63e5d257a9af6731e6f59c34e4102bc08994ab49fbfd365add0d3b1ffe49d86e014a4085ca9350a6a7609c7e29bfe905ff5dabbcf23dc5eab2c95fdda040a0d933397d681b04c540a7899d1b8ed8d6a0a7c9b3bc0286471730bdd6e0dd26c3d6e2be35e51f8dc06cd5f382fb90a66546a480f2a8d4dc80e7237878a140fc0db79d8e09059e5cf91960433b014314366afda56ae54c826162b0c9a55a9d97623327f7010135bf6ada659116912f970b48511399d68e8aa487f52d4c66a1809c58af655ed8cc"

# 1. Derivando a Chave por SHA256
key = SHA256.new(data_semente.encode()).digest()

# 2. Preparando os dados
full_data = binascii.unhexlify(payload_hex)
iv = full_data[:16]  # Primeiros 16 bytes
ciphertext = full_data[16:]

# 3. Descriptografando
cipher = AES.new(key, AES.MODE_CBC, iv)
plaintext = cipher.decrypt(ciphertext)

print(plaintext.decode('utf-8', errors='ignore'))
```
Assim, temos a descriptografia desse texto no seguinte:

```
RELATÓRIO ULTRASSECRETO — OPERAÇÃO AURORA BOREAL

Este documento contém informações de máximo sigilo sobre as operações de inteligência conduzidas na fronteira norte de Valdoria.

INFORMANTE INFILTRADO — IDENTIDADE REAL:

O agente conhecido pelo codinome ECLIPSE, posicionado na operação de contraespionagem em Nova Petrovsk, possui identidade civil confirmada como Tavares Lunik Bernardi. Esta informação é classificada como ULTRASSECRETA e sua divulgação constitui crime contra a segurança nacional.

Tavares Lunik Bernardi foi recrutado em 2023 pelo programa de inteligência avançada e desde então opera sob cobertura diplomática. Sua verdadeira identidade não consta em nenhum registro público ou sistema governamental acessível por funcionários comuns.

AGENTES ATIVOS:

- Agente FALCÃO: Posição ativa na embaixada de Koranthia
- Agente SOMBRA: Rede de informantes na zona desmilitarizada
- Agente ECLIPSE (Tavares Lunik Bernardi): Operação de contraespionagem em Nova Petrovsk

ORÇAMENTO SECRETO:
Total alocado: V$ 847.000.000 (oitocentos e quarenta e sete milhões de valdorianos)
Canal de financiamento: Fundo Soberano de Desenvolvimento — Conta 7781-X

Este documento foi cifrado para proteção. Se você está lendo isto, a segurança nacional de Valdoria foi comprometida.

Diretoria de Inteligência Nacional — ULTRASSECRETO
```
Que leva a descoberta da segunda questão. 

"Tavares Lunik Bernardi".


``PS: Por curiosidade, vim a descobrir depois que eu poderia ter utilizado o arquivo em GO já providenciado pela dashboard do administrador, mas também teria que implementar a lógica para descriptografar.
``

## JS Obfuscado

Após desvendar o espião, passei um tempo testando pelo ``/administrator`` os usuários FALCÃO, SOMBRA e ECLIPSE com inúmeras senhas e possíveis strings que encontrei pelo site. Até que, analisando pelo código-fonte do site por possíveis informações adicionais, encontro uma série de imports para arquivos javascript obfuscados, contendo apenas únicos caracteres que descrevem variáveis, funções, erros, etc. Entender a lógica contida nesses arquivos obfuscados foi de longe o que mais comeu meu tempo nesse CTF. Em certo ponto, percebi que a requisição para ``GET /administrator`` continha na resposta imports adicionais em relação as outras páginas, sendo um deles em especial o caminho ``/nodes/5.MX7mcFll.js``, que continha as funções referentes à autenticação, permitindo que, através da análise do código, um usuário pudesse fazer requisições ignorando completamente o CAPTCHA, possibilitando tentativas de acesso por força-bruta. Ou, como vou descrever, forjar um token.

## Falsificação do Token

A função de autenticação é essa. Então me veio a dúvida, e se eu tentar me passar pelo administrador?
``` javascript
function La(E, j) {
  Xe(j, !0);
  let A = S(null),
    G = S(Ye([])),
    $ = S(!0),
    ee = S(""),
    fe = S(""),
    z = S("modules"),
    L = S("operador"),
    we = S("operador"),
    D = S("");
  Qe(() => {
    const i = localStorage.getItem("valdoria_admin_token");
    if (!i) {
      Se("/administrator");
      return;
    }
    const v = xa(i);
    (_(L, v.role || "operador", !0),
      _(we, v.sub || "operador", !0),
      oa(i)
        .then((x) => {
          (_(A, x, !0), _($, !1));
        })
        .catch((x) => {
          (_(ee, x.message, !0), _($, !1));
        }),
      da(i)
        .then((x) => {
          (_(G, x, !0), _(D, ""));
        })
        .catch((x) => {
          x.message.includes("403") || x.message.includes("permissÃ£o")
            ? _(
                D,
                "Acesso negado. NÃ­vel de permissÃ£o insuficiente. Requer: administrador.",
              )
            : _(D, x.message, !0);
        }));

    ...

    (pe = Y(re, 1, "role-badge svelte-aeqxex", null, pe, {
    "role-admin": e(L) === "administrador",
    })),
```

Aqui usei o CyberChef para assinar o token, configuração padrão.

![Criação do Token](public/writing/valdoria_ctf/assinando_token.png)

Logo em seguida fiz a injeção do token pelo console.

![Injeção do Token](public/writing/valdoria_ctf/injetando_token.png)

## Acessando a Dashboard

Ao inserir o caminho ``administrator/dashboard`` na URL, temos acesso ao dashboard do Administrador!

![Dashboard](public/writing/valdoria_ctf/dashboard.png)

Assim, se responde a primeira questão:

"Orçamento Secreto: 12.8B"


````
PS: Lembra sobre aquele código em GO que eu falei que poderia ter reduzido o tempo que levei escrevendo em Python? Aqui tá ele :P
````
![sphinx.go](public/writing/valdoria_ctf/arquivos_dashboard.png)
## Encerramento

Foi divertido encontrar essas falhas, vulnerabilidades assim são comuns e muitos ignoram as possíveis consequências disso quando estruturam suas apllicações, vazamento de informações sensíveis e confidenciais ocorrem constantemente por vacilos expostos assim, que isso seja um lembrete da relevância de estruturar aplicações que minimizem essa superfície.