import {
  GET_SONG_INFO,
} from './constants';
import { fromJS } from 'immutable';

export const changeSongInfo = (data) => ({
  type: GET_SONG_INFO,
  data: fromJS(data),
});
