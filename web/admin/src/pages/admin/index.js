import { Icon } from 'antd';

import './index.scss';

import LeftMenu from 'widgets/menu/left-menu.js';
import Head from 'widgets/head/head.js';
import Foot from 'widgets/foot/foot.js';

export default class Admin extends Component {

    componentDidMount() {
        _.lazyImg.dom(`#admin-box .sidebar-background`, '/images/common/24561255_1376700151028.jpg');
    }

    render() {
        return (
            <div
                 className="wrapper"
                 id="admin-box">
                <div
                     className="sidebar"
                     data-color="green">
                    <div className="sidebar-wrapper">
                        <div className="logo">
                            <a
                               href="http://www.creative-tim.com"
                               className="simple-text">Creative Tim</a>
                        </div>
                        <LeftMenu />
                    </div>
                    <div className="sidebar-background"></div>
                </div>
                <div className="main-panel">
                    <nav className="navbar navbar-default navbar-fixed">
                        <div className="container-fluid">
                            <Head />
                        </div>
                    </nav>
                    <div className="content">
                        <div className="container-fluid">
                            { this.props.children }
                        </div>
                    </div>
                    <footer className="footer">
                        <div className="container-fluid">
                            <Foot />
                        </div>
                    </footer>
                </div>
            </div>
        )
    }
}