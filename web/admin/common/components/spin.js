import { Spin } from 'antd';

export default class CsSpin extends Component {

    state = {
        loading: true
    }

    componentWillMount() {
        _.setComponent(this.id, this);
        _.spin.addSpin(this.id);
    }

    componentWillUnmount() {
        _.removeComponent(this.id);
        _.spin.unMountSpin(this.id);
    }

    render() {
        let {loading, ...other} = this.props;

        return (<div
                     id={ this.id }
                     {...other}>
                    <Spin spinning={ this.props.loading || this.state.loading }>
                        { this.props.children }
                    </Spin>
                </div>)
    }
}
