export default {
    component: require('../router/App').default,
    childRoutes: [{
        path: '/logout',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../router/Logout').default)
            })
        }
    }, {
        path: '/about',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../router/About').default)
            })
        }
    }, {
        path: '/landing',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../router/Landing').default)
            })
        }
    }, {
        path: '/buttonPage',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../pages/buttonPage').default)
            })
        }
    }, {
        path: '/',
        indexRoute: {
            getComponent: (nextState, cb) => {
                return require.ensure([], (require) => {
                    cb(null, require('../router/Home').default)
                })
            }
        }
    }]
}
