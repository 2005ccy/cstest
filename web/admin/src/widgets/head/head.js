import { Icon } from 'antd';

import './head.scss';

export default class Head extends Component {

    mobile_menu_visible = 0;

    state = {
        btnIcon: 'ellipsis'
    };

    minWindowShowMenu() {
        let _this = this;
        setTimeout(function() {
            _this.setState({
                btnIcon: 'close'
            })
        }, 430);

        let main_panel_height = $('.main-panel')[0].scrollHeight;
        let $layer = $('<div class="close-layer"></div>');
        $layer.css('height', main_panel_height + 'px');
        $layer.appendTo(".main-panel");

        setTimeout(function() {
            $layer.addClass('visible');
        }, 100);

        $layer.click(function() {
            $('#admin-box').removeClass('nav-open');
            this.mobile_menu_visible = 0;

            $layer.removeClass('visible');

            setTimeout(function() {
                $layer.remove();
                _this.setState({
                    btnIcon: 'ellipsis'
                })
            }, 400);
        });

        $('#admin-box').addClass('nav-open');
        this.mobile_menu_visible = 1;
    }

    minWindowHideMenu() {
        let _this = this;
        $('#admin-box').removeClass('nav-open');

        $('.close-layer').remove();
        setTimeout(function() {
            _this.setState({
                btnIcon: 'ellipsis'
            })
        }, 400);

        this.mobile_menu_visible = 0;
    }

    componentDidMount() {
        let _this = this;
        let $toggle = $('.navbar-toggle');

        $toggle.click(function() {

            if (_this.mobile_menu_visible == 1) {
                // 小窗口，隐藏菜单
                _this.minWindowHideMenu();
            } else {
                // 小窗口，展示菜单
                _this.minWindowShowMenu();
            }
        });
    }

    render() {
        return (
            <div id="head-head">
                <div className="navbar-header">
                    <Icon
                          type={ this.state.btnIcon }
                          className="navbar-toggle" />
                    <a
                       className="navbar-brand"
                       href="#">Dashboard</a>
                </div>
                <div className="collapse navbar-collapse">
                    <ul className="nav navbar-nav navbar-left">
                        <li>
                            <a
                               href="#"
                               className="dropdown-toggle"
                               data-toggle="dropdown"><i className="fa fa-dashboard"></i></a>
                        </li>
                        <li className="dropdown">
                            <a
                               href="#"
                               className="dropdown-toggle"
                               data-toggle="dropdown"><i className="fa fa-globe"></i> <b className="caret"></b> <span className="notification">5</span></a>
                            <ul className="dropdown-menu">
                                <li>
                                    <a href="#">Notification 1</a>
                                </li>
                                <li>
                                    <a href="#">Notification 2</a>
                                </li>
                                <li>
                                    <a href="#">Notification 3</a>
                                </li>
                                <li>
                                    <a href="#">Notification 4</a>
                                </li>
                                <li>
                                    <a href="#">Another notification</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href=""><i className="fa fa-search"></i></a>
                        </li>
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                        <li>
                            <a href="">Account</a>
                        </li>
                        <li className="dropdown">
                            <a
                               href="#"
                               className="dropdown-toggle"
                               data-toggle="dropdown">Dropdown <b className="caret"></b></a>
                            <ul className="dropdown-menu">
                                <li>
                                    <a href="#">Action</a>
                                </li>
                                <li>
                                    <a href="#">Another action</a>
                                </li>
                                <li>
                                    <a href="#">Something</a>
                                </li>
                                <li>
                                    <a href="#">Another action</a>
                                </li>
                                <li>
                                    <a href="#">Something</a>
                                </li>
                                <li className="divider"></li>
                                <li>
                                    <a href="#">Separated link</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#">Log out</a>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}