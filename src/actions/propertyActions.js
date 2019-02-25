import {fbProperty} from './accountActions';
import { FETCH_PROPERTIES } from './types';

export const updateProperties = () => dispatch => {
  fbProperty.once("value")
  .then(snapshot => {
    dispatch({
     type: FETCH_PROPERTIES,
     payload: {...snapshot.val()}
    });
    return;
  })
  .catch(error => {
    console.log(error);
    return;
  })
}
