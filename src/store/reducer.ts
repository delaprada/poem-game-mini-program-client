import { combineReducers } from 'redux-immutable';
import { reducer as searchReducer } from '@pages/Search/store/index';
import { reducer as playerReducer } from '@pages/Player/store/index';
import { reducer as poemReducer } from '@pages/Poem/store/index';

export default combineReducers({
  search: searchReducer,
  player: playerReducer,
  poem: poemReducer,
});
