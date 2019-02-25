import React, { Component } from 'react';
import { Segment, Grid } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

export default class Footer extends Component {

  render() {
    return (
      <Segment style={styles.footerContainer}>
        <Grid>
          <Grid.Column width={3}>
          </Grid.Column>
          <Grid.Column width={8}>
          </Grid.Column>
          <Grid.Column width={5}>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

const styles = {
  footerContainer: {
    position: "fixed",
    bottom: 0,
    width: "100%"
  }
}
