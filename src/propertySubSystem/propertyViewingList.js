import React, { Component } from 'react';
import Slider from "react-slick";
import Property from './property';
import AddPropertyModal from './addPropertyModal';
import {Owner, fbProperty, db, Customer} from '../actions/accountActions';
const uuidv1 = require('uuid/v1');

export default class PropertyViewingList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      properties: {},
      propertiesIds: []
    }
  }

  componentDidMount() {
    if(this.props.userInfo.accountType == "Owner") {
      Owner.child(this.props.userInfo.userId).once("value")
      .then(snapshot => {
        if(snapshot.val().properties){
          this.getAllPropertiesInformation(snapshot.val().properties)
          .then(properties => {
            this.setState({properties, propertiesIds: snapshot.val().properties});
          })
        }
      })
      .catch(error => {
        console.log(error);
      })
    }

    else if(this.props.userInfo.accountType == "Customer") {
      Customer.child(this.props.userInfo.userId).once("value")
      .then(snapshot => {
        if(snapshot.val().properties){
          this.getAllPropertiesInformation(snapshot.val().properties)
          .then(properties => {
            this.setState({properties, propertiesIds: snapshot.val().properties});
          })
        }
      })
      .catch(error => {
        console.log(error);
      })
    }
  }

  addProperty = (propertyInformation) => {
    const {bathrooms, otherrooms, bedrooms, location, propertyType, rent, photos, address} = propertyInformation;
    const uid = uuidv1();
    const propertiesInState = this.state.properties;
    propertiesInState[uid] = {bathrooms, otherrooms, bedrooms, location, propertyType, rent, photos, address, id: uid, owner: this.props.userInfo.userId};
    fbProperty.child(uid).set({
      bathrooms,
      otherrooms,
      bedrooms,
      location,
      propertyType,
      rent,
      photos,
      address,
      id: uid,
      owner: this.props.userInfo.userId
    })
    .then(() => {
      var pIds = this.state.propertiesIds;
      pIds.push(uid);
      var updates = {
        ['/Owner/' + this.props.userInfo.userId + '/' + 'properties']: pIds
      };
      db.update(updates)
      .then(() =>  {
        this.setState({propertiesIds: pIds, properties: propertiesInState});
        this.props.updateProperties();
      })
      .catch(error => {
        console.log(error);
      })
    })
    .catch(error => {
      console.log(error);
    });
  }

  getAllPropertiesInformation = (propertiesArray) => {
    var properties = {}
    return new Promise((resolveGlobal, rejectGlobal) => {
      for (var propertyIndex = 0, p = Promise.resolve(propertyIndex); propertyIndex < propertiesArray.length; propertyIndex++) {
        p = p.then((propertyIndex) => new Promise((resolve, reject) => {
          console.log(propertiesArray);
          fbProperty.child(propertiesArray[propertyIndex]).once("value")
          .then(snapshot => {
            properties[snapshot.val()['id']] = snapshot.val();
            resolve(++propertyIndex);
            return;
          })
          .catch(error => {
            console.log(error);
            rejectGlobal(error);
            return;
          })
        }));

        if(propertyIndex === propertiesArray.length-1) {
          p.then(() => {
            resolveGlobal(properties);
            return;
          })
          .catch(error => {
            console.log(error);
            rejectGlobal(error);
            return;
          })
        }
      }
    });
  }

  updateProperty = (key, value, id) => {
    var updates = {
      ['/Property/' + id + '/' + key]: value
    };
    db.update(updates)
    .then(() =>  {
      this.getAllPropertiesInformation(this.state.propertiesIds)
      .then(properties => {
        this.setState({properties});
        this.props.updateProperties();
      })
      .catch(error => {
        console.log(error)
      })
    })
    .catch(error => {
      console.log(error);
    })
  }

  onDeleteProperty = (id) => {
    var newPropertyIds = [];
    for(var i=0; i < this.state.propertiesIds.length; i++) {
      if(this.state.propertiesIds[i] !== id) {
        newPropertyIds.push(this.state.propertiesIds[i]);
      }
    }
    fbProperty.child(id).remove()
    .then(() => {
        var updates = {
          ['/Owner/' + this.props.userInfo.userId + '/' + 'properties']: newPropertyIds
        };
        db.update(updates)
        .then(() =>  {
          this.getAllPropertiesInformation(newPropertyIds)
          .then(properties => {
            this.setState({propertiesIds: newPropertyIds, properties: properties});
            this.props.updateProperties();
            this.props.deletePropertyFromViewingList(id);
          })
          .catch(error => {
            console.log(error);
          })
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

    return (
      <div>
        <Slider {...settings}>
          {this.state.propertiesIds.map(id =>
            <div key={id}>
              {this.props.userInfo.accountType === "Owner" &&
                <Property userInfo={this.props.userInfo} onDelete={this.onDeleteProperty} onUpdateProperty={this.updateProperty} border={false} propertyInfo={this.state.properties[id]}/>
              }
              {this.props.userInfo.accountType === "Customer" &&
                <Property userInfo={this.props.userInfo} propertyInfo={this.state.properties[id]}/>
              }
            </div>
          )}
        </Slider>

        {this.props.userInfo.accountType === "Owner" &&
          <AddPropertyModal addProperty={this.addProperty}/>
        }
      </div>
    )
  }
}
