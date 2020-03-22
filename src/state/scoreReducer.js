import utils from '../utils';

const { scoreFormat } = utils;

export const initialState = {
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
  games: [],
};

export function reducer(state, action) {
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
          games: state.games,
        }],
      };
    case 'recordGames':
      return {
        ...state,
        games: [...state.games, {
          game: state.games.length + 1,
          playerOne: scoreFormat[state.playerOne.score],
          playerTwo: scoreFormat[state.playerTwo.score],
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
        games: [],
      };
    case 'resetFull':
      return initialState;
    default:
      throw new Error();
  }
}
