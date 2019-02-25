import { FETCH_PROPERTIES } from '../actions/types';

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROPERTIES:
      return {
        ...action.payload
      }
    default:
      return state;
  }
}
