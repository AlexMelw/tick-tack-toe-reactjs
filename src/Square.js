import React from 'react';
import { default as styled, css } from 'styled-components';

const StyledSquareButton = styled.button`

    background-color: ${props => props.isStrike ? "rgba(76, 227, 0, 1)" : "inherit"};
    color: ${props => props.isStrike ? "rgba(255, 255, 255, 1)" : "inherit"};

    ${props => props.isStrike && css`
      text-shadow: 0px 0px 2px rgba(100, 100, 100, 1); 
    `}
`;

export const Square = (props) => {

  const isStrike = props.winnerCells.some(x => x === props.index);

  return (
    <StyledSquareButton
      className="square"
      isStrike={isStrike}
      onClick={props.onClick}>

      {props.value}
    </StyledSquareButton>
  );
}
