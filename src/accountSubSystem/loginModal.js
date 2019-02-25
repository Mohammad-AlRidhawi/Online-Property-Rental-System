import React, { Component } from 'react';
import {
  Container,
  Grid,
  Image,
  Button,
  TransitionablePortal,
  Modal,
  Form,
  Label } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import * as emailRegex from "email-regex";

const options = [
  { key: 'Owner', text: 'Owner', value: 'Owner' },
  { key: 'Customer', text: 'Customer', value: 'Customer' },
]

export default class Header extends Component {

  constructor(props) {
    super(props);

    this.state = {
      login: true,
      createAccount: false,
      fname: "",
      lname: "",
      username: "",
      password: "",
      maximumRent: "",
      email: "",
      accountType: "",
      fieldsToCorrectCreateAccount: {fname: true, lname: true, username: true, password: true, maximumRent: true, email: true, accountType: true},
      fieldsToCorrectLogin: {email: true, password: true}
    }
  }

  alterFormType = () => {
    this.setState({
      login: !this.state.login,
      createAccount: !this.state.account
    })
  }

  submitRegistrationForm = () => {
    const { fname, lname, username, password, maximumRent, email, accountType } = this.state;
    const type =  this.state.login ? "login" : "createAccount";
    const userInformation = type === "createAccount" ? {
      fname: fname,
      lname: lname,
      username: username,
      password: password,
      maximumRent: maximumRent,
      email: email,
      accountType: accountType
    } :
    {
      email: email,
      password: password,
    };
    if (emailRegex({exact: true}).test(email)) {
      this.props.onSubmit(this.state.login ? "login" : "createAccount", userInformation);
    }
  }

  handleAccountTypeChange = (e, { value })  => {
    var fieldsCreateAccount = this.state.fieldsToCorrectCreateAccount;

    if(value) {
      delete fieldsCreateAccount.accountType;
    }

    else {
      fieldsCreateAccount.accountType = true;
    }

    this.setState({accountType: value, fieldsToCorrectCreateAccount: fieldsCreateAccount});

  }

  handleFormChange = (e, { field }) => {
    var fieldsLogin = this.state.fieldsToCorrectLogin;
    var fieldsCreateAccount = this.state.fieldsToCorrectCreateAccount;

    if(e.target.value.trim() !== "") {
      delete fieldsLogin[field];
      delete fieldsCreateAccount[field];
    }
    else {
      if(field === "password" || field === "email") {
        fieldsLogin[field] = true;
        fieldsCreateAccount[field] = true;
      }

      else {
        const fieldToCorrectType = this.state.login ? fieldsLogin : fieldsCreateAccount
        fieldToCorrectType[field] = true;
      }
    }

    this.setState({[field]: e.target.value, fieldsToCorrectCreateAccount: fieldsCreateAccount, fieldsToCorrectLogin: fieldsLogin});
  }

  render() {
    const createAccountFields = this.state.login ? [] : [
      <Form.Input key="fname" value={this.state.fname} field="fname" onChange={this.handleFormChange} placeholder='First Name'/>,
      <Form.Input key="lname" value={this.state.lname} field="lname" onChange={this.handleFormChange} placeholder='Last Name'/> ,
      <Form.Input key="username" value={this.state.username} field="username" onChange={this.handleFormChange} placeholder='Username'/>,
      <Form.Input key="maximumRent" type="number" value={this.state.maximumRent} field="maximumRent" onChange={this.handleFormChange} placeholder='Maximum Rent'/>,
      <Form.Select key="accountType" value={this.state.accountType} field="accountType" onChange={this.handleAccountTypeChange} fluid label='Account Type' options={options} placeholder='Account Type' />
    ]

    const currentFieldsType = this.state.login ? this.state.fieldsToCorrectLogin : this.state.fieldsToCorrectCreateAccount;
    const fieldsToCorrect = Object.keys(currentFieldsType);

    return (
      <Container>
        <TransitionablePortal
          open={this.props.open}
          onOpen={() => setTimeout(() => document.body.classList.add('modal-fade-in'), 0)}
          transition={{ animation: 'scale', duration: 500 }}>
          <Modal  style={styles.modal} size="tiny" open={this.props.open} onClose={() => this.props.onClose()} >
            <Modal.Header>{this.state.login ? "Login" : "Create Account"}</Modal.Header>
            <Modal.Content >
              <Grid columns={1} centered>
                <Grid.Column width={14}>
                  <Form>
                    <Form.Input field="email" type="email" value={this.state.email} onChange={this.handleFormChange} placeholder='Email'/>
                    <Form.Input field="password" type="password" value={this.state.password} onChange={this.handleFormChange} placeholder='Password'/>
                    {createAccountFields}
                    <Button disabled={fieldsToCorrect.length !== 0} style={styles.controlButtons} onClick={this.submitRegistrationForm} type='submit'>Submit</Button>
                    <Button color='blue' disabled={this.props.isLoading} style={styles.controlButtons} onClick={this.alterFormType}>{this.state.login ? "Create account instead" : "Login instead"}</Button>
                  </Form>

                  {this.props.loginErrorMessage !== "" &&
                    <Label style={styles.errorMessage} basic color='red'>
                      {this.props.loginErrorMessage}
                    </Label>
                  }
                </Grid.Column>
              </Grid>
            </Modal.Content>
          </Modal>
        </TransitionablePortal>
      </Container>
    );
  }
}

const styles = {
  errorMessage: {
    marginTop: "10px"
  },
  modal: {
    maxWidth: "94%"
  },
  controlButtons: {
    marginTop: "10px"
  }
}
