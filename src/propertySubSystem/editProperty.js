import React, { Component } from 'react';
import { Modal, Grid, Button, Label, Form, Divider, Icon } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

export default class EditProperty extends Component {

  constructor(props){
    super(props);

    var photos = {};
    var photoCounter = [];
    var photoToCorrect = {};

    for(var i = 0; i < props.propertyInfo.photos.length; i++) {
      const key = Math.random();
      photos[key] = props.propertyInfo.photos[i];
      // photoToCorrect[key] = props.propertyInfo.photos[i]
      photoCounter.push(key);
    }

    this.state = {
      bedrooms: props.propertyInfo.bedrooms,
      bathrooms: props.propertyInfo.bathrooms,
      otherrooms: props.propertyInfo.otherrooms,
      rent: parseInt(props.propertyInfo.rent),
      photoCounter,
      photos,
      photoToCorrect,
      okayToUpdateRent: false,
      okayToUpdateBedrooms: false,
      okayToUpdateBathrooms: false,
      okayToUpdateOtherrooms: false
    };
  }

  handleBedroomsChange = (e, { field }) => {
    var okayToUpdateBedrooms = false;

    if(e.target.value.trim() !== "" && e.target.value.trim() !== this.props.propertyInfo.bedrooms) {
      okayToUpdateBedrooms = true;
    }

    this.setState({[field]: e.target.value, okayToUpdateBedrooms});
  }

  updateBedrooms = () => {
    const { bedrooms, okayToUpdateBedrooms} = this.state;

    if(okayToUpdateBedrooms) {
      this.props.onUpdate("bedrooms", bedrooms, this.props.propertyInfo.id);
    }
  }

  updatePhotos = () => {
    var arrayPhotos = [];

    for(var key in this.state.photos) {
      arrayPhotos.push(this.state.photos[key])
    }

    this.props.onUpdate("photos", arrayPhotos, this.props.propertyInfo.id);
  }

  updateBathrooms = () => {
    const { bathrooms, okayToUpdateBathrooms} = this.state;

    if(okayToUpdateBathrooms) {
      this.props.onUpdate("bathrooms", bathrooms, this.props.propertyInfo.id);
    }
  }

  updateOtherrooms = () => {
    const { otherrooms, okayToUpdateOtherrooms} = this.state;

    if(okayToUpdateOtherrooms) {
      this.props.onUpdate("otherrooms", otherrooms, this.props.propertyInfo.id);
    }
  }

  updateRent = () => {
    const { rent, okayToUpdateRent} = this.state;

    if(okayToUpdateRent) {
      this.props.onUpdate("rent", rent, this.props.propertyInfo.id);
    }
  }

  handleBathroomsChange = (e, { field }) => {
    var okayToUpdateBathrooms = false;

    if(e.target.value.trim() !== "" && e.target.value.trim() !== this.props.propertyInfo.bathrooms) {
      okayToUpdateBathrooms = true;
    }

    this.setState({[field]: e.target.value, okayToUpdateBathrooms});
  }

  handleOtherroomsChange = (e, { field }) => {
    var okayToUpdateOtherrooms = false;

    if(e.target.value.trim() !== "" && e.target.value.trim() !== this.props.propertyInfo.otherrooms) {
      okayToUpdateOtherrooms = true;
    }

    this.setState({[field]: e.target.value, okayToUpdateOtherrooms});
  }

  handleRentChange = (e, { field }) => {
    var okayToUpdateRent = false;

    if(e.target.value !== "" && e.target.value !== this.props.propertyInfo.rent) {
      okayToUpdateRent = true;
    }

    this.setState({[field]: e.target.value, okayToUpdateRent});
  }

  handlePictureChange = (e, key, index) => {
    var photoToCorrect = this.state.photoToCorrect
    var photos = this.state.photos

    if(e.target.value.trim().match(/\.(jpeg|jpg|gif|png)$/) != null && (e.target.value !== this.props.propertyInfo.photos[index] || this.state.photoCounter.length > 1)) {
      delete photoToCorrect[key];
      photos[key] = e.target.value;
    }

    else {
      photoToCorrect[key] = true;
      delete photos[key];
    }
    this.setState({photoToCorrect: photoToCorrect});
  }

  addNewPictureLink = () => {
    const key = Math.random();
    var photoToCorrect = this.state.photoToCorrect
    photoToCorrect[key] = true;

    var photoCounter = this.state.photoCounter
    photoCounter.push(key);
    this.setState({photoToCorrect, photoCounter});
  }

  removeNewPictureLink = (key, index) => {
    var photos = this.state.photos
    var photoToCorrect = this.state.photoToCorrect
    delete photoToCorrect[key];
    delete photos[key];

    var photoCounter = this.state.photoCounter
    photoCounter.splice(index, 1);
    this.setState({photoToCorrect, photoCounter});
  }

  onDelete = () => {
    this.props.onDelete(this.props.propertyInfo.id);
  }

  render() {
    const photoToCorrect = Object.keys(this.state.photoToCorrect);

    return (
      <Modal size="small" closeIcon
        open={this.props.open}
        onClose={this.props.onClose}>
        <Modal.Header>Edit Property</Modal.Header>
        <Modal.Content>
          <Grid columns={1} centered>
            <Grid.Column width={14}>
              <Label>{this.props.propertyInfo.address}</Label>
              <Label>{this.props.propertyInfo.propertyType}</Label>
              <Label>{this.props.propertyInfo.location}</Label>
              <Divider />
              <Form>
                <Grid columns={2}>
                  <Grid.Column>
                    <Grid.Row style={styles.formRows}>
                      <Form.Input size='small' field="bedrooms" type="number" value={this.state.bedrooms} onChange={this.handleBedroomsChange} placeholder='Bedrooms'/>
                    </Grid.Row>
                    <Grid.Row style={styles.formRows}>
                      <Form.Input size='small' field="bathrooms" type="number" value={this.state.bathrooms} onChange={this.handleBathroomsChange} placeholder='Bathrooms'/>
                    </Grid.Row>
                    <Grid.Row style={styles.formRows}>
                      <Form.Input size='small' field="otherrooms" type="number" value={this.state.otherrooms} onChange={this.handleOtherroomsChange} placeholder='Other rooms'/>
                    </Grid.Row>
                    <Grid.Row style={styles.formRows}>
                      <Form.Input size='small' field="rent" type="number" value={this.state.rent} onChange={this.handleRentChange} placeholder='rent'/>
                    </Grid.Row>
                    {this.state.photoCounter.map((number, index) =>
                      <Grid.Row key={number.toString()}>
                        <Grid columns={2}>
                          {this.state.photoCounter.length > 1 &&
                            <Grid.Column width={1}>
                                <Icon onClick={() => this.removeNewPictureLink(number, index)} style={styles.closeIcon} color='red' size='large' name="x"/>
                              </Grid.Column>
                          }
                          <Grid.Column width={14}>
                            <Form.Input inline field="photos" value={this.state.photos[number]} onChange={(e) => this.handlePictureChange(e, number, index)} placeholder='Picture link'/>
                          </Grid.Column>
                        </Grid>
                      </Grid.Row>
                    )}
                    <Button size="tiny" style={styles.controlButtons} onClick={this.addNewPictureLink}>Add Another Photo</Button>
                    <Grid.Row style={styles.formRows}>
                      <Button onClick={this.onDelete} negative>Delete Property</Button>
                    </Grid.Row>
                  </Grid.Column>
                  <Grid.Column>
                    <Grid.Row style={styles.formRows}>
                      <Button onClick={this.updateBedrooms} disabled={!this.state.okayToUpdateBedrooms} size='small'>Change number of Bedrooms</Button>
                    </Grid.Row>
                    <Grid.Row style={styles.formRows}>
                      <Button onClick={this.updateBathrooms} disabled={!this.state.okayToUpdateBathrooms} size='small'>Change number of Bathrooms</Button>
                    </Grid.Row>
                    <Grid.Row style={styles.formRows}>
                      <Button onClick={this.updateOtherrooms} disabled={!this.state.okayToUpdateOtherrooms} size='small'>Change number of Other rooms</Button>
                    </Grid.Row>
                    <Grid.Row style={styles.formRows}>
                      <Button onClick={this.updateRent} disabled={!this.state.okayToUpdateRent} size='small'>Change Rent</Button>
                    </Grid.Row>
                    <Grid.Row style={styles.formRows}>
                      <Button onClick={this.updatePhotos} disabled={photoToCorrect.length !== 0} size='small'>Change Picture</Button>
                    </Grid.Row>
                  </Grid.Column>
                </Grid>
              </Form>
            </Grid.Column>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

const styles = {
  headerContainer: {
    width: "100%"
  },
  formRows: {
    marginTop: "10px",
    marginBottom: "10px"
  },
  closeIcon: {
    cursor: "pointer"
  },
  controlButtons: {
    marginTop: "10px",
    marginBottom: "10px"
  }
}
