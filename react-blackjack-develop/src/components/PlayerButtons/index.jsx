import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const PlayerButtons = ({
  gameStarted,
  gameStayed,
  startGame,
  hit,
  stay,
  reset,
  disabled,
  split,
  doubleDown
}) => {
  return (
    <div className="buttonContainer">
      {gameStarted && (
        <div>
          <button disabled={disabled} className="button" type="button" onClick={hit}>
            Hit
          </button>
          <button disabled={disabled} className="button" type="button" onClick={doubleDown}>
            Double Down
          </button>
          <button disabled={disabled} className="button" type="button" onClick={split}>
            Split
          </button>
          <button disabled={disabled} className="button" type="button" onClick={stay}>
            Stay
          </button>
        </div>
      )}

      {!gameStarted && !gameStayed && (
        <button className="button" type="button" onClick={startGame}>
          Start Game
        </button>
      )}
      {gameStayed && (
        <button className="button" type="button" onClick={reset}>
          Deal!
        </button>
      )}
    </div>
  );
};

PlayerButtons.propTypes = {
  gameStarted: PropTypes.bool.isRequired,
  gameStayed: PropTypes.bool.isRequired,
  startGame: PropTypes.func.isRequired,
  hit: PropTypes.func.isRequired,
  stay: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  split: PropTypes.func.isRequired,
  doubleDown: PropTypes.func.isRequired
};

export default PlayerButtons;
