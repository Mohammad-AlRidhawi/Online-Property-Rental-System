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
  Tab } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import AccountSettings from './accountSettings';
import PropertyViewingList from '../propertySubSystem/propertyViewingList'

export default class Header extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const panes = [
      { menuItem: 'Account Settings', render: () => <Tab.Pane attached={false}> <AccountSettings deleteAccount={this.props.deleteAccount} updateErrorMessage={this.props.updateErrorMessage} onUpdate={this.props.onUpdate} userInfo={this.props.userInfo}/> </Tab.Pane> },
      { menuItem: this.props.userInfo.accountType === "Owner" ? 'Properties' : 'Viewing List', render: () => <Tab.Pane attached={false}> <PropertyViewingList updateProperties={this.props.updateProperties} deletePropertyFromViewingList={this.deletePropertyFromViewingList} userInfo={this.props.userInfo}/> </Tab.Pane> }
    ]

    return (
      <Container>
        <Modal style={styles.modal} size="small" open={this.props.open} onClose={() => this.props.onClose()} >
          <Modal.Content >
            <Grid columns={1} centered>
              <Grid.Column width={14}>
                <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
              </Grid.Column>
            </Grid>
          </Modal.Content>
        </Modal>
      </Container>
    );
  }
}

const styles = {
  errorMessage: {
    marginTop: "10px"
  },
  modal: {
    minHeight: "60%"
  },
  controlButtons: {
    marginTop: "10px"
  }
}
