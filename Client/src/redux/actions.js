export const SET_FaceID = 'SET_FaceID';
export const SET_UPLOAD = 'SET_UPLOAD';
export const SET_FACEINDEX = 'SET_FACEINDEX';

export const GET_FaceID = 'GET_FaceID';

export const setFaceid = faceid => dispatch => {
  dispatch({
    type: SET_FaceID,
    payload: faceid,
  });
};
export const getfaceid = facelist => dispatch => {
  dispatch({
    type: SET_FaceID,
    payload: facelist,
  });
};

export const setUpload = upload => dispatch => {
  dispatch({
    type: SET_UPLOAD,
    payload: upload,
  });
};

export const setFaceindex = faceindex => dispatch => {
  dispatch({
    type: SET_FACEINDEX,
    payload: faceindex,
  });
};
