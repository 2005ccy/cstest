import './index.scss';

export default class Account extends Component {

    componentDidMount() {
        _.lazyImg.dom(`#${this.boxId} .full-page-background`, '/images/common/24561255_1376700151028.jpg');
    }

    render() {
        let title = 'Login';
        let cls = 'col-md-4 col-sm-6 col-md-offset-4 col-sm-offset-3';
        this.boxId = 'account-login';
        if (this.props.routes[2].path !== '/a/login') {
            title = 'Registe';
            cls = 'col-md-6 col-sm-8 col-md-offset-3 col-sm-offset-2';
            this.boxId = 'account-registe';
        }

        return (<div
                     id={ this.boxId }
                     className="account-box">
                    <nav className="navbar navbar-transparent navbar-absolute">
                        <div className="container">
                            <div className="navbar-header">
                                <button
                                        type="button"
                                        className="navbar-toggle"
                                        data-toggle="collapse"
                                        data-target="#navigation-example-2">
                                    <span className="sr-only">Toggle navigation</span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>
                                <a
                                   className="navbar-brand"
                                   href="../dashboard.html">Light Bootstrap Dashboard PRO</a>
                            </div>
                            <div className="collapse navbar-collapse">
                                <ul className="nav navbar-nav navbar-right">
                                    <li>
                                        <a href="register.html">Register</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <div className="wrapper wrapper-full-page">
                        <div
                             className="full-page login-page"
                             data-color="green">
                            <div className="content">
                                <div className="container">
                                    <div className="row">
                                        <div className={ cls }>
                                            <div className="card card-hidden">
                                                <div className="header text-center">
                                                    { title }
                                                </div>
                                                <div className="content">
                                                    { this.props.children }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <footer className="footer footer-transparent">
                                <div className="container">
                                    <nav className="pull-left">
                                        <ul>
                                            <li>
                                                <a href="#">Home</a>
                                            </li>
                                            <li>
                                                <a href="#">Company</a>
                                            </li>
                                            <li>
                                                <a href="#">Portfolio</a>
                                            </li>
                                            <li>
                                                <a href="#">Blog</a>
                                            </li>
                                        </ul>
                                    </nav>
                                    <p className="copyright pull-right">
                                        © 2016 <a href="http://www.creative-tim.com">Creative Tim</a>, made with love for a better web
                                    </p>
                                </div>
                            </footer>
                            <div className="full-page-background"></div>
                        </div>
                    </div>
                </div>)
    }
}