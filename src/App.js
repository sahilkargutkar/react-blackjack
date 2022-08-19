import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";
import "./App.css";
import MetaData from "./components/Meta/MetaData";
import TagManager from "react-gtm-module";

const tagManagerArgs = {
  gtmId: "G-R84ZFX4D61",
};

TagManager.initialize(tagManagerArgs);
// import background from "./images/bj-bg.jpg";

if (typeof window !== "undefined") {
  injectStyle();
}

function App() {
  const [canHit, setCanHit] = useState(true);
  const [deal, setDeal] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  var dealerSum = 0;
  const dealerCards = useRef(null);
  const yourCards = useRef(null);

  // var canHit = true;
  var yourSum = 0;

  var dealerAceCount = 0;
  var yourAceCount = 0;

  var hidden;
  var deck;

  const info = () => toast("wow so easy");

  useEffect(() => {
    buildDeck();
    shuffleDeck();
    // startNewGame();
  }, []);

  // window.onload = (event) => {
  //   buildDeck();
  //   shuffleDeck();
  //   startNewGame();
  // };

  //  <script
  //     async
  //     src="https://www.googletagmanager.com/gtag/js?id=G-R84ZFX4D61"
  //   ></script>
  //   <script>
  //     window.dataLayer = window.dataLayer || [];
  //     function gtag() {
  //       dataLayer.push(arguments);
  //     }
  //     gtag("js", new Date());

  //     gtag("config", "G-R84ZFX4D61");
  //   </script>

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

  const doubleDown = () => {
    buildDeck();
    shuffleDeck();
    hit();
    // stay();

    const numOfImgTags = document.getElementById("your-cards");
    var count = numOfImgTags.getElementsByTagName("img").length;

    let newSum = 0;

    for (let k = 0; k < count; k++) {
      let yourCount = 0;

      const imgVal = document
        .getElementById("your-cards")
        .getElementsByTagName("img")[k].src;

      const num = imgVal.slice(-7).charAt(0);
      const num2 = imgVal.slice(-7).charAt(1);

      if (num === num2) {
        toast.error("The Correct play is to split");
      }

      // console.log("num 1", num);

      if (num === "J" || num === "K" || num === "Q") {
        yourCount = 10;
        // console.log(num, "num num");
      } else if (num === "A") {
        yourCount += 11;
        yourAceCount += 1;
      } else {
        if (num === "0") {
          yourCount += 10;
        }

        yourCount = parseInt(num);
      }

      newSum = newSum + yourCount;

      if (newSum === 11 || newSum === 10) {
        toast.info("You should have doubled down");
      }

      console.log(newSum);
    }
    yourSum = newSum;

    const dealerImgTags = document.getElementById("dealer-cards");
    const dealerCount = dealerImgTags.getElementsByTagName("img")[0];
    const dealerCount2 = dealerImgTags.getElementsByTagName("img")[1];

    stay(yourSum, yourAceCount);

    dealerCount.remove();
    dealerCount2.remove();
  };

  const shuffleDeck = () => {
    for (let i = 0; i < deck.length; i++) {
      let j = Math.floor(Math.random() * deck.length);
      let temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
    // console.log("shuffle deck", deck);
  };

  const startNewGame = () => {
    setGameStarted(true);

    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    // console.log("hidden", hidden);

    for (let i = 0; i < 1; i++) {
      // while (dealerSum < 17) {
      let cardImg = document.createElement("img");
      let card = deck.pop();
      cardImg.src = "../cards/" + card + ".png";
      dealerSum += getValue(card);
      dealerAceCount += checkAce(card);
      // console.log("dealercards", dealerCards.current);
      // dealerCards.current.appendChild(cardImg);
      document.getElementById("dealer-cards").appendChild(cardImg);
    }
    // }
    // console.log("dealerSum", dealerSum);

    for (let i = 0; i < 2; i++) {
      let cardImg = document.createElement("img");
      let card = deck.pop();
      cardImg.src = "../cards/" + card + ".png";
      yourSum += getValue(card);
      yourAceCount += checkAce(card);
      // yourCards.current.appendChild(cardImg);
      document.getElementById("your-cards").appendChild(cardImg);
    }

    // console.log("yoursum", yourSum);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
  };

  const getValue = (card) => {
    // console.log("cards", card);

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
    // console.log("playerSum", playerSum);
    return playerSum;
  };

  function hit() {
    if (!canHit) {
      // stay();
      return;
    }
    let cardImg = document.createElement("img");
    // console.log("deck", deck);
    let card = deck.pop();

    cardImg.src = "../cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    yourCards.current.appendChild(cardImg);

    const imgVal = document
      .getElementById("your-cards")
      .getElementsByTagName("img")[0].src;

    const imgVal2 = document
      .getElementById("your-cards")
      .getElementsByTagName("img")[1].src;

    const subsr1 = imgVal.slice(-7).charAt(0);
    const subsr2 = imgVal2.slice(-7).charAt(0);

    if (parseInt(subsr1) === 10 && parseInt(subsr2) === 10) {
      toast.info("You Should Stay");
    }

    if (subsr1 === subsr2) {
      toast.error("The Correct play is to split");
    }

    if (subsr1 === "A" && subsr2 === "A") {
      toast.info("You Should Split");
    }

    if (yourSum >= 17 && yourSum <= 21) {
      // toast.info("Call Stay");
    }

    if (reduceAce(yourSum, yourAceCount) > 21) {
      // canHit = false;

      setCanHit(false);
      stay();

      // console.log(canHit);
      // console.log("yourSuminHit");
    }
  }

  function stay(mySum, myAceCount, newDealerSum, newDealerAceCount) {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);
    mySum = reduceAce(mySum, myAceCount);

    // canHit = false;
    setCanHit(false);
    document.getElementById("hidden").src = "../cards/" + hidden + ".png";

    while (dealerSum < 17) {
      let cardImg = document.createElement("img");
      let card = deck.pop();
      cardImg.src = "../cards/" + card + ".png";
      dealerSum += getValue(card);
      dealerAceCount += checkAce(card);
      // console.log("dealercards", dealerCards.current);
      // dealerCards.current.appendChild(cardImg);
      document.getElementById("dealer-cards").appendChild(cardImg);
    }

    let message = "";

    if (yourSum > 21) {
      if (yourSum <= 24) {
        toast.info("Better luck next time");
        message = "You Lose";
      } else {
        toast.error("Sorry, the correct play is to Stay");
        message = "You Lose";
      }
    } else if (dealerSum > 21) {
      toast.info("Great!  That's the correct play!");
      message = "You Win";
    } else if (yourSum === dealerSum) {
      if (yourSum <= 21) {
        toast.info("Great!  That's the correct play!");
        message = "Tie";
      }
      message = "You Lose";
    } else if (yourSum > dealerSum) {
      toast.info("Great!  That's the correct play!");
      message = "You Win";
    } else if (yourSum < dealerSum) {
      if (dealerSum - yourSum <= 4) {
        toast.info("Better Luck next Time");
        message = "You Lose";
      }
      message = "You Lose";
    }

    if (mySum > 21) {
      if (mySum <= 24) {
        toast.info("Better Luck next Time");
        message = "You Lose";
      } else {
        toast.error("Sorry, the correct play is to Stay");
        message = "You Lose";
      }
    } else if (dealerSum > 21) {
      toast.info("Great!  That's the correct play!");
      message = "You Win";
    } else if (mySum === dealerSum) {
      if (mySum <= 21) {
        toast.info("Great!  That's the correct play!");
        message = "Tie";
      }
      message = "You Lose";
    } else if (mySum > dealerSum) {
      toast.info("Great!  That's the correct play!");
      message = "You Win";
    } else if (mySum < dealerSum) {
      if (dealerSum - mySum <= 4) {
        toast.info("Better Luck next Time");
        message = "You Lose";
      }

      message = "You Lose";
    }

    if (mySum) {
      document.getElementById("your-sum").innerText = mySum;
    }

    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("results").innerText = message;

    setDeal(true);
  }

  function split() {
    const imgVal = document
      .getElementById("your-cards")
      .getElementsByTagName("img")[0].src;

    const imgVal2 = document
      .getElementById("your-cards")
      .getElementsByTagName("img")[1].src;

    const imgVal3 = document
      .getElementById("your-cards")
      .getElementsByTagName("img")[2].src;

    // console.log("imgVal", imgVal, imgVal2);

    const subsr1 = imgVal.slice(-7).charAt(0);

    const subsr2 = imgVal2.slice(-7).charAt(0);

    const subsr3 = imgVal3.slice(-7).charAt(0);

    if (subsr1 === subsr2) {
      // console.log("they are equal");
      toast.info("Great!  That's the correct play!");

      if (subsr1 === "A") {
        yourSum = 11; //1;
      } else {
        if (subsr1 === "Q" || subsr1 === "J" || subsr1 === "K") {
          yourSum = 10;
        } else {
          yourSum = parseInt(subsr1);
        }
      }
      // console.log("yourSum in split", yourSum);
    }

    if (subsr1 === subsr3) {
      if (subsr1 === "A") {
        yourSum = 11; //1;
      } else {
        if (subsr1 === "Q" || subsr1 === "J" || subsr1 === "K") {
          yourSum = 10;
        } else {
          yourSum = parseInt(subsr1);
        }
      }
    }

    if (subsr2 === subsr3) {
      if (subsr2 === "A") {
      } else {
        if (subsr2 === "Q" || subsr2 === "J" || subsr2 === "K") {
          yourSum = 10;
        } else {
          yourSum = parseInt(subsr2);
        }
      }
    }
  }

  const startGame = () => {
    startNewGame();
    toast.info("Shuffling and Dealing Cards");
  };

  return (
    <div>
      <MetaData title="How to Win at Cards" />
      <h1 className="blackjack" id="blackjack">
        How to Win at Blackjack
      </h1>
      <div
        className="App"
        // style={{ backgroundImage: `url(${background})`, height: "500px" }}
      >
        <div>
          <h2 style={{ text: "white" }}>
            Dealer:
            <span id="dealer-sum"></span>
            <ToastContainer limit={2} autoClose={2000} />
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
            <button
              onClick={doubleDown}
              id="dd"
              disabled={!gameStarted}
              className="dd"
            >
              Double Down
            </button>
            <button onClick={split} id="split" className="split">
              split
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
        {!gameStarted ? (
          <button
            className="deal"
            id="deal"
            onClick={startGame}
            disabled={gameStarted}
          >
            Start Game
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default App;
