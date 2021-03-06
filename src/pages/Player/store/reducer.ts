import * as actionTypes from './constants';
import { fromJS } from 'immutable';

const defaultState = fromJS({
  currentSongInfo: {},
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.GET_SONG_INFO:
      return state.set('currentSongInfo', action.data);
    default:
      return state;
  }
};
