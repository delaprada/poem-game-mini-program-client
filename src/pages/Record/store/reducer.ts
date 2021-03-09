import * as actionTypes from './constants';
import { fromJS } from 'immutable';

const defaultState = fromJS({
  url: '',
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SET_URL:
      return state.set('url', action.data);
    default:
      return state;
  }
};
