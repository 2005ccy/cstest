import { Link } from 'react-router';
import { Menu, Icon } from 'antd';

const SubMenu = Menu.SubMenu;
import './left-menu.scss';

import { adminMenu } from '../../config/client-config.js';

export default class LeftMenu extends Component {

    render() {
        let menuDom = adminMenu.map((m, mi) => {
            return (
                <SubMenu
                         key={ `admin-menu-${mi}` }
                         title={ <span><Icon type={ m.icon } /><span>{ m.name }</span></span> }>
                    { m.child.map((sm, smi) => {
                          return (
                              <Menu.Item key={ `admin-menu-${mi}-sub-${smi}` }>
                                  <Link to={ sm.link }>
                                  { sm.name }
                                  </Link>
                              </Menu.Item>
                          )
                      }) }
                </SubMenu>
            )
        });

        return (
            <div id="menu-left-menu">
                <Menu
                      defaultOpenKeys={ ['admin-menu-0'] }
                      mode="inline">
                    { menuDom }
                </Menu>
            </div>
        )
    }
}