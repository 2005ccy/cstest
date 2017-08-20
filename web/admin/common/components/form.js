import { Form } from 'antd';
const FormItem = Form.Item;

const CsForm = () => {

    // 构建表单组件 param {fields, submit, formProps}
    const build = (param) => {
        if (!param) {
            param = {};
        }
        class TempForm extends Component {
            handleSubmit(e) {
                e.preventDefault();
                this.props.form.validateFields((err, values) => {
                    if (!err) {
                        _.call(param.submit, values);
                    }
                });
            }

            componentDidMount() {
                // 设置表单组件缓存
                param.id && _.setComponent(param.id, this.props.form);
                // 表单已加载到页面，回调配置函数
                _.call(param.componentDidMount, this.id);
            }

            componentWillUnmount() {
                param.id && _.removeComponent(param.id);
            }

            render() {
                const {getFieldDecorator} = this.props.form;
                const formItems = param.fields.map((field, index) => {
                    return field.name ? (
                        <FormItem
                                  key={ field.name }
                                  {...field.item}>
                            { typeof field.before == 'function' ? field.before() : field.before }
                            { getFieldDecorator(field.name, _.filterObj({
                                  rules: field.rules,
                                  valuePropName: field.propName,
                                  initialValue: typeof field.value == 'function' ? field.value() : field.value
                              }))(
                                  typeof field.input == 'function' ? field.input(getFieldDecorator) : field.input
                              ) }
                            { typeof field.after == 'function' ? field.after(getFieldDecorator) : field.after }
                        </FormItem>
                        ) : field.input ? (
                            <FormItem
                                      key={ _.uuid() }
                                      {...field.item}>
                                { typeof field.input == 'function' ? field.input() : field.input }
                            </FormItem>
                            ) : (<div key={ _.uuid() }>
                                     { typeof field.dom == 'function' ? field.dom() : field.dom }
                                 </div>);
                });

                return (
                    <Form
                          onSubmit={ this.handleSubmit }
                          {...param.formProps}>
                        { formItems }
                    </Form>
                    );
            }
        }
        return TempForm
    }

    const normal = (param) => {
        return Form.create()(build(param));
    };

    return {
        normal
    };
};

module.exports = CsForm();