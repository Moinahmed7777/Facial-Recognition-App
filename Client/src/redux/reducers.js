import {SET_UPLOAD, SET_FACEINDEX, SET_FaceID, GET_FaceID} from './actions';

const initialState = {
  faceid: [],
  upload: [],
  facelist: [],
  faceindex: 1,
};

function faceidReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FaceID:
      return {...state, faceid: action.payload};
    case GET_FaceID:
      return {...state, facelist: action.payload};
    case SET_UPLOAD:
      return {...state, upload: action.payload};
    case SET_FACEINDEX:
      return {...state, faceindex: action.payload};
    default:
      return state;
  }
}

export default faceidReducer;
