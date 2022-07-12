import React, { useRef, useState } from "react";
import "./App.css";
// import background from "./images/bj-bg.jpg";

function App() {
  const [canHit, setCanHit] = useState(true);
  const [deal, setDeal] = useState(false);

  var dealerSum = 0;
  const dealerCards = useRef(null);
  const yourCards = useRef(null);

  // var canHit = true;
  var yourSum = 0;

  var dealerAceCount = 0;
  var yourAceCount = 0;

  var hidden;
  var deck;

  // useEffect(() => {
  //   buildDeck();
  //   shuffleDeck();
  //   startNewGame();
  // }, []);

  window.onload = (event) => {
    buildDeck();
    shuffleDeck();
    startNewGame();
  };

  const buildDeck = () => {
    let values = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];

    let types = ["C", "D", "H", "S"];

    deck = [];

    for (let i = 0; i < types.length; i++) {
      for (let j = 0; j < values.length; j++) {
        deck.push(values[j] + "-" + types[i]);
      }
    }
    // console.log(deck);
  };

  const shuffleDeck = () => {
    for (let i = 0; i < deck.length; i++) {
      let j = Math.floor(Math.random() * deck.length);
      let temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
    console.log("shuffle deck", deck);
  };

  const startNewGame = () => {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    console.log("hidden", hidden);

    for (let i = 0; i < 1; i++) {
      // while (dealerSum < 17) {
      let cardImg = document.createElement("img");
      let card = deck.pop();
      cardImg.src = "../cards/" + card + ".png";
      dealerSum += getValue(card);
      dealerAceCount += checkAce(card);
      console.log("dealercards", dealerCards.current);
      // dealerCards.current.appendChild(cardImg);
      document.getElementById("dealer-cards").appendChild(cardImg);
    }
    // }
    console.log("dealerSum", dealerSum);

    for (let i = 0; i < 2; i++) {
      let cardImg = document.createElement("img");
      let card = deck.pop();
      cardImg.src = "../cards/" + card + ".png";
      yourSum += getValue(card);
      yourAceCount += checkAce(card);
      // yourCards.current.appendChild(cardImg);
      document.getElementById("your-cards").appendChild(cardImg);
    }

    console.log("yoursum", yourSum);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
  };

  const getValue = (card) => {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) {
      if (value === "A") {
        return 11;
      }
      return 10;
    }
    return parseInt(value);
  };

  const checkAce = (card) => {
    if (card[0] === "A") {
      return 1;
    }
    return 0;
  };

  const reduceAce = (playerSum, playerAceCount) => {
    while (playerSum > 21 && playerAceCount > 0) {
      playerSum -= 10;
      playerAceCount -= 1;
    }
    console.log("playerSum", playerSum);
    return playerSum;
  };

  const hit = () => {
    if (!canHit) {
      // stay();
      return;
    }
    let cardImg = document.createElement("img");
    console.log("deck", deck);
    let card = deck.pop();

    cardImg.src = "../cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    yourCards.current.appendChild(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) {
      // canHit = false;
      setCanHit(false);
      stay();
      console.log(canHit);
      console.log("yourSuminHit");
    }
  };

  const stay = () => {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    // canHit = false;
    setCanHit(false);
    document.getElementById("hidden").src = "../cards/" + hidden + ".png";

    while (dealerSum < 17) {
      let cardImg = document.createElement("img");
      let card = deck.pop();
      cardImg.src = "../cards/" + card + ".png";
      dealerSum += getValue(card);
      dealerAceCount += checkAce(card);
      console.log("dealercards", dealerCards.current);
      // dealerCards.current.appendChild(cardImg);
      document.getElementById("dealer-cards").appendChild(cardImg);
    }

    let message = "";

    if (yourSum > 21) {
      message = "You Lose";
    } else if (dealerSum > 21) {
      message = "You Win";
    } else if (yourSum === dealerSum) {
      message = "Tie";
    } else if (yourSum > dealerSum) {
      message = "You Win";
    } else if (yourSum < dealerSum) {
      message = "You Lose";
    }
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("results").innerText = message;

    setDeal(true);
  };

  return (
    <div
      className="App"
      // style={{ backgroundImage: `url(${background})`, height: "500px" }}
    >
      <h2 style={{ text: "white" }}>
        Dealer:
        <span id="dealer-sum"></span>
      </h2>

      <div id="dealer-cards" className="dealer-cards" ref={dealerCards}>
        <img id="hidden" src={"../cards/BACK.png"} alt="card back" />
      </div>

      <h2>
        You: <span id="your-sum"></span>
      </h2>
      <div id="your-cards" ref={yourCards}></div>

      <div className="buttons">
        <button id="hit" className="hit" disabled={!canHit}>
          Hit
        </button>
        <button id="stay" className="stay" disabled={!canHit}>
          Stay
        </button>
      </div>

      <p id="results"></p>
      {deal ? (
        <div>
          <button
            className="deal"
            id="deal"
            onClick={() => window.location.reload()}
          >
            Deal
          </button>
        </div>
      ) : (
        <div></div>
      )}
      {/* <input value="RESTART GAME" onclick="history.go(0)" type="button" /> */}
    </div>
  );
}

export default App;
