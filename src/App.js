import React, { Component, Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import Admin from './containers/admin'
import Login from './containers/login'

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <Switch>
          <Route path='/login' component={Login}/>
          <Route path='/admin' component={Admin}/>
        </Switch>
      </Fragment>
    )
  }
}