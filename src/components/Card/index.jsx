import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ card }) => {
  const turnDownImage = '../cards/BACK.png';
  return (
    <img
      src={card.status === 'turnDown' ? turnDownImage : card.image}
      alt={card.id}
      height={175}
      width={125}
    />
  );
};

Card.propTypes = {
  card: PropTypes.shape({ id: PropTypes.string, image: PropTypes.string, status: PropTypes.string })
    .isRequired
};

export default Card;
