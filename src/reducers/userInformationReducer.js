import { CREATE_ACCOUNT, SIGN_IN, SIGN_OUT, UPDATE_ACCOUNT, DELETE_ACCOUNT } from '../actions/types';

const initialState = {
  userId: "",
  error: "",
  fname: "",
  lname: "",
  username: "" ,
  maximumRent: "",
  email: "",
  accountType: "",
  viewingList: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_ACCOUNT:
      return {
        ...state,
        ...action.payload
      }
    case SIGN_IN:
      return {
        ...state,
        ...action.payload
      }
    case SIGN_OUT:
      return {
        ...initialState
      }
    case UPDATE_ACCOUNT:
      return {
        ...state,
        ...action.payload
      }
    case DELETE_ACCOUNT:
      return {
        ...initialState
      }
    default:
      return state;
  }
}
