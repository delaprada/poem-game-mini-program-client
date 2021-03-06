import * as actionTypes from './constants';
import { fromJS } from 'immutable';

const defaultState = fromJS({
  searchRes: {},
  loading: false,
});

export default (state = defaultState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_SEARCH_RES:
      return state.set('searchRes', action.data);
    case actionTypes.CHANGE_LOADING:
      return state.set('loading', action.data);
    default:
      return state;
  }
};