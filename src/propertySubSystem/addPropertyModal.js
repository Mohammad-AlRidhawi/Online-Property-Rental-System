import React, { Component } from 'react';
import { Button, Form, Modal, Grid, Icon } from 'semantic-ui-react';

const options = [
  { key: 'House', text: 'House', value: 'House' },
  { key: 'Appartment', text: 'Appartment', value: 'Appartment' },
]

export default class AddPropertyModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      photoCounter: [0],
      photos: {},
      photoToCorrect: {0: ""},
      bathrooms:"",
      otherrooms:"",
      bedrooms:"",
      location:"",
      propertyType:"",
      rent: "",
      address: "",
      fieldsToCorrect: {bathrooms: true, otherrooms: true, bedrooms: true, location: true, propertyType: true, rent: true, address: true}
    };
  }

  componentDidUpdate(prevProps) {
  }

  open = () => {
    this.setState({ open: true });
  }

  close = () => {
    this.setState({ open: false });
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

  handlePropertyTypeChange = (e, { value })  => {
    var fields = this.state.fieldsToCorrect;

    if(value) {
      delete fields.propertyType;
    }

    else {
      fields.propertyType = true;
    }

    this.setState({propertyType: value, fieldsToCorrect: fields});

  }

  handleFormChange = (e, { field }) => {
    var fields = this.state.fieldsToCorrect;

    if(e.target.value.trim() !== "") {
      delete fields[field];
    }

    else {
      fields[field] = true;
    }

    this.setState({[field]: e.target.value, fieldsToCorrect: fields});
  }

  handlePictureChange = (e, key) => {
    var photoToCorrect = this.state.photoToCorrect
    var photos = this.state.photos

    if(e.target.value.trim().match(/\.(jpeg|jpg|gif|png)$/) != null ) {
      delete photoToCorrect[key];
      photos[key] = e.target.value;
    }

    else {
      photoToCorrect[key] = true;
      delete photos[key];
    }
    this.setState({photoToCorrect: photoToCorrect});
  }

  addNewProperty = () => {
    const {bathrooms, otherrooms, bedrooms, location, propertyType, rent, photos, address} = this.state;
    const propertyInfo = {bathrooms, otherrooms, bedrooms, location, propertyType, rent, address};

    var arrayPhotos = [];

    for(var key in this.state.photos) {
      arrayPhotos.push(photos[key])
    }

    propertyInfo.photos = arrayPhotos;

    this.props.addProperty(propertyInfo);
    this.setState({open: false});
  }

  render() {
    const fieldsToCorrect = Object.keys(this.state.fieldsToCorrect);
    const photoToCorrect = Object.keys(this.state.photoToCorrect);

    return (
      <Modal size="small" closeIcon
        open={this.state.open}
        onOpen={this.open}
        onClose={this.close}
        trigger={<Button>Add New Property</Button>}>
        <Modal.Header>Add a Property</Modal.Header>
        <Modal.Content>
          <Grid columns={1} centered>
            <Grid.Column width={14}>
            <Form>
              <Form.Input field="bathrooms" type="number" value={this.state.bathrooms} onChange={this.handleFormChange} placeholder='Number Of Bathrooms'/>
              <Form.Input field="bedrooms" type="number" value={this.state.bedrooms} onChange={this.handleFormChange} placeholder='Number Of Bedrooms'/>
              <Form.Input field="otherrooms" type="number" value={this.state.otherrooms} onChange={this.handleFormChange} placeholder='Number Of Other Rooms'/>
              <Form.Input field="location" value={this.state.location} onChange={this.handleFormChange} placeholder='Location'/>
              <Form.Input field="address" value={this.state.address} onChange={this.handleFormChange} placeholder='Address'/>
              <Form.Input field="rent" type="number" value={this.state.rent} onChange={this.handleFormChange} placeholder='Rent amount'/>
              {this.state.photoCounter.map((number, index) =>
                <Grid.Row key={number.toString()}>
                  <Grid columns={2}>
                    {this.state.photoCounter.length > 1 &&
                      <Grid.Column width={1}>
                          <Icon onClick={() => this.removeNewPictureLink(number, index)} style={styles.closeIcon} color='red' size='large' name="x"/>
                        </Grid.Column>
                    }
                    <Grid.Column width={14}>
                      <Form.Input inline field="photos" onChange={(e) => this.handlePictureChange(e, number)} placeholder='Picture link'/>
                    </Grid.Column>
                  </Grid>
                </Grid.Row>
              )}
              <Button size="tiny" style={styles.controlButtons} onClick={this.addNewPictureLink}>Add Another Photo</Button>
              <Form.Select field="propertyType" value={this.state.propertyType} onChange={this.handlePropertyTypeChange} fluid label='Property Type' options={options} placeholder='Property Type' />
              <Button disabled={fieldsToCorrect.length !== 0 || photoToCorrect.length !== 0} style={styles.controlButtons} onClick={this.addNewProperty} type='submit'>Add Property</Button>
            </Form>
            </Grid.Column>
          </Grid>
        </Modal.Content>
      </Modal>
    )
  }
}

const styles = {
  controlButtons: {
    marginTop: "10px",
    marginBottom: "10px"
  },
  closeIcon: {
    cursor: "pointer"
  }
};
