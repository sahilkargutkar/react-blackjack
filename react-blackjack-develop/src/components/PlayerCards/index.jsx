import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card';
import './style.css';

const PlayerCards = ({ cards, score, playerName, showCards, showScore }) => {
  return (
    <div className="playerContainer">
      {showCards && cards.length > 0 && (
        <div>
          <h2 className="playerName"> {`${playerName}: ${showScore ? score : ''}`}</h2>
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
};

PlayerCards.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      url: PropTypes.string,
      status: PropTypes.string
    })
  ).isRequired,
  score: PropTypes.number.isRequired,
  playerName: PropTypes.string.isRequired,
  showCards: PropTypes.bool.isRequired,
  showScore: PropTypes.bool.isRequired
};

export default PlayerCards;
