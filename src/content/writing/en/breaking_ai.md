---
locale: en
title: Breaking AI
description: Saudacious remarks about dreaming of eletric sheeps and teenage desires
publishedAt: 2026-03-05
draft: false
featured: true
tags: [security, artificial intelligence, adversarial attacks]
---

#### Foreword

##### First of all, I am not going into all details since my memory is scattered and not that great. Second, I would like to thank all the mentors, teamates, competitors and everyone who helped on the project, either directly, indirectly or hearing me talk excitedly about the progress that me and my team had been doing, I would absolutely not have such a satisfying experience without any of you all, and I hope you at least know that. I am also writing this for the me of 2 years ago, who did not believe any of this was possible, and would have those childlike wonder eyes hearing about it.

----------------------

## Starting out
There was this awkward foundation when the themes were given to each group, ours being "developing mechanisms for protecting AI models", this is a difficult area of research that we had only 6 weeks to develop an ideal solution for. I already had some minor experience on the topic and could help by explaining overall concepts to the team, but we still had trouble defining what categories of adversarial attacks were more efficient, so the created solution to protect against them would be useful. 


## Threat Modeling
`Data poisoning` attacks were relevant at first, until we realized the scope of the AI models being tested were open-weight ones, meaning they can be installed and run on local machines. So the poisoning would be local? We quickly disregarded it as an option together with `Indirect Prompt Injection`, since it operates by the same logic of data poisoning attacks. What we were left with that had a huge possible attack vector were `Direct Prompt Injection` attacks, where an attacker could download a model he knows a company uses and simulate adversarial attacks locally until he finds one that breaches the AI model's defense, then running it directly at the company, leaving it vulnerable to any data exfiltration or possible requests the attacker wishes to make.


## Modeling the Model
Right, now you know the scope of what we are getting at, but how do these attacks really happen? How do our mysterious black boxes called computers understand this text we throw at them and "magically" return us a response to it? Well, here is my abstract explanation of it, divided into 5 parts:


### The Training Process
![By Henrique Arcoverde](public/writing/breaking_ai/training_neural_network.png)
- 3.1.1:  Suppose you have some cat pictures and want to see if they are really cats. Simple, right? You throw the pictures in groups called batches into a neural network, establish a classification mechanism for it and see if those cat pictures you had have been classified correctly as cats, not as dogs.
- 3.1.2: For that, the neural network you used must have been previously trained through supervised learning with their respective weights (open-weight models refers to this) and layers adjusted for an approximate categorization of at least cats and dogs (using large training matrices with a few thousand dimensions (maybe millions, depending on the image sizes used in training)).
- 3.1.3: This graph-like neural network has a training routine in that it's output layer is a binary decider (assuming it only categorizes cats and dogs), with that, the plot it generates for the data collected is two-dimensional, separating cats from dogs (ideally). 


### The Inference Process
- 3.2.1: After training (and during it), these images go through the process of `Forward Propagation` through the model, with every weight and internal layers being relevant for the image classification.
- 3.2.4: You now have a plot that can, given a cat or dog image, establish where it should stay on that plot, with a certain accuracy given. 
- 3.2.1: If the inference is constantly incorrect, you can identify which weights and layers had the most relevance in that misprediction and run a `Backwards Propagation` algorithm to reduce that `Loss Score`. This leads us to the next step, the inference.


### Adversarial Attacks
![By Henrique Arcoverde](public/writing/breaking_ai/adversarial_attacks.png)
- 3.3.1: Someone who desires to misclassify an image and has direct access to the model-weights may algorithmically find the local minimum of the classification function, where the inference line between cats and dogs is drawn, through `Gradient Descent`.
- 3.3.2: There are many different adversarial attacks that exploit this, being classified into `White-Box` and `Black-Box`, the difference lies in the attacker's knowledge. In a white-box attack, the attacker has full access to the model's architecture and weights. In a black-box attack, they do not, so they must probe the model with inputs and study the outputs to infer its weaknesses.
- 3.3.3: A specific white box adversarial attack against images is done as have been said on 3.1, but how are they done against text? Text is discrete; you cannot make "tiny" changes to a word like you can to a pixel and keep the overall structure intact. Changing a single character or word creates a new token, which is a much larger leap in the model's input space. This leads us to the architecture designed to handle text: the `Transformer`.


### Transformers & LLMs
- 3.4.1: Transformers were introduced by Google in 2017 through the article ['Attention is All you Need'](https://arxiv.org/abs/1706.03762), where they describe an architecture that processes entire sequences of data in parallel, rather than one word at a time. The breakthrough is the `Attention Mechanism`, which allows the model to weigh the importance of different words in the input when generating an output. For example, in the sentence "The cat drank its milk because it was hungry," the model uses attention to understand that "it" refers to "the cat, not the milk. This is what enables LLMs to be useful.


### Direct Prompt Injection Attacks
- 3.5.1: This is where it gets interesting, Pliny is probably the person that is leading effective methodologies of `Direct Prompt Injection` attacks, how does he do it? Well, imagine yourself talking to a friend, he describes a situation he had with friends on a bar you never went to, wishing to continue the conversation, you say "that bar where the drinks are so darn hot? I remember they don't even have a freezer!" This, in an AI environment, is called a hallucination. Simply put, it can give wrong information if it mispredicts an appropriate answer.
- 3.5.2: You probably now that by now, but how can you force an hallucination or enable undesired answers from an AI chatbot? Well, simply put, you can overload their cognitive function by inserting random, raw characters that they cannot associate to your request, together with layers of confusion insertion, such as `Token Overload`, `Role Playing` and `Context Switching`.


## Modern Defenses
Since LLMs with transformers are still a new topic (it has been 6 years since the release of GPT-1), the defenses are not that efficient. What has been done is the implementation of 'Guardrails', but what are these? Simply put, they are a sort of firewall that sits between you and the model you wish to talk to, you can have input guardrails or output guardrails, and they use natural language (the language you speak) to block malicious requests or malicious answers. They can be static or infered by another AI. 


## Our Solution
Since we had 6 weeks (42 days) to implement and present a solution for this, our focus went to understanding how the attacks operated and comparing different models robustness against these attacks. We modeled an automated attack framework using DrAttack, PAIR, Code Switching and others to test the two open weight models we had. With malicious/benign seeds and wrapping attacks around them we could test how the models acted against attacks in different languages. 


## Development Process
First, we modeled the attack architecture, there is an attacker AI model we call "mutator", since he iteratively improves the wrappings around the seed by mutating the phrase. There is a "victim" model, that receives the inputs from the mutator and directs the request to a "judge", which scores the response from the victim into being benign or malicious.  

## Architecting the Solution
![Solution Architecture](public/writing/breaking_ai/architecture.png)
First, we modeled the attack architecture. There is an attacker AI model we call "mutator", since it iteratively improves the prompts for the victim by mutating the phrase. There is a "victim" model that receives inputs from the mutator and directs the response to a "judge", which marks the victim's response as being benign or malicious, along with other metrics. After that, these data need to be processed, or at least interpreted. So we made the judge's responses stored in clusters of CSVs, separated between tested model and test language, the main parameters of our research. With that in place, we also created an interactive summary that groups the CSVs and facilitates reading the results.

## The Three Fronts
From that point on, since our team was multidisciplinary, we "separated" the deliverables into: deepening the paper, tool/solution scalability, and usability/ease of use. My main concern, since we had a proof of concept made only for our use case, was to allow different groups to use the solution according to their testing needs. Therefore, we could expand the possible use both at hardware level and tested models, being both local models and API-based, with a graphical tool to assist.

## Paper Discovery
## Descobertas do Artigo

Levantamos a hipótese de que a linguagem poderia ser um facilitador importante de ataques, dependendo de como foram treinados. Ainda acredito que poderia ser, mas descobrimos que não há diferença significativa entre Português e Inglês, mesmo com treinamento predominantemente em nossa linguagem. Consideramos, no final do projeto, expandir as linguagens testadas, mas como nosso projeto tem complexidade exponencial, executar testes para expandir a hipótese tornou-se inviável, especialmente com custos de infraestrutura.

### A Ferramenta (Não a banda)

O que é interessante sobre a ferramenta é que ela permite o uso de predefinições e seleção de diferentes mutadores, vítimas e juízes, funcionando com GPUs NVIDIA, AMD, Intel e Apple para paralelização tanto dos ataques quanto dos modelos testados, executando-os em diferentes núcleos (se você tiver a infraestrutura para fazer isso, é claro). E como disse, os resultados são visíveis através do próprio CLI ou você pode criar um arquivo HTML que o condensa para outra forma de visualizá-lo.

```
Detalhe engraçado: Dois dias após o final do nosso projeto, Pliny lançou a ferramenta OBLITERALUS, que é bem similar à nossa.
```

### A Ferramenta Gráfica

Ainda precisávamos de uma forma de permitir que usuários não-técnicos usassem nossa ferramenta, então prototipamos uma GUI que é uma expansão da ferramenta CLI, nomeada Inje.X (após prompt injection) e planejamos que tivesse as mesmas funcionalidades que a ferramenta original tinha, sendo elas: predefinições, seleção de modelos, seleção de métodos, multiplataforma. Você não seria capaz de alterar os arquivos para importar novas sementes, mas existe a ferramenta original que permite isso, então..?



## Conclusion
It was six great weeks, I got to be in an environment where I was challenged daily by enthusiastic people who wanted to be there and laugh freely, challenging ourselves together, "because the only way of doing impossible things is to have fun while you do them, and to get surrounded by people that are smarter than you are". It marked me in a way that I already remember fondly. I'm happy with what we managed to do with the project, and we only succeeded thanks to all the support and structure provided.


#### "IF I could see farther, was by standing on the shoulders of giants."
- #### - Isaac Newton


----------------

# Resources & References:
- [CISSA Tool](https://github.com/pauloed94/cissa-tool)
- [Neural Networks by 3Blue1Brown](https://youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi&si=vs3WlOPWixxmOj9b)
- [Attention is All you Need](https://arxiv.org/abs/1706.03762)

#### Extra Resources for the Curious
- [LLM Neuroanatomy: How I Topped the LLM Leaderboard Without Changing a Single Weight](https://dnhkng.github.io/posts/rys/)
- [https://github.com/elder-plinius](https://github.com/elder-plinius)