import React, { useEffect, useReducer } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';
import './App.css';
import TagManager from 'react-gtm-module';
import MetaData from './components/Meta/MetaData';
import PlayerCards from './components/PlayerCards';
import PlayerButtons from './components/PlayerButtons';
import reducer from './reducer/reducer';
import initialState from './reducer/initialState';
import types from './reducer/types';

const tagManagerArgs = {
  gtmId: ''
};

TagManager.initialize(tagManagerArgs);

if (typeof window !== 'undefined') {
  injectStyle();
}

const App = () => {
  const [store, dispatch] = useReducer(reducer, initialState);
  const {
    userGame,
    dealerGame,
    gameStarted,
    gameStayed,
    userScore,
    dealerScore,
    userHandValues,
    isSplitted
  } = store;

  const startGame = () => {
    dispatch({ type: types.startGame });
  };

  const resetGame = () => {
    dispatch({ type: types.reset });
    dispatch({ type: types.setUserScore, payload: 0 });
    dispatch({ type: types.setDealerScore, payload: 0 });
    dispatch({ type: types.setGameStayed, payload: false });
  };

  const split = () => {
    const lastCard = [...userGame].pop();
    const previousHand = [...userGame].slice(0, -1);
    const isEnableToSplit =
      previousHand.some((card) => card.value === lastCard.value) && !isSplitted;
    if (isEnableToSplit) {
      toast.info("Great That's the correct play");
      dispatch({ type: types.setUserHandValues, payload: [...userHandValues].slice(0, -1) });
      dispatch({ type: types.setIsSplitted, payload: true });
    } else if (isSplitted) {
      toast.info('You already splitted');
    } else {
      toast.info('You can not split, you need two cards with the same value');
    }
  };

  const dealerOpensHand = () => {
    dispatch({ type: types.dealerOpensCard });
  };

  const compareScores = () => {
    dealerOpensHand();
    let message = 'You Lose';
    // eslint-disable-next-line no-debugger
    debugger;
    if (userScore - dealerScore <= 5 || dealerScore - userScore >= 5) {
      message = 'Better luck next time';
    }
    if (userScore === dealerScore) {
      dealerOpensHand();
      message = 'Tie';
    }
    if (dealerScore > 21) {
      message = 'You Win';
    } else if (userScore > dealerScore) {
      message = "Great! That's the correct play!";
    }
    toast.info(message);
  };

  const dealerTakesCard = () => {
    dispatch({ type: types.dealerTakesCard });
  };

  const calculateScore = () => {
    if (!gameStarted || !gameStayed) return;
    if (gameStarted && gameStayed && dealerScore < 17) {
      dealerTakesCard();
    } else {
      compareScores();
      dispatch({ type: types.endGame });
    }
  };

  const hit = () => {
    dispatch({ type: types.hit });
    dispatch({ type: types.setIsSplitted, payload: false });
  };

  const stay = () => {
    dealerOpensHand();
    dispatch({ type: types.setGameStayed, payload: true });
  };

  const doubleDown = () => {
    hit();
    stay();
    calculateScore();
  };

  const getNewScore = (hand) => {
    return hand.reduce((acc, card) => acc + card.value, 0);
  };

  useEffect(() => {
    if (gameStarted) {
      dispatch({ type: types.fillDeck });
      dispatch({ type: types.shuffleDeck });
      dispatch({ type: types.dealGame });
    }
  }, [gameStarted]);

  useEffect(() => {
    if (gameStarted) {
      const newScore = getNewScore(dealerGame);
      dispatch({ type: types.setDealerScore, payload: newScore });
    }
  }, [dealerGame, gameStarted]);

  useEffect(() => {
    if (gameStarted) {
      const newScore = getNewScore(userHandValues);
      dispatch({ type: types.setUserScore, payload: newScore });
    }
  }, [gameStarted, userHandValues]);

  useEffect(() => {
    if (gameStarted && userGame.length === 2) {
      dispatch({ type: types.setUserHandValues, payload: [...userGame] });
    }
  }, [userGame, gameStarted]);

  useEffect(() => {
    if (userScore >= 21 && userScore < 27) {
      toast.info('You Lose');
      dispatch({ type: types.setGameStayed, payload: true });
      dispatch({ type: types.endGame });
    } else if (userScore >= 27) {
      toast.info('The Correct Play is to stay');
      dispatch({ type: types.setGameStayed, payload: true });
      dispatch({ type: types.endGame });
    }
  }, [userScore]);

  useEffect(() => {
    calculateScore();
  }, [gameStayed, dealerScore]);

  return (
    <div className="mainContainer">
      <MetaData title="How to Win at Cards" />
      <h1 className="blackjack" id="blackjack">
        How to Win at Blackjack
      </h1>

      <PlayerCards
        cards={dealerGame}
        playerName="Dealer"
        showCards={gameStarted || gameStayed}
        score={dealerScore}
        showScore={!!(gameStayed && userScore <= 21)}
      />
      <PlayerCards
        cards={userGame}
        playerName="You"
        showCards={gameStarted || gameStayed}
        score={userScore}
        showScore={gameStarted || gameStayed}
      />
      <PlayerButtons
        startGame={startGame}
        gameStarted={gameStarted}
        gameStayed={gameStayed}
        showScore={gameStayed}
        disabled={!gameStarted || gameStayed}
        hit={hit}
        stay={stay}
        doubleDown={doubleDown}
        reset={resetGame}
        split={split}
      />
      <ToastContainer limit={1} autoClose={2000} />
    </div>
  );
};

export default App;
