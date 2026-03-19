---
locale: pt
sourceSlug: breaking_ai
sourceHash: pending
title: Quebrando IAs
description: Pontuando saudades sobre sonhos com ovelhas elétricas e desejos adolescentes
publishedAt: 2026-03-05
draft: false
featured: true
tags: [security, artificial intelligence, adversarial attacks]
---

#### Prefácio

##### Para começar, não vou entrar em pequenos detalhes porque minha memória é bagunçada. Quero agradecer a todos os mentores, colegas de equipe, competidores e todos que ajudaram no projeto, direta, indiretamente ou me ouvindo falar empolgado sobre o progresso que eu e minha equipe estávamos fazendo. Eu com certeza não teria uma experiência tão satisfatória sem todos vocês e espero que saibam disso. Estou escrevendo isso também para o eu de 2 anos atrás, que não acreditava que isso seria possível e teria aqueles olhos de curiosidade infantil ouvindo sobre isso.

----------------------

## O Início
Tinha uma sensação estranha quando os temas foram dados a cada grupo, o nosso sendo "desenvolver mecanismos para proteger modelos de IA". Essa é uma área difícil de pesquisa que tínhamos apenas 6 semanas para desenvolver uma solução ideal. Eu tinha uma pequena experiência no tópico e pude ajudar explicando conceitos gerais pro time, mas ainda tivemos dificuldade em definir quais categorias de ataques adversariais eram mais eficientes, para a solução criada para se proteger deles de forma útil.


## Modelagem de Ameaças
Ataques de `Data Poisoning` foram relevantes no início, até percebermos que o escopo dos modelos de IA testados eram de peso aberto, significando que podem ser instalados e executados em máquinas locais. Então o envenenamento seria local? Rapidamente descartamos como opção junto com `Indirect Prompt Injection`, pois opera pela mesma lógica dos ataques de Data Poisoning. O que nos restou e tinha um grande vetor de ataque possível foram ataques de injeção de prompt, onde um atacante poderia baixar um modelo que sabe que uma empresa usa e simular ataques adversariais localmente até encontrar um que quebre a defesa do modelo, então executá-lo diretamente na empresa, deixando-a vulnerável a qualquer exfiltração de dados ou possíveis solicitações que o atacante deseje fazer.


## Modelando o Modelo
Agora você sabe o escopo do que planejamos, mas como esses ataques realmente acontecem? Como essas caixas pretas chamadas computadores entendem este texto que jogamos nelas e "como num truque de mágica" nos retornam uma resposta? Aqui tá a minha explicação disso, em 5 partes:


### Processo de Treinamento
![Por Henrique Arcoverde](public/writing/breaking_ai/training_neural_network.png)
- 3.1.1: Imagine que você tem algumas fotos de gatos e quer saber se eles são realmente gatos. Simples, certo? Você joga as imagens em grupos chamados lotes em uma rede neural, estabelece um mecanismo de classificação para ela e vê se essas imagens de gatos que você tinha foram classificadas corretamente como gatos, não como cachorros.
- 3.1.2: Para isso, a rede neural que você usou deve ter sido previamente treinada através de aprendizado supervisionado com seus respectivos pesos (modelos de peso aberto se referem a isso) e camadas ajustadas para uma categorização aproximada de pelo menos gatos e cachorros (usando grandes matrizes de treinamento com alguns milhares de dimensões (talvez milhões, dependendo dos tamanhos de imagem usados no treinamento)).
- 3.1.3: Esta rede neural semelhante a um grafo tem uma rotina de treinamento em que sua camada de saída é um decisor binário (assumindo que ela apenas categoriza gatos e cachorros), com isso, o gráfico que ela gera para os dados coletados é bidimensional, separando gatos de cachorros (idealmente).


### Processo de Inferência
- 3.2.1: Após o treinamento, essas imagens passam pelo processo de `Forward Propagation` pelo modelo, com cada peso e camadas internas determinando a classificação daquela imagem.
- 3.2.2: Você agora tem um gráfico que pode, dada uma imagem de gato ou cachorro, estabelecer onde ela deveria estar naquele gráfico, com uma certa precisão. Isso te permite fazer inferências por esse gráfico.
- 3.2.3: Se a inferência estiver constantemente incorreta, você pode identificar quais pesos e camadas tiveram maior relevância naquela previsão errada e executar um algoritmo de `BackProgapation` para reduzir esse `Loss Score`. Isso nos leva ao próximo passo, como os ataques acontecem.


### Ataques Adversariais
![Por Henrique Arcoverde](public/writing/breaking_ai/adversarial_attacks.png)
- 3.3.1: Alguém que deseja classificar incorretamente uma imagem e tem acesso direto aos pesos do modelo pode encontrar algoritmicamente o inverso local da função de classificação, onde a linha de inferência entre gatos e cachorros é desenhada, através de técnicas de otimização. Podendo ser `Gradient Ascent` ou `Gradient Descent`.
- 3.3.2: Existem muitos ataques adversariais diferentes que exploram isso, sendo classificados em `White Box` (Caixa Branca) e `Black Box` (Caixa Preta), a diferença reside no conhecimento do atacante. Em um ataque de caixa branca, o atacante tem acesso completo à arquitetura e pesos do modelo. Em um ataque de caixa preta, eles não têm, então devem sondar o modelo com entradas e estudar as saídas para inferir suas fraquezas.
- 3.3.3: Um ataque adversarial específico de caixa branca contra imagens é feito como foi dito em 3.1, mas como são feitos contra texto? Texto é discreto; você não pode fazer mudanças "minúsculas" em uma palavra como pode fazer em um pixel e manter a estrutura geral intacta. Mudar um caractere ou palavra cria um novo token, que é um salto  maior no espaço de entrada do modelo. Isto leva a gente à arquitetura projetada para lidar com texto: o `Transformer`.


### Transformers e LLMs
- 3.4.1: Transformers foram introduzidos pelo Google em 2017 pelo artigo ['Attention is All You Need'](https://arxiv.org/abs/1706.03762), onde eles descrevem uma arquitetura que processa sequências de dados em paralelo, em vez de uma palavra por vez. O avanço é o `Attention Mechanism`, permitindo que o modelo pondere o contexto de diferentes palavras na entrada ao gerar uma saída. Por exemplo, na frase "O gato bebeu seu leite porque estava com fome," o modelo usa atenção para entender que "estava" se refere ao "gato", não ao leite. Isso é o que permite que LLMs sejam úteis.


### Ataques de Injeção de Prompt Direto
- 3.5.1: Aqui fica interessante, temos inúmeras maneiras de conceituar esses ataques, Pliny é a pessoa que lidera as metodologias mais eficazes de ataques de `Direct Prompt Injection`. Imagine você conversando com um amigo, ele descreve uma situação que teve com amigos em um bar que você nunca foi e querendo continuar a conversa, você diz "aquele bar onde as bebidas são quentes? Lembro que eles nem têm um freezer!" Isso com IAs é chamado de alucinação. Ela pode dar informações erradas se prever erroneamente uma resposta adequada.
- 3.5.2: Você já deve saber isso, mas como você forçaria uma alucinação de chatbot? Você pode sobrecarregar suas funções cognitivas inserindo caracteres aleatórios e randômicos que eles não conseguem associar ao seu pedido, junto com camadas de confusão, como `Token Overload`, `Role Playing` e `Context Switching`.


## Defesas Modernas
Como LLMs com transformers ainda são um tópico novo (fazem 6 anos que o GPT-1 lançou), as defesas não são suficientemente eficientes. O que foi feito é a implementação de 'Guardrails', que são uma espécie de firewall que fica entre você e o modelo que deseja conversar, você pode ter guardrails de entrada ou saída e eles usam linguagem natural (o idioma que você fala) para bloquear solicitações maliciosas ou respostas maliciosas. Podem ser estáticos ou inferidos por outra IA.


## Nossa Solução
Como tínhamos 6 semanas (42 dias) para implementar e apresentar uma solução para isso, nosso foco foi em entender como os ataques operavam e comparar a robustez de diferentes modelos locais contra esses ataques, treinados em português e em inglês. Modelamos um framework de ataque automatizado usando `DrAttack`, `PAIR`, `Code Switching` e outros métodos para testar os dois modelos de peso aberto que tínhamos acesso. Com seeds maliciosas e benignas, testamos como os modelos agiam contra ataques em diferentes idiomas.


## Arquiteturando a Solução
![Arquitetura da Solução](public/writing/breaking_ai/architecture.png)
Primeiro, modelamos a arquitetura de ataque. Há um modelo de IA atacante que chamamos de "mutator", já que melhora iterativamente os prompts para a vítima, mutando a frase. Há um modelo "vítima", que recebe as entradas do mutador e direciona a resposta para um "juiz", que marca a resposta da vítima como sendo benigna ou maligna, junto à outras métricas. Após isso, esses dados precisam ser processados, ou, ao menos, interpretados. Então fizemos com que as respostas do juíz fossem armazenadas em aglomerados de CSVs, sendo eles separados entre modelo testado e idioma do teste, os principais parâmetros da nossa pesquisa. Com isso pronto, fizemos também um sumário interativo, que agrupa os CSVs e facilita a leitura dos resultados.


## As três frentes
A partir desse ponto, já que nosso time era multidisciplinar, "separamos" a entrega em: aprofundamento do paper, escalabilidade da ferramenta/solução e usabilidade/facilidade de uso. Minha preocupação principal, já que tinhamos uma prova de conceito feita somente pro nosso caso de uso, foi permitir que diferentes grupos utilizassem a solução, de acordo com a necessidade de teste deles. Portanto, poderíamos expandir o possível uso tanto a nivel de hardware quanto de modelos testados, sendo tanto modelos locais quanto por API, com uma ferramenta gráfica para auxiliar. 


## Descoberta do Paper
Tínhamos como hipótese que o idioma poderia ser um grande facilitador de ataques, dependendo de como eles são treinados. Ainda creio que podem ser, mas tivemos a descoberta que não há grande diferença entre português e inglês, mesmo com um treinamento majoritário no nosso idioma. Cogitamos, pelo fim do projeto, expandir os idiomas testados, mas já que nosso projeto tem complexidade exponencial, executar os testes pra expandir a hipótese se tornou inviável, ainda mais com os gastos em infraestrutura (se brincar, Paulo ainda tá chorando).


## A Ferramenta
O que é interessante sobre a ferramenta é que ela permite o uso de presets e seleção de diferentes mutators, vítimas e juízes, funcionando com GPUs NVIDIA, AMD, Intel e Apple para paralelização tanto dos ataques quanto dos modelos testados, executando eles em diferentes núcleos (se você tiver a infraestrutura para fazer isso, é claro). E como disse, os resultados são visíveis através do CLI ou você pode solicitar a criação de um arquivo HTML condensado que facilita essa visualização.

```
Detalhe engraçado: Dois dias após o final do nosso projeto, Pliny lançou a ferramenta OBLITERALUS, que é bem similar à nossa.
```

## A Ferramenta Gráfica
Ainda precisávamos de uma forma de permitir que usuários não-técnicos usassem nossa ferramenta, então prototipamos uma GUI que é uma expansão da ferramenta CLI, nomeada Inje.X (de prompt injection) e planejamos que tivesse as mesmas funcionalidades que a ferramenta original tinha, sendo elas: presets, seleção de modelos, seleção de métodos, multiplataforma. Você não conseguiria alterar os arquivos para importar novas sementes, mas existe a ferramenta original que faz isso, então..?


## Conclusão
Foram ótimas 6 semanas, onde pude estar em um ambiente que fui diariamente desafiado com gente animada, que queria estar ali e rir à toa, se desafiando junto, "já que a única forma de fazer coisas impossíveis é se divertir enquanto faz, se rodeando de gente mais inteligente que você". Me marcou de uma forma que já lembro saudoso. Fico feliz com o que conseguimos fazer com o projeto, e só conseguimos graças a todo o apoio e estrutura fornecidos.


#### "Se eu vi mais longe, foi por estar sobre ombros de gigantes."
- #### - Isaac Newton


------------------------------------------


# Recursos e Referências:
- [CISSA TOOL/Inje.X](https://github.com/pauloed94/cissa-tool)
- [Redes Neurais por 3Blue1Brown](https://youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi&si=vs3WlOPWixxmOj9b)
- [Attention is All you Need](https://arxiv.org/abs/1706.03762)

#### Recursos Extras para os Curiosos
- [LLM Neuroanatomy: How I Topped the LLM Leaderboard Without Changing a Single Weight](https://dnhkng.github.io/posts/rys/)
- [https://github.com/elder-plinius](https://github.com/elder-plinius)