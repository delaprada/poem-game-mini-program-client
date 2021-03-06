import {
  GET_CURRENT_POEM,
  GET_AUTHOR_INFO,
  GET_AUDIO_INFO,
  GET_LIKE,
  GET_COLLECT,
} from './constants';
import { fromJS } from 'immutable';
import {
  getPoemDetail,
  getAuthorDetail,
  getAudio,
  getDynamic,
} from '@servers/servers';

export const changePoemInfo = (data) => ({
  type: GET_CURRENT_POEM,
  data: fromJS(data),
});

export const changeAuthorInfo = (data) => ({
  type: GET_AUTHOR_INFO,
  data: fromJS(data),
});

export const changeAudioInfo = (data) => ({
  type: GET_AUDIO_INFO,
  data: fromJS(data),
});

export const changeLike = (data) => ({
  type: GET_LIKE,
  data: fromJS(data),
});

export const changeCollect = (data) => ({
  type: GET_COLLECT,
  data: fromJS(data),
});

export const getPoemInfo = (poem_id, category) => {
  return (dispatch) => {
    return getPoemDetail(poem_id, category)
      .then((res) => {
        const curPoem = res[0];

        if (category === '0') {
          curPoem.dynasty = 'S';
        } else if (category === '1') {
          curPoem.dynasty = 'T';
        }

        dispatch(changePoemInfo(curPoem));
      })
      .catch((err) => {
        console.error(err);
      });
  };
};

export const getAuthorInfo = (author_id, category) => {
  return (dispatch) => {
    if(author_id === undefined) {
      dispatch(changeAuthorInfo({}));
    }
    getAuthorDetail(author_id, category)
      .then((res) => {
        if (res) {
          dispatch(changeAuthorInfo(res[0]));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
};

export const getAudioInfo = (poem_id, category) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      getAudio(poem_id, category)
        .then((data) => {
          if (data.length > 0) {
            dispatch(changeAudioInfo(data[0]));
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    });
  };
};

export const getDynamicInfo = (poem_id, category) => {
  return (dispatch) => {
    getDynamic(poem_id, category)
      .then((res) => {
        const { like, collect } = res;
        dispatch(changeLike(like));
        dispatch(changeCollect(collect));
      })
      .catch((err) => {
        console.error(err);
      });
  };
};
