import { Button } from 'antd';

export default class CsButton extends Component {

    state = {
        loading: false
    }

    clickHandler(e) {
        window.ajaxButton = this;
        this.props.onClick && this.props.onClick(e);
    }

    render() {
        let {children, onClick, ...other} = this.props;
        return (<Button
                        {...other}
                        onClick={ this.clickHandler }
                        loading={ this.state.loading }>
                    { children }
                </Button>)
    }
}