import Div from './div.js';

export default class Html extends Component {

    // 初始化状态值
    state = {
        html: '<div></div>'
    }

    getPage(nextProps) {
        let url = (nextProps && nextProps.url) || this.props.url;
        // 验证url属性
        if (!_.isString(url)) {
            console.error(`<Html url={${this.props.url}} url: 无效`);
            return;
        }
        if (url.length < 1) {
            return;
        }
        // this 别名
        let _this = this;
        // 通过ajax，获取url 指定页面
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'html',
        }).done((data) => {
            // 设置html 状态值
            _this.setState({
                html: data
            })
        }).fail((err) => {
            // 加载失败，提示错误信息
            // console.error(`<Html url={${this.props.url}} url: 无效`);
        });
    }

    // 组件将要加载
    componentWillMount() {
        this.getPage();
    }

    componentWillUpdate(nextProps, nextState) {
        this.getPage(nextProps);
    }

    // 渲染组件效果
    render() {
        // 输出url指向的 html
        return (<Div>
                    { this.state.html }
                </Div>);
    }
}
