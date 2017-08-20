// 加载工具方法
import 'common/util/index';
// 加载全局组件
import 'common/components/component';
// 加载集合操作类
import 'common/persiste';
// 加载全局api
import 'common/api/index';

import './app.scss';

export default class App extends Component {

    componentDidMount() {}

    render() {
        return (
            <div>
                { this.props.children }
            </div>
        )
    }

}
