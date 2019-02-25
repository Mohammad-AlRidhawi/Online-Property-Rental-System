import { CREATE_ACCOUNT, SIGN_IN, SIGN_OUT, UPDATE_ACCOUNT, DELETE_ACCOUNT } from './types';
import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyB2T_vN-Vgd1Nq-wevS1YF3rl7O2V-2-TI",
  authDomain: "propertyzoom-1460f.firebaseapp.com",
  databaseURL: "https://propertyzoom-1460f.firebaseio.com",
  projectId: "propertyzoom-1460f",
  storageBucket: "propertyzoom-1460f.appspot.com",
  messagingSenderId: "94703854985"
};
firebase.initializeApp(config);

export const db = firebase.database().ref();
export const Account = db.child('Account');
export const Customer = db.child('Customer');
export const Owner = db.child('Owner');
export const fbProperty = db.child('Property');

export const signOut = () => dispatch => {
  dispatch({
   type: SIGN_OUT,
   payload: {}
  });
}


export const signIn = (email, password) => dispatch => {
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((data) => {
    const uid = data.user.uid;
    Account.child(uid).once("value")
    .then(snapshot => {
      dispatch({
       type: SIGN_IN,
       payload: {
         userId: uid,
         error: "",
         fname: snapshot.val().fname,
         lname: snapshot.val().lname,
         username: snapshot.val().username,
         maximumRent: snapshot.val().maximumRent,
         email: snapshot.val().email,
         accountType: snapshot.val().accountType
       }
      });
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      dispatch({
       type: SIGN_IN,
       payload: {
         userId: "",
         error: errorMessage,
       }
      });
    })
  })
  .catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    dispatch({
     type: SIGN_IN,
     payload: {
       userId: "",
       error: errorMessage,
     }
    });
  });
}


export const createAccount = (fname, lname, username, password, maximumRent, email, accountType) => dispatch => {
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then( (data) => {
    const uid = data.user.uid;
    Account.child(uid).set({
        fname,
        lname,
        username,
        maximumRent,
        email,
        accountType
    }, () => {
      var databaseRef = Customer;

      if(accountType === "Owner") {
        databaseRef = Owner
      }

      databaseRef.child(uid).set({
          uid: uid
      }, () => {
        dispatch({
         type: CREATE_ACCOUNT,
         payload: {
           userId: uid,
           error: "",
           fname: fname,
           lname: lname,
           username: username,
           maximumRent: maximumRent,
           email: email,
           accountType: accountType
         }
        });
      })
    });
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    dispatch({
     type: CREATE_ACCOUNT,
     payload: {
       userId: "",
       error: errorMessage
     }
    });
  });
}

export const deleteAccount = (userId, accountType) => dispatch => {
  var user = firebase.auth().currentUser;

  user.delete()
  .then(() => {
    Account.child(userId).remove()
    .then(() => {
      var databaseRef = Customer;
      if(accountType === "Owner") {
        databaseRef = Owner
      }
      databaseRef.child(userId).remove()
      .then(() => {
        dispatch({
         type: DELETE_ACCOUNT,
         payload: {}
        });
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        dispatch({
         type: DELETE_ACCOUNT,
         payload: {error: errorMessage}
        });
      })
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      dispatch({
       type: DELETE_ACCOUNT,
       payload: {error: errorMessage}
      });
    })
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    dispatch({
     type: DELETE_ACCOUNT,
     payload: {error: errorMessage}
    });
  });
}

export const updateAccount = (updateInformation, userInformation) => dispatch => {
  if(updateInformation.maximumRent) {
    var updates = {
      ['/Account/' + userInformation.userId + '/' + 'maximumRent']: updateInformation.maximumRent
    };
    firebase.database().ref().update(updates)
    .then(() =>  {
      userInformation.maximumRent = updateInformation.maximumRent;
      dispatch({
       type: UPDATE_ACCOUNT,
       payload: {...userInformation}
      });
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      dispatch({
       type: UPDATE_ACCOUNT,
       payload: {...userInformation, error: errorMessage}
      });
    });
  }

  else if(updateInformation.email) {
    var updates = {
      ['/Account/' + userInformation.userId + '/' + 'email']: updateInformation.email
    };
    var user = firebase.auth().currentUser;

    user.updateEmail(updateInformation.email)
    .then(() => {
      firebase.database().ref().update(updates)
      .then(() =>  {
        userInformation.email = updateInformation.email;
        dispatch({
         type: UPDATE_ACCOUNT,
         payload: {...userInformation}
        });
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        dispatch({
         type: UPDATE_ACCOUNT,
         payload: {...userInformation, error: errorMessage}
        });
      });
    }).catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      dispatch({
       type: UPDATE_ACCOUNT,
       payload: {...userInformation, error: errorMessage}
      });
    });
  }

  if(updateInformation.password) {
    let user = firebase.auth().currentUser;

    user.updatePassword(updateInformation.password)
    .then(() =>  {
      dispatch({
       type: UPDATE_ACCOUNT,
       payload: {...userInformation}
      });
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      dispatch({
       type: UPDATE_ACCOUNT,
       payload: {...userInformation, error: errorMessage}
      });
    });
  }
}
