import { CHANGE_USER_INFO } from './constants';
import { fromJS } from 'immutable';

export const changeUserInfo = (data) => ({
  type: CHANGE_USER_INFO,
  data: fromJS(data),
});
