import { combineReducers } from 'redux';
import userInformationReducer from './userInformationReducer';
import propertyReducer from './propertyReducer';


export default combineReducers({
  userInfo: userInformationReducer,
  propertyInfo: propertyReducer
});
