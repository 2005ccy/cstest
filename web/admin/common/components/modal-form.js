import { Modal } from 'antd';
import CsForm from './form';

export default class ModalForm extends Component {

    handleOk() {
        let _this = this;
        this.refs.form.validateFields((err, values) => {
            if (!err) {
                if (_this.props.onOk) {
                    window.ajaxModal = _this;
                    _this.props.onOk(values);
                }
            }
        });
    }

    handleCancel(e) {
        this.refs.form.resetFields();
        this.props.onCancel && this.props.onCancel();
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.ok) {
            this.refs.form.resetFields();
        }
    }

    formDom = null;

    render() {
        let FormDom;
        if (this.props.visible && !this.formDom) {
            this.formDom = CsForm.normal(this.props.form)
        }
        return ( <Modal
                        {...this.props}
                        title={ this.props.title }
                        visible={ this.props.visible }
                        onOk={ this.handleOk }
                        onCancel={ this.handleCancel }
                        confirmLoading={ this.state.confirmLoading }
                        maskClosable={ false }>
                     <div className="">
                         { this.formDom ? (<this.formDom ref="form" />) : (<div></div>) }
                     </div>
                 </Modal>
        )
    }
}
