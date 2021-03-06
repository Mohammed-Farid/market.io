import {
  SET_LOADING,
  CLIENT_LOADED,
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  AUTH_ERROR,
  LOGOUT,
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case CLIENT_LOADED:
      return {
        ...state,
        client: action.payload.client,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        client: action.payload.client,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case LOGOUT:
      return {
        ...state,
        client: null,
        isAuthenticated: false,
        loading: false,
        token: false,
        error: null,
      };

    case AUTH_ERROR:
      return {
        ...state,
        client: null,
        error: action.payload.data.errors,
        isAuthenticated: false,
        loading: false,
        token: false,
      };

    default:
      return state;
  }
};
