import { CHANGE_SEARCH_RES, CHANGE_LOADING } from './constants';
import { fromJS } from 'immutable';
import { getSearchResult } from '@servers/servers';

export const changeLoading = (data) => ({
  type: CHANGE_LOADING,
  data,
});

export const changeSearchRes = (data) => ({
  type: CHANGE_SEARCH_RES,
  data: fromJS(data),
});

export const getSearchRes = (text) => {
  return (dispatch) => {
    if (!text) {
      dispatch(changeSearchRes({}));
      dispatch(changeLoading(false));
    } else {
      getSearchResult(text)
        .then((data) => {
          dispatch(changeSearchRes(data));
          dispatch(changeLoading(false));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
};
