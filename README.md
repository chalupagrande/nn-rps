# Neural Net Rock Paper Scissors

This is a small application train a Neural Net to play Rock Paper Scissors. 

## Introduction

I wanted to learn more about Neural Networks and Deep Learning. This project uses [Synpatic](https://github.com/cazala/synaptic) (a javascript neural network library for NodeJS and the Browser) to create the Neural Networks. I wanted to see if I could design a Neural Network that would win in Rock Paper Scissors a statistically significant amount of times above random. This project and write up are official entries into the Austin Recreation Center's Science Fair Competition.

## Materials
- SynapticJS
- MongoDB
- Rock
- Paper 
- Scissors

## Methods 
### Step 1
To start out, I wanted to learn how to train a NN to play RPS. This doesn't mean I needed it to win. I just wanted to see if I could train it to give the right response when it predicted its opponent would play a certain hand. So I built a `perceptron` network using Synaptic, and trained it with 20000 iterations and a 0.3 learning rate. After training the network I named `Janus` it had a confidence ratio of `0.999815524777559`. Janus is the Greek god of beginnings. 

```
// create the network
var inputLayer = new Layer(3);
var hiddenLayer = new Layer(3);
var outputLayer = new Layer(3);

inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

var Janus = new Network({
	input: inputLayer,
	hidden: [hiddenLayer],
	output: outputLayer
});

var learningRate = .35;
for (var i = 0; i < 20000; i++){
	//when given rock
	Janus.activate(key.rock);
	Janus.propagate(learningRate, key.paper);

	Janus.activate(key.paper); // <= paper = [0,1,0]
	Janus.propagate(learningRate, key.scissors);

	Janus.activate(key.scissors);// <= scissors = [1,0,0]
	Janus.propagate(learningRate, key.rock);
}
```

### Step 2
I then created a small application to help gather data about how people play RPS. I figured if I were able to gather enough data on how people play RPS, I could create NN be trained off of a large dataset of previously played RPS games. This way, the NN would have prior knowledge about how the game is usually played by humans. In order to get this dataset, I released an application that people could play where the computer would _randomly_ choose Rock Paper or Scissors. I instructed the participants to play as if they were playing a Human. Meaning, if the computer played Paper several times in a row, to let that influence their decision on what they might play next. 

### Step 3
After a database of Human played RPS games was created, I wrote an algorithm to train a `perceptron` neural network to make predicions on what its opponents next move would be. As inputs for the NN, the opponents last 5 plays were used in the hopes that the last 5 plays would be indicative of what the player might choose next. This network would be trained before each user played it. Meaning the games from all the previous opponents would be used in the training. I named this network `Annette`


## Data
The initial dataset gathered from the Random Choice Network, was as follows: 

```
//AS OF 2/19/18: from user perspective
 let results = {
   "wins":602,
   "losses":657,
   "ties":612,
   "total":1871,
   "rock":639,
   "paper":590,
   "scissors":642,
   "rockWins":193,
   "paperWins":207,
   "scissorsWins":202,
   "longestStreak":7
 }

 let percentageResults = {
   winPercentage: 32.18,
   tiePercentage: 32.71,
   lossPercentage: 35.11,
 }
```

## Step 4

After training Annette on the dataset of random RPS plays, I released her to play real players. Every subsequent play would then be added to the dataset to further enhance Annette's predictions. 

## Results

Scissors. For whatever reason, Annette is a big fan of Scissors. Reflecting on the methods above, it is clear the the method of gathering data was flawed. My human participants were likely to figure out that they were not in fact playing an AI yet, and could make any RPS play they cared to, without it affecting the computers play. One human player admitted to repeating Rock, Paper, Scissors for over 100 games. Essentially this means that the data gathered does not accurately represent the way humans play RPS. Making it very difficult for Annette to choose an appropriate answer. 