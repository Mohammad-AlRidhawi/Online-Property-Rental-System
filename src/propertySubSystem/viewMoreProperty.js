import React, { Component } from 'react';
import { Button, Card, Image, Modal, Label } from 'semantic-ui-react';
import Slider from "react-slick";
import 'semantic-ui-css/semantic.min.css';
import {Customer, db} from '../actions/accountActions';


export default class ViewMoreProperty extends Component {
  constructor(props){
    super(props);

    this.state = {
      properties: []
    }

    if(this.props.userInfo.accountType && this.props.userInfo.accountType == "Customer") {
      this.getAllPropsInViewingList()
      .then(snapshot => {
        if(snapshot.val().properties) {
          this.setState({properties: snapshot.val().properties})
        }

        else {
          this.setState({properties: []})

        }
      })
      .catch(error => {
        console.log(error);
      })
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.userInfo.accountType && this.props.userInfo.accountType == "Customer" && prevProps.userInfo.accountType != "Customer") {
      this.getAllPropsInViewingList()
      .then(snapshot => {
        if(snapshot.val().properties) {
          this.setState({properties: snapshot.val().properties})
        }

        else {
          this.setState({properties: []})

        }
      })
      .catch(error => {
        console.log(error);
      })
    }
  }

  getAllPropsInViewingList = () => {
    return Customer.child(this.props.userInfo.userId).once("value")
  }

  addToViewingList = () => {
    this.getAllPropsInViewingList()
    .then(snapshot => {
      var newViewingList = [];

      if(snapshot.val().properties) {
        newViewingList = snapshot.val().properties;
        newViewingList.push(this.props.propertyInfo.id);
      }

      else {
        newViewingList.push(this.props.propertyInfo.id);
      }

      var updates = {
        ['/Customer/' + this.props.userInfo.userId + '/' + 'properties']: newViewingList
      };
      db.update(updates)
      .then(() =>  {
        this.setState({properties: newViewingList})
      })
      .catch(error => {
        console.log(error);
      })
    })
    .catch(error => {
      console.log(error);
    })
  }

  render() {
    var settings = {
      arrows: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    var isAddToVLDisabled = false;

    for(var id = 0; id < this.state.properties.length; id++) {
      if(this.state.properties[id] == this.props.propertyInfo.id) {
        isAddToVLDisabled = true
      }
    }
    return (
      <Modal size="small" closeIcon
        open={this.props.open}
        onClose={this.props.onClose}>
        <Modal.Content>
          <Card  style={styles.cardContainer} fluid>
            <Slider {...settings}>
              {this.props.propertyInfo.photos.map(pic =>
                <Image key={pic} src={pic} />
              )}
            </Slider>
            <Card.Content>
              <Card.Header>{this.props.propertyInfo.address + ", " + this.props.propertyInfo.location}</Card.Header>
              <Card.Meta>
                <span className='price'>{"Rent: $" + this.props.propertyInfo.rent + " per month"}</span>
              </Card.Meta>
            </Card.Content>
            <Card.Content extra>
                <Label>{this.props.propertyInfo.bathrooms + " Bathrooms"}</Label>
                <Label>{this.props.propertyInfo.bedrooms + " Bedrooms"}</Label>
                <Label>{this.props.propertyInfo.otherrooms + " Otherrooms"}</Label>
            </Card.Content>
          </Card>
          {this.props.userInfo.accountType && this.props.userInfo.accountType == "Customer" &&
            <Button disabled={isAddToVLDisabled} onClick={this.addToViewingList}>Add To Viewing List</Button>
          }
        </Modal.Content>
      </Modal>
    );
  }
}

const styles = {
  cardContainer: {
    marginBottom: "20px"
  }
}
