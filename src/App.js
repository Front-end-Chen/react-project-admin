import React, { Component, Fragment } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Admin from './containers/Admin'
import Login from './containers/Login'
import './App.css'

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <Switch>
          <Route path='/login' component={Login}/>
          <Route path='/admin' component={Admin}/>
          {/* 默认跳转admin */}
          <Redirect to='/admin/home'/>
        </Switch>
      </Fragment>
    )
  }
}