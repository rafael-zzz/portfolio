---
locale: en
title: Breaking AI
description: Saudacious remarks about dreaming of eletric sheeps and teenage desires
publishedAt: 2026-03-05
draft: false
featured: true
tags: [security, artificial intelligence, adversarial attacks]
---

#### Introduction

##### First of all, I am not going into all details since my memory is not that great. Second, I would like to thank all the mentors, teamates, competitors and everyone who helped on the project, either directly, indirectly or hearing me talk excitedly about the progress that me and my team had been doing, I would absolutely not have such a satisfying experience without any of you all, and I hope you at least know that. I am also writing this for the me of 2 years ago, who did not believe any of this was possible, and would have those childlike wonder eyes hearing about it.

---

#### Key Concepts

**Adversarial Attacks**: Optimization techniques used to find modified inputs that cause incorrect classifications in AI models, exploiting vulnerabilities in the model's decision function.

**Prompt Injection**: An attack where a malicious user inserts unauthorized instructions or data into a prompt to manipulate LLM behavior and obtain undesired responses.

**Guardrails**: A protective system between the user and the model that filters inputs and outputs using natural language to block malicious requests or responses.

**Forward Propagation**: The process during which input data passes through neural network layers, with each weight determining the final classification or prediction.

**Back Propagation**: An algorithm that calculates error gradients relative to weights, enabling adjustments to reduce the model's loss score.

**Loss Score**: A metric that quantifies the error between model predictions and expected values during training.

**Gradient Descent**: An optimization algorithm that calculates the direction of steepest error decrease by iteratively adjusting model weights in the opposite direction of the gradient, progressively reducing loss.

**Gradient Ascent**: A variation of Gradient Descent that moves in the direction of steepest gradient increase, used in adversarial attacks to maximize model error and find inputs causing incorrect classifications.

**Token**: A discrete unit of text (character, word, or subword) that the model processes as input.

**Transformers**: A neural architecture based on an attention mechanism that processes data sequences in parallel, allowing the model to weigh the context of different words when generating outputs.

**Mutator**: A function or method that iteratively modifies prompts to exploit vulnerabilities in a victim AI model, evolving the attack through optimization techniques.

**Judge**: A component that evaluates victim model responses, classifying them as benign or malicious and collecting metrics for analyzing adversarial attacks.

**Victim**: The target AI model that receives modified prompts from the mutator and generates responses evaluated by the judge to measure its robustness against prompt injection attacks.

## Starting out

There was this awkward foundation when the themes were given to each group, ours being "developing mechanisms for protecting AI models", this is a difficult area of research that we had only 6 weeks to develop an ideal solution for. I already had some minor experience on the topic and could help by explaining overall concepts to the team, but we still had trouble defining what categories of adversarial attacks were more efficient, so the created solution to protect against them would be useful.

## Threat Modeling

`Data poisoning` attacks were relevant at first, until we realized the scope of the AI models being tested were open-weight ones, meaning they can be installed and run on local machines. So the poisoning would be local? We quickly disregarded it as an option together with `Indirect Prompt Injection`, since it operates by the same logic of data poisoning attacks. What we were left with that had a huge possible attack vector were `Direct Prompt Injection` attacks, where an attacker could download a model he knows a company uses and simulate adversarial attacks locally until he finds one that breaches the AI model's defense, then running it directly at the company, leaving it vulnerable to any data exfiltration or possible requests the attacker wishes to make.

## Modeling the Model

Right, now you know the scope of what we are getting at, but how do these attacks really happen? How do our mysterious black boxes called computers understand this text we throw at them and "magically" return us a response to it? Well, here is my abstract explanation of it, divided into 5 parts:

### The Training Process

![By Henrique Arcoverde](/writing/breaking_ai/training_neural_network.png)

- 3.1.1: Suppose you have some cat pictures and want to see if they are really cats. Simple, right? You throw the pictures in groups called batches into a neural network, establish a classification mechanism for it and see if those cat pictures you had have been classified correctly as cats, not as dogs.
- 3.1.2: For that, the neural network you used must have been previously trained through supervised learning with their respective weights (open-weight models refers to this) and layers adjusted for an approximate categorization of at least cats and dogs (using large training matrices with a few thousand dimensions (maybe millions, depending on the image sizes used in training)).
- 3.1.3: This graph-like neural network has a training routine in that it's output layer is a binary decider (assuming it only categorizes cats and dogs), with that, the plot it generates for the data collected is two-dimensional, separating cats from dogs (ideally).

### The Inference Process

- 3.2.1: After training (and during it), these images go through the process of `Forward Propagation` through the model, with every weight and internal layers being relevant for the image classification.
- 3.2.4: You now have a plot that can, given a cat or dog image, establish where it should stay on that plot, with a certain accuracy given.
- 3.2.1: If the inference is constantly incorrect, you can identify which weights and layers had the most relevance in that misprediction and run a `Backwards Propagation` algorithm to reduce that `Loss Score`. This leads us to the next step, the inference.

### Adversarial Attacks

![By Henrique Arcoverde](/writing/breaking_ai/adversarial_attacks.png)

- 3.3.1: Someone who desires to misclassify an image and has direct access to the model-weights may algorithmically find the local inverse of the classification function, where the inference line between cats and dogs is drawn, through optimization techniques. They may be `Gradient Ascent` or `Gradient Descent`.
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

## Architecting the Solution

![Solution Architecture](/writing/breaking_ai/architecture.png)
First, we modeled the attack architecture. There is an attacker AI model we call `Mutator`, since it iteratively improves the prompts for the victim by mutating the phrase. There is a `Victim` model that receives inputs from the mutator and directs the response to a `Judge`, which marks the victim's response as being benign or malicious, along with other metrics. After that, these data need to be processed, or at least interpreted. So we made the judge's responses stored in clusters of CSVs, separated between tested model and test language, the main parameters of our research. With that in place, we also created an interactive summary that groups the CSVs and facilitates reading the results.

## The Three Fronts

From that point on, since our team was multidisciplinary, we "separated" the deliverables into: deepening the paper, tool/solution scalability, and usability/ease of use. My main concern, since we had a proof of concept made only for our use case, was to allow different groups to use the solution according to their testing needs. Therefore, we could expand the possible use both at hardware level and tested models, being both local models and API-based, with a graphical tool to assist.

## Paper Discovery

We hypothesized that language could be a major facilitator of attacks, depending on how they are trained. I still believe it could be, but we discovered that there is no major difference between Portuguese and English, even with predominantly training in our language. We considered, by the end of the project, expanding the tested languages, but since our project has exponential complexity, running tests to expand the hypothesis became unfeasible, especially with infrastructure costs.

## The Tool (Not the band)

What is interesting about the tool is it allows for the use of presets and selection of different mutators, victims and judges, working with NVIDIA, AMD, Intel and Apple GPUs for the parallelization of both the attacks and the models tested, running them in different cores (if you have the infrastructure to do it, of course). And as I said, the results are visible through the CLI itself or you can create an HTML file that condenses it for another way to visualize.

```
Funny detail: Two days after the end of our project, Pliny released the OBLITERALUS tool, which is pretty similar to ours.
```

## The Graphical Tool

We still needed a way to enable non-technical users to use our tool, so we prototyped a GUI that is an expansion of the CLI tool, named it Inje.X (after prompt injection) and planned it to have the same functionalities that the original tool had, being them: presets, models selection, methods selection, multiplatform. You would not be able to alter the files to import new seeds, but there is the original tool that enables this, so..?

## Conclusion

It was six great weeks, I got to be in an environment where I was challenged daily by enthusiastic people who wanted to be there and laugh freely, challenging ourselves together, "because the only way of doing impossible things is to have fun while you do them, and to get surrounded by people that are smarter than you are". It marked me in a way that I already remember fondly. I'm happy with what we managed to do with the project, and we only succeeded thanks to all the support and structure provided.

#### "IF I could see farther, was by standing on the shoulders of giants."

- #### - Isaac Newton

---

# Resources & References:

- [CISSA Tool](https://github.com/pauloed94/cissa-tool)
- [Neural Networks by 3Blue1Brown](https://youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi&si=vs3WlOPWixxmOj9b)
- [Attention is All you Need](https://arxiv.org/abs/1706.03762)

#### Extra Resources for the Curious

- [LLM Neuroanatomy: How I Topped the LLM Leaderboard Without Changing a Single Weight](https://dnhkng.github.io/posts/rys/)
- [https://github.com/elder-plinius](https://github.com/elder-plinius)
