import React, { Component } from 'react';
import { Grid, Input } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import Property from './property';
import {Owner, fbProperty, db} from '../actions/accountActions';

export default class Properties extends Component {

  constructor(props) {
    super(props);

    this.state = {
      filteredProps: this.props.properties
    };
  }

  componentDidUpdate(prevProps) {
    if(Object.keys(prevProps.properties).length == 0 && Object.keys(this.props.properties).length != 0) {
      this.setState({filteredProps: this.props.properties});
    }

    else if(Object.keys(prevProps.properties).length != 0 && Object.keys(this.props.properties).length == 0) {
      this.setState({filteredProps: {}});
    }

    else if(Object.keys(prevProps.properties).length != Object.keys(this.props.properties).length) {
      this.setState({filteredProps: this.props.properties});
    }
  }

  onDeleteProperty = (id) => {
    if(this.props.userInfo.accountType == "Owner" && this.props.userInfo.userId != "") {
      Owner.child(this.props.userInfo.userId).once("value")
      .then(snapshot => {
        var newProps = []
        for(var i=0; i< snapshot.val().properties.length; i++) {
          if(snapshot.val().properties[i] != id) {
            newProps.push(snapshot.val().properties[i]);
          }
        }

        var updates = {
          ['/Owner/' + this.props.userInfo.userId + '/' + 'properties']: newProps
        };
        fbProperty.child(id).remove()
        .then(() => {
          db.update(updates)
          .then(() =>  {
            this.props.updateProperties();
            this.props.deletePropertyFromViewingList(id);
          })
          .catch(error => {
            console.log(error);
          })
        })
        .catch(error => {
          console.log(error)
        })
      })
      .catch(error => {
        console.log(error);
      })
    }
  }

  updateProperty = (key, value, id) => {
    var updates = {
      ['/Property/' + id + '/' + key]: value
    };
    db.update(updates)
    .then(() =>  {
      this.props.updateProperties();
    })
    .catch(error => {
      console.log(error);
    })
  }

  handleFormChange = (type, e) => {
    var filteredProps = {}
    for(var property in this.props.properties) {
      if(this.props.properties[property][type].toLowerCase() == e.target.value.toLowerCase() || e.target.value.trim() == "") {
        filteredProps[this.props.properties[property].id] = this.props.properties[property]
      }
    }

    this.setState({filteredProps});
  }

  render() {
    const keys = Object.keys(this.state.filteredProps);
    const fullRows = Math.floor(keys.length/3);
    const partialRows = keys.length % 3;
    var rows = [];
    var remainderCols = []

    console.log(fullRows, partialRows);

    for(var i = 0; i < fullRows * 3;) {
      rows.push(
        <Grid.Row key={keys[i] + "rows"}>
          <Grid.Column>
            <Property onUpdateProperty={this.updateProperty} onDelete={this.onDeleteProperty} userInfo={this.props.userInfo} viewMore={true} propertyInfo={this.state.filteredProps[keys[i]]}/>
          </Grid.Column>
          <Grid.Column>
            <Property onUpdateProperty={this.updateProperty} onDelete={this.onDeleteProperty} userInfo={this.props.userInfo} viewMore={true} propertyInfo={this.state.filteredProps[keys[i + 1]]}/>
          </Grid.Column>
          <Grid.Column>
            <Property onUpdateProperty={this.updateProperty} onDelete={this.onDeleteProperty} userInfo={this.props.userInfo} viewMore={true} propertyInfo={this.state.filteredProps[keys[i + 2]]}/>
          </Grid.Column>
        </Grid.Row>
      );
      i+=3;
    }
    for(var j = 0; j < partialRows; j++) {
      remainderCols.push(
        <Grid.Column key={keys[j] + "remainder"}>
          <Property onUpdateProperty={this.updateProperty} onDelete={this.onDeleteProperty} userInfo={this.props.userInfo} viewMore={true} propertyInfo={this.state.filteredProps[keys[(j + fullRows * 3)]]}/>
        </Grid.Column>
      );
    }

    return (
      <div style={styles.propertiesContainer}>
        <Grid stackable columns={6}>
          <Grid.Row>
            <Grid.Column>
              <Input onChange={(e) => this.handleFormChange("bathrooms", e)} size='mini' style={styles.rooms} label='Bathrooms' placeholder='' />
            </Grid.Column>
            <Grid.Column>
              <Input onChange={(e) => this.handleFormChange("bedrooms", e)} size='mini' style={styles.rooms} label='Bedrooms' placeholder='' />
            </Grid.Column>
            <Grid.Column>
              <Input onChange={(e) => this.handleFormChange("location", e)} size='mini' style={styles.location} label='Location' placeholder='' />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Input onChange={(e) => this.handleFormChange("rent", e)} size='mini' style={styles.rent} label='Rent' placeholder='' />
            </Grid.Column>
            <Grid.Column>
              <Input onChange={(e) => this.handleFormChange("propertyType", e)} size='mini' style={styles.rent} label='Type' placeholder='' />
            </Grid.Column>
            <Grid.Column>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid stackable columns={3}>
          {rows}
          <Grid.Row>
            {remainderCols}
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const styles = {
  propertiesContainer: {
    paddingBottom: "50px",
    paddingLeft: "20px",
    paddingRight: "20px"
  },
  rooms: {
    width: "50px"
  },

  location: {
    width: "100px"
  },

  rent: {
    width: "100px"
  }
}
