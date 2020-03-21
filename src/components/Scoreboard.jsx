import React, { useReducer } from 'react';
import Button from './Button';

const initialState = {
  playerOne: {
    score: 0,
    games: 0,
    sets: 0,
  },
  playerTwo: {
    score: 0,
    games: 0,
    sets: 0,
  },
  isDeuce: false,
  gameOver: false,
  winner: '',
  sets: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        [action.player]: {
          ...state[action.player],
          [action.scoreType]: state[action.player][action.scoreType] + 1,
        },
      };
    case 'decrement':
      return {
        ...state,
        [action.player]: {
          ...state[action.player],
          [action.scoreType]: state[action.player][action.scoreType] - 1,
        },
      };
    case 'recordSet':
      return {
        ...state,
        sets: [...state.sets, {
          set: state.sets.length + 1,
          playerOne: state.playerOne.games,
          playerTwo: state.playerTwo.games,
        }],
      };
    case 'winner':
      return { ...state, winner: action.player };
    case 'gameOver':
      return { ...state, gameOver: true };
    case 'resetScore':
      return {
        ...state,
        playerOne: {
          ...state.playerOne,
          score: 0,
        },
        playerTwo: {
          ...state.playerTwo,
          score: 0,
        },
      };
    case 'resetGames':
      return {
        ...state,
        playerOne: {
          ...state.playerOne,
          games: 0,
        },
        playerTwo: {
          ...state.playerTwo,
          games: 0,
        },
      };
    case 'resetFull':
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
    const { score } = state[player];
    const opponent = player === 'playerOne' ? 'playerTwo' : 'playerOne';
    const opponentScore = state[opponent].score;

    if (score === 3 && opponentScore < 3 || score === 4) {
      calcGames(player);
      return;
    }

    if (score === 4) {
      calcGames(player);
      return;
    }

    if (score === 3 && opponentScore === 4) {
      dispatch({ type: 'decrement', player: opponent, scoreType: 'score' });
      dispatch({ type: 'increment', player, scoreType: 'score' });
      return;
    }

    dispatch({ type: 'increment', player, scoreType: 'score' });
  }

  function calcGames(player) {
    const { games } = state[player];
    const opponent = player === 'playerOne' ? 'playerTwo' : 'playerOne';
    const opponentGames = state[opponent].games;

    dispatch({ type: 'resetScore' });

    if (games >= 5 && games - opponentGames >= 1) {
      dispatch({ type: 'increment', player, scoreType: 'games' });
      dispatch({ type: 'recordSet' });
      dispatch({ type: 'resetGames' });
      calcSets(player);
      return;
    }

    if (games === 6 && opponentGames === 6) {
      dispatch({ type: 'increment', player, scoreType: 'games' });
      dispatch({ type: 'recordSet' });
      dispatch({ type: 'resetGames' });
      calcSets(player);
      return;
    }

    dispatch({ type: 'increment', player, scoreType: 'games' });
  }

  function calcSets(player) {
    const { sets } = state[player];

    if (sets == 2) {
      dispatch({ type: 'increment', player, scoreType: 'sets' });
      dispatch({ type: 'gameOver' });
      dispatch({ type: 'winner', player });
      return;
    }

    dispatch({ type: 'increment', player, scoreType: 'sets' });
  }

  return (
    <div className="scoreboard">
      <table>
        <thead>
          <tr>
            <th>Playername</th>
            <th>Score</th>
            <th>Game</th>
            <th>Set</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Player One</td>
            <td>{ scoreFormat[state.playerOne.score] }</td>
            <td>{ state.playerOne.games }</td>
            <td>{ state.playerOne.sets }</td>
          </tr>
          <tr>
            <td>Player Two</td>
            <td>{ scoreFormat[state.playerTwo.score] }</td>
            <td>{ state.playerTwo.games }</td>
            <td>{ state.playerTwo.sets }</td>
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
        onClick={() => dispatch({ type: 'resetFull' })}
      />
      <div className="sets">
        {state.sets.map((set) => (
          <div className="set" key={set.set}>
            <span>
              Set:
              {set.set}
            </span>
            <span>
              PlayerOne:
              {set.playerOne}
            </span>
            <span>
              PlayerTwo:
              {set.playerTwo}
            </span>
          </div>
        ))}
      </div>
      { state.gameOver && (
        <div className="winner">
          Winner:
          {state.winner}
        </div>
      )}
    </div>
  );
}

export default Scoreboard;
