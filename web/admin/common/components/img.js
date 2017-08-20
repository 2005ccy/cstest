
export default class Img extends Component {

    // 默认图片
    def = _.lazyImg.default;

    // 对象状态信息
    state = {
        status: 'default'
    }

    // 组件将要挂载
    componentWillMount() {
        // 加载懒加载
        _.lazyImg.add(this);
    }

    // 组件将要卸载
    componentWillUnmount() {
        this.isUnMount = true;
        _.lazyImg.remove(this.id);
    }

    // 图片url变更
    componentWillUpdate(nextProps, nextState) {
        if (this.props.src !== nextProps.src) {
            // 加载懒加载
            _.lazyImg.add(this);
        }
    }

    // 渲染组件
    render() {
        // 读取相关属性
        let {children, src, box, ...other} = this.props;
        // 根据状态，设置默认或真实图片url
        let url = this.state.status == 'default' ? this.def : this.props.src;
        // 如果状态存在base64，则加载base64内容
        if (this.state.base64) {
            url = this.state.base64;
        }
        // 构建img标签
        let img = <img
                       id={ this.id }
                       key={ this.id }
                       src={ url }
                       {...other}/>;
        // 如果存在子标签，则为设置背景图片
        if (children) {
            img = <div
                       id={ this.id }
                       key={ this.id }
                       style={ { backgroundImage: `url(${url})` } }
                       {...other}>
                      { children }
                  </div>
        }
        // 渲染图片组件
        return img;
    }
}