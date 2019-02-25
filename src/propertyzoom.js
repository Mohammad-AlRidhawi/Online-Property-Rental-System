import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import Header from './components/header';
import Footer from './components/footer';
import Properties from './propertySubSystem/properties';
import LoginModal from './accountSubSystem/loginModal';
import MyAccountModal from './accountSubSystem/myAccountModal';
import { connect } from 'react-redux';
import { createAccount, signIn, updateAccount, deleteAccount, signOut } from './actions/accountActions'
import { updateProperties } from './actions/propertyActions';
import {Owner, fbProperty, db, Customer} from './actions/accountActions';

class Propertyzoom extends Component {

  constructor(props) {
    super(props);

    this.props.updateProperties();

    this.state = {
      loginOpen: false,
      isLoginLoading: false,
      myAccountOpen: false
    }
  }

  componentDidUpdate(prevProps) {
    if(this.state.isLoginLoading && (prevProps.userId !== this.props.userId)) {
      this.setState({loginOpen: false, isLoginLoading: false})
    }

    if(this.state.isLoginLoading && (prevProps.error !== this.props.error)) {
      this.setState({isLoginLoading: false})
    }

  }

  deletePropertyFromViewingList = (id) => {
    return new Promise((resolveGlobal, rejectGlobal) => {
      Customer.once("value")
      .then(snapshot => {
        const customers= Object.keys(snapshot.val());
        console.log(customers)
        for (var customerIndex = 0, p = Promise.resolve(customerIndex); customerIndex < customers.length; customerIndex++) {
          console.log(customers[customerIndex])
          p = p.then((customerIndex) => new Promise((resolve, reject) => {
            console.log(snapshot.val()[customers[customerIndex]].properties)
            if(snapshot.val()[customers[customerIndex]].properties) {
              var newProperties = [];
              for(var j=0; j < snapshot.val()[customers[customerIndex]].properties.length; j++){
                  if(snapshot.val()[customers[customerIndex]].properties[j] != id) {
                    newProperties.push(snapshot.val()[customers[customerIndex]].properties[j])
                  }
              }
              console.log(newProperties);
              if(snapshot.val()[customers[customerIndex]].properties.length != newProperties.length) {
                var updates = {
                  ['/Customer/' + customers[customerIndex] + '/' + 'properties']: newProperties
                };
                db.update(updates)
                .then(() =>  {
                  resolve(++customerIndex)
                })
              }
              else {
                resolve(++customerIndex)
              }
            }
            else {
              resolve(++customerIndex)
            }
          }))
        }
      })
    })
  }

  launchLoginModal = () => {
    this.setState({loginOpen: true})
  }

  launchMyAccountModal = () => {
    this.setState({myAccountOpen: true})
  }

  closeMyAccountModal = () => {
    this.setState({myAccountOpen: false})
  }

  closeLoginModal = () => {
    this.setState({loginOpen: false})
  }

  loginOrCreateAccount = (type, userInfo) => {

    if(type === "login"){
      const { email, password } = userInfo;
      this.setState({isLoginLoading: true}, () => {
        this.props.signIn(email, password)
      });
    }

    else if(type === "createAccount") {
      const { fname, lname, username, password, maximumRent, email, accountType } = userInfo;
      this.setState({isLoginLoading: true}, () => {
        this.props.createAccount(fname, lname, username, password, maximumRent, email, accountType)
      });
    }
  }

  onUpdateAccount = (updatedUserInfo) => {
    const userInformation = {
      userId: this.props.userId,
      fname: this.props.fname,
      lname: this.props.lname,
      username: this.props.username,
      maximumRent: this.props.maximumRent,
      email: this.props.email,
      accountType: this.props.accountType,
      viewingList: this.props.viewingList
    };

    this.props.updateAccount(updatedUserInfo, userInformation);
  }

  deleteAccount = () => {
    this.props.deleteAccount(this.props.userId);
    this.setState({myAccountOpen: false});
  }

  signOut = () => {
    this.props.signOut();
  }

  render() {
    const { fname, lname, username, maximumRent, email, accountType, userId } = this.props;
    const userInfo = {
      fname,
      lname,
      username,
      maximumRent,
      email,
      accountType,
      userId
    };
    return (
      <div>
        <Header userId={this.props.userId} signOut={this.signOut} launchMyAccount={this.launchMyAccountModal} login={this.launchLoginModal} />
        <LoginModal isLoading={this.state.isLoginLoading} loginErrorMessage={this.props.error} onSubmit={this.loginOrCreateAccount} onClose={this.closeLoginModal} open={this.state.loginOpen}/>
        <MyAccountModal deletePropertyFromViewingList={this.deletePropertyFromViewingList} updateProperties={this.props.updateProperties} deleteAccount={this.deleteAccount} updateErrorMessage={this.props.error} onClose={this.closeMyAccountModal} open={this.state.myAccountOpen} userInfo={userInfo} onUpdate={this.onUpdateAccount}/>
        <Properties deletePropertyFromViewingList={this.deletePropertyFromViewingList} updateProperties={this.props.updateProperties} userInfo={userInfo}  properties={this.props.properties}/>
        <Footer/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.userInfo.userId,
    error: state.userInfo.error,
    fname: state.userInfo.fname,
    lname: state.userInfo.lname,
    username: state.userInfo.username,
    maximumRent: state.userInfo.maximumRent,
    email: state.userInfo.email,
    accountType: state.userInfo.accountType,
    properties: state.propertyInfo
  }
};

const mapDispatchToProps = dispatch => ({
   createAccount: (fname, lname, username, password, maximumRent, email, accountType) => dispatch(createAccount(fname, lname, username, password, maximumRent, email, accountType)),
   signIn: (email, password) => dispatch(signIn(email, password)),
   updateAccount: (updateInformation, userInformation) => dispatch(updateAccount(updateInformation, userInformation)),
   deleteAccount: (userId) => dispatch(deleteAccount(userId)),
   signOut: () => dispatch(signOut()),
   updateProperties: () => dispatch(updateProperties())
});

export default connect(mapStateToProps, mapDispatchToProps)(Propertyzoom);
