import React, { Component } from 'react';
import { Button, Card, Icon, Image } from 'semantic-ui-react'
import EditProperty from './editProperty';
import 'semantic-ui-css/semantic.min.css';
import ViewMoreProperty from './viewMoreProperty'

export default class Property extends Component {
  constructor(props){
    super(props);

    this.state = {
      border: !this.props.border ? "none" : "",
      editPropertyClicked: false,
      viewMoreClicked: false
    }
  }

  onDelete = (id) => {
    this.props.onDelete(id)
    this.setState({editPropertyClicked: false})
  }

  render() {
    return (
      <Card  style={{boxShadow: this.state.border, ...styles.cardContainer}} fluid>
        <Image src={this.props.propertyInfo.photos[0]} />
        <Card.Content>
          <Card.Header>{this.props.propertyInfo.address + ",  " + this.props.propertyInfo.location}</Card.Header>
          <Card.Meta>
            <span className='price'>{"$" + this.props.propertyInfo.rent}</span>
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <a>
            <Icon name='home' />
            {parseInt(this.props.propertyInfo.bathrooms) + parseInt(this.props.propertyInfo.bedrooms) + parseInt(this.props.propertyInfo.otherrooms) + " Rooms"}
          </a>
          {this.props.userInfo.accountType === "Owner" && this.props.userInfo.userId == this.props.propertyInfo.owner &&
            <Button onClick={() => this.setState({editPropertyClicked: true})} size="tiny" floated='right'>Edit</Button>
          }
          <Button onClick={() => this.setState({viewMoreClicked: true})} size="tiny" floated='right'>View more</Button>
          <ViewMoreProperty userInfo={this.props.userInfo} onClose={() => this.setState({viewMoreClicked: false})} propertyInfo={this.props.propertyInfo} open={this.state.viewMoreClicked}/>
          {this.props.userInfo.accountType === "Owner" &&
            <EditProperty
              onDelete={this.onDelete}
              onUpdate={this.props.onUpdateProperty}
              propertyInfo={this.props.propertyInfo}
              onClose={() => this.setState({editPropertyClicked: false})}
              open={this.state.editPropertyClicked}/>
          }
        </Card.Content>
      </Card>
    );
  }
}

const styles = {
  cardContainer: {
    marginBottom: "20px"
  }
}
