import * as actionTypes from './constants';
import { fromJS } from 'immutable';

const defaultState = fromJS({
  poemInfo: {},
  authorInfo: {},
  audioInfo: {},
  like: false,
  collect: false,
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.GET_CURRENT_POEM:
      return state.set('poemInfo', action.data);
    case actionTypes.GET_AUTHOR_INFO:
      return state.set('authorInfo', action.data);
    case actionTypes.GET_AUDIO_INFO:
      return state.set('audioInfo', action.data);
    case actionTypes.GET_LIKE:
      return state.set('like', action.data);
    case actionTypes.GET_COLLECT:
      return state.set('collect', action.data);
    default:
      return state;
  }
};
