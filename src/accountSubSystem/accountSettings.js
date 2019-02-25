import React, { Component } from 'react';
import {
  Container,
  Grid,
  Image,
  Button,
  TransitionablePortal,
  Modal,
  Form,
  Label,
  Divider } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import * as emailRegex from "email-regex";

export default class AccountSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      passwordConfirm: "",
      maximumRent: props.userInfo.maximumRent,
      email: props.userInfo.email,
      okayToUpdateEmail: false,
      okayToUpdateMaxRent: false,
      okayToUpdatePassword: false,
      loading: false
    }
  }

  componentDidUpdate(prevProps) {
    if(this.state.loading) {
      this.setState({loading: false});
    }
  }

  updateEmail = () => {
    const { email, okayToUpdateEmail} = this.state;
    const userInformation = {};

    if(okayToUpdateEmail) {
      userInformation.email = email;
      this.props.onUpdate(userInformation);
      this.setState({loading: true});
    }
  }

  updateMaxRent = () => {
    const { maximumRent, okayToUpdateMaxRent} = this.state;
    const userInformation = {};


    if(okayToUpdateMaxRent) {
      userInformation.maximumRent = maximumRent;
      this.props.onUpdate(userInformation);
      this.setState({loading: true});
    }
  }

  updatePassword = () => {
    const { password, okayToUpdatePassword} = this.state;
    const userInformation = {};

    if(okayToUpdatePassword) {
      userInformation.password = password;
      this.props.onUpdate(userInformation);
      this.setState({loading: true});
    }
  }


  handleFormChangeEmail = (e, { field }) => {
    var okayToUpdateEmail = false;

    if(emailRegex({exact: true}).test(e.target.value) && e.target.value !== this.props.userInfo.email) {
      okayToUpdateEmail = true;
    }

    this.setState({[field]: e.target.value, okayToUpdateEmail});
  }

  handleFormChangePassword = (e, { field }) => {
    var okayToUpdatePassword = false;
    if(e.target.value === this.state.passwordConfirm && e.target.value.trim() !== "") {
      okayToUpdatePassword = true;
    }
    this.setState({[field]: e.target.value, okayToUpdatePassword});
  }

  handleFormChangePasswordConfirm = (e, { field }) => {
    var okayToUpdatePassword = false;

    if(e.target.value === this.state.password && e.target.value.trim() !== "") {
      okayToUpdatePassword = true;
    }

    this.setState({[field]: e.target.value, okayToUpdatePassword});
  }

  handleFormChangeMaxRent = (e, { field }) => {
    var okayToUpdateMaxRent = false;

    if(e.target.value.trim() !== "" && e.target.value !== this.props.userInfo.maximumRent) {
      okayToUpdateMaxRent = true
    }

    this.setState({[field]: e.target.value, okayToUpdateMaxRent});
  }

  render() {
    return (
      <Container>
        <Grid columns={1} centered>
          <Grid.Column width={14}>
            <Label>{this.props.userInfo.fname}</Label>
            <Label>{this.props.userInfo.lname}</Label>
            <Label>{this.props.userInfo.accountType}</Label>
            <Label>{this.props.userInfo.username}</Label>
            <Divider />
            <Form>
              <Grid columns={2}>
                <Grid.Column>
                  <Grid.Row style={styles.formRows}>
                    <Form.Input size='small' field="email" type="email" value={this.state.email} onChange={this.handleFormChangeEmail} placeholder='Email'/>
                  </Grid.Row>
                  <Grid.Row style={styles.formRows}>
                    <Form.Input size='small' key="maximumRent" value={this.state.maximumRent} field="maximumRent" onChange={this.handleFormChangeMaxRent} placeholder='Maximum Rent'/>
                  </Grid.Row>
                  <Grid.Row style={styles.formRows}>
                    <Form.Input size='small' field="password" type="password" value={this.state.password} onChange={this.handleFormChangePassword} placeholder='New Password'/>
                  </Grid.Row>
                  <Grid.Row style={styles.formRows}>
                    <Form.Input size='small' field="passwordConfirm" type="password" value={this.state.passwordConfirm} onChange={this.handleFormChangePasswordConfirm} placeholder='Confirm Password'/>
                  </Grid.Row>
                  <Grid.Row style={styles.formRows}>
                    <Button loading={this.state.loading} onClick={this.updatePassword} disabled={!this.state.okayToUpdatePassword} size='small'>Change Password</Button>
                  </Grid.Row>
                </Grid.Column>
                <Grid.Column>
                  <Grid.Row style={styles.formRows}>
                    <Button loading={this.state.loading} onClick={this.updateEmail} disabled={!this.state.okayToUpdateEmail} size='small'>Change Email</Button>
                  </Grid.Row>
                  <Grid.Row style={styles.formRows}>
                    <Button loading={this.state.loading} onClick={this.updateMaxRent} disabled={!this.state.okayToUpdateMaxRent} size='small'>Change Maximum Rent</Button>
                  </Grid.Row>
                </Grid.Column>
              </Grid>
            </Form>
            {this.props.updateErrorMessage !== "" &&
              <Label style={styles.errorMessage} basic color='red'>
                {this.props.loginErrorMessage}
              </Label>
            }
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

const styles = {
  errorMessage: {
    marginTop: "10px"
  },
  formRows: {
    marginTop: "10px",
    marginBottom: "10px"
  },
  controlButtons: {
    marginTop: "10px"
  }
}
