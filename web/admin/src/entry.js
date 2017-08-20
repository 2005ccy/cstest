import React from 'react'
import ReactDOM from "react-dom";
import { Router, Link, hashHistory, Route, IndexRoute, IndexRedirect } from 'react-router'
import App from 'pages/app'
import Account from 'pages/account';
import Login from 'pages/account/login';
import Registe from 'pages/account/registe';
import Admin from 'pages/admin';

import { adminMenu } from './config/client-config.js';

const e = document.createElement('div');
e.id = 'app';
document.body.appendChild(e);

let menuRoute = adminMenu.map((m, mi) => {
    return m.child.map((sm, smi) => {
        return (
            <Route
                   path={ sm.link }
                   component={ sm.component } />
        )
    })
})


ReactDOM.render((
    <Router history={ hashHistory }>
        <Route
               path="/"
               component={ App }>
            <IndexRedirect to="/b" />
            <Route
                   path='/a'
                   component={ Account }>
                <IndexRedirect to="/a/login" />
                <Route
                       path='/a/login'
                       component={ Login } />
                <Route
                       path='/a/registe'
                       component={ Registe } />
            </Route>
            <Route
                   path="/b"
                   component={ Admin }>
                { menuRoute }
            </Route>
        </Route>
    </Router>
    ), e);
