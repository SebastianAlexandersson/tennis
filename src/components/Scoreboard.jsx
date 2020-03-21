import React, { useReducer } from 'react';
import Button from './Button';

const initialState = {
  playerOneScore: 0,
  playerTwoScore: 0,
  isDeuce: false,
  gameOver: false,
  winner: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, [action.player]: state[action.player] + 1 };
    case 'decrement':
      return { ...state, [action.player]: state[action.player] - 1 };
    case 'winner':
      return { ...state, winner: action.player };
    case 'gameOver':
      return { ...state, gameOver: true };
    case 'reset':
      return initialState;
    default:
      throw new Error();
  }
}

function Scoreboard() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const scoreFormat = {
    0: '0',
    1: '15',
    2: '30',
    3: '40',
    4: 'A',
  };

  function calcScore(player) {
    const score = player === 'playerOne' ? state.playerOneScore : state.playerTwoScore;
    const opponent = player === 'playerOne' ? 'playerTwo' : 'playerOne';
    const opponentScore = player === 'playerOne' ? state.playerTwoScore : state.playerOneScore;

    if (score === 3 && opponentScore < 3 || score === 4) {
      dispatch({ type: 'gameOver' });
      dispatch({ type: 'winner', player });
      return;
    }

    if (score === 3 && opponentScore === 4) {
      dispatch({ type: 'decrement', player: `${opponent}Score` });
      dispatch({ type: 'increment', player: `${player}Score` });
      return;
    }

    dispatch({ type: 'increment', player: `${player}Score` });
  }

  return (
    <div className="scoreboard">
      <table>
        <thead>
          <tr>
            <th>Playername</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Player One</td>
            <td>{ scoreFormat[state.playerOneScore] }</td>
          </tr>
          <tr>
            <td>Player Two</td>
            <td>{ scoreFormat[state.playerTwoScore] }</td>
          </tr>
        </tbody>
      </table>
      <Button
        label="PlayerOne score"
        onClick={() => calcScore('playerOne')}
        disabled={state.gameOver}
      />
      <Button
        label="PlayerTwo score"
        onClick={() => calcScore('playerTwo')}
        disabled={state.gameOver}
      />
      <Button
        label="Reset"
        onClick={() => dispatch({ type: 'reset' })}
      />
    </div>
  );
}

export default Scoreboard;
