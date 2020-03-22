import React, { useReducer } from 'react';
import { reducer, initialState } from '../state/scoreReducer';
import Button from './Button';
import utils from '../utils';
import './scoreboard.css';

const { scoreFormat } = utils;

function Scoreboard() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function calcSets(player) {
    const { sets } = state[player];

    // Best of 5 sets, first one to 3 wins.
    if (sets === 2) {
      dispatch({ type: 'increment', player, scoreType: 'sets' });
      dispatch({ type: 'gameOver' });
      dispatch({ type: 'winner', player });
      return;
    }

    // Default add 1 to players set score.
    dispatch({ type: 'increment', player, scoreType: 'sets' });
  }

  function calcGames(player) {
    const { games } = state[player];
    const opponent = player === 'playerOne' ? 'playerTwo' : 'playerOne';
    const opponentGames = state[opponent].games;

    // Reset score for next game.
    dispatch({ type: 'resetScore' });

    // Win set if games score is 6 and more then 1 point above opponents game score.
    if (games >= 5 && games - opponentGames >= 1) {
      dispatch({ type: 'increment', player, scoreType: 'games' });
      dispatch({ type: 'recordSet' });
      dispatch({ type: 'resetGames' });
      calcSets(player);
      return;
    }

    // Tie breaker. Sudden death.
    if (games === 6 && opponentGames === 6) {
      dispatch({ type: 'increment', player, scoreType: 'games' });
      dispatch({ type: 'recordSet' });
      dispatch({ type: 'resetGames' });
      calcSets(player);
      return;
    }

    // Default add 1 to players game score.
    dispatch({ type: 'increment', player, scoreType: 'games' });
  }

  function calcScore(player) {
    const { score } = state[player];
    const opponent = player === 'playerOne' ? 'playerTwo' : 'playerOne';
    const opponentScore = state[opponent].score;

    // If at 40 points and opponent at less then 40 points, win game.
    if (score === 3 && opponentScore < 3) {
      dispatch({ type: 'recordGames' });
      calcGames(player);
      return;
    }

    // If at advantage and win point, win game.
    if (score === 4) {
      dispatch({ type: 'recordGames' });
      calcGames(player);
      return;
    }

    // Reset to deuce if win point and opponent is at advantage.
    if (score === 3 && opponentScore === 4) {
      dispatch({ type: 'decrement', player: opponent, scoreType: 'score' });
      return;
    }

    // Default add 1 to players score.
    dispatch({ type: 'increment', player, scoreType: 'score' });
  }

  return (
    <div className="scoreboard">
      <div className="headerLeft">
        <h2>Player 1</h2>
      </div>
      <div className="setScore">
        <h3>Sets</h3>
        <div>
          <span>{state.playerOne.sets}</span>
          <span>-</span>
          <span>{state.playerTwo.sets}</span>
        </div>
      </div>
      <div className="headerRight">
        <h2>Player 2</h2>
      </div>
      <div className="playerOne">
        <span>{scoreFormat[state.playerOne.score]}</span>
      </div>
      <div className="currentSetScore">
        {
          state.playerOne.score === 3
          && state.playerTwo.score === 3
          && <span className="deuce">DEUCE</span>
        }
        <h3>Games</h3>
        <div>
          <span>{state.playerOne.games}</span>
          <span>-</span>
          <span>{state.playerTwo.games}</span>
        </div>
      </div>
      <div className="playerTwo">
        <span>{scoreFormat[state.playerTwo.score]}</span>
      </div>
      <div className="footer">
        <div className="footerBox">
          <div className="top">
            <span>Player 1</span>
          </div>
          <div className="bottom">
            <span>Player 2</span>
          </div>
        </div>
        {state.sets.map((set) => (
          <div className="footerBox" key={set.set + 1}>
            <div className="top">
              <span>{set.playerOne}</span>
            </div>
            <div className="bottom">
              <span>{set.playerTwo}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="buttons">
        <Button
          onClick={() => calcScore('playerOne')}
          label="Player 1 score"
          disabled={state.gameOver}
        />
        <Button
          onClick={() => calcScore('playerTwo')}
          label="Player 2 score"
          disabled={state.gameOver}
        />
      </div>
      <Button
        onClick={() => dispatch({ type: 'resetFull' })}
        label="Reset"
        id="reset"
      />
    </div>
  );
}

export default Scoreboard;
