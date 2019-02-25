import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Provider } from 'react-redux';
import Propertyzoom from './propertyzoom';
import store from './store';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Propertyzoom/>
      </Provider>
    );
  }
}

export default App;
