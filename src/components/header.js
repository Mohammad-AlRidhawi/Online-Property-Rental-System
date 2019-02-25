import React, { Component } from 'react';
import { Segment, Grid, Image, Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

export default class Header extends Component {

  render() {
    return (
      <Segment style={styles.headerContainer}>
        <Grid>
          <Grid.Column width={3}>
            <Image size='small' src={require('../assets/propertyZoom.png')} />
          </Grid.Column>
          <Grid.Column width={8}>
          </Grid.Column>
          <Grid.Column width={5}>
            { (!this.props.userId || this.props.userId === "") &&
              <Button floated='right' color='teal' onClick={() => this.props.login()}>Login</Button>
            }

            { this.props.userId && this.props.userId !== "" &&
              <Button floated='right' color='red' onClick={() => this.props.signOut()}>Sign Out</Button>
            }

            { this.props.userId && this.props.userId !== "" &&
              <Button floated='right' color='teal' onClick={() => this.props.launchMyAccount()}>My account</Button>
            }

          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

const styles = {
  headerContainer: {
    width: "100%"
  }
}
