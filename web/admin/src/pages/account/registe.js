
import { Link } from 'react-router'
import { Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button } from 'antd';
import { CsForm, Div } from 'component';

const Option = Select.Option;

import './registe.scss';
// import district from '../../../common/data/district.js';

export default class Registe extends Component {

    formItemLayout = {
        labelCol: {
            span: 4
        },
        wrapperCol: {
            span: 19
        },
        hasFeedback: true
    };

    // 密码框失去焦点
    handlePasswordBlur(e) {
        const value = e.target.value;
        const csForm = this.refs.form;
        csForm.setState({
            passwordDirty: csForm.state.passwordDirty || !!value
        });
    }

    // 确认密码与密码比对
    checkCaptcha(rule, value, callback) {
        value = value ? value : '';
        let _this = this;
        let il = value.length;
        let cl = this.captchaLength;

        if (il < cl) {
            callback(`请继续输入${cl - il}个字符`);
        } else if (cl == il) {
            db.user.checkCaptcha({
                captcha: value
            }).ajax().then((data) => {
                if (data.ok) {
                    callback()
                } else {
                    _this.captchaBox.click();
                    callback('请输入正确的验证码');
                }
            });
        } else {
            callback(`请减少${il - cl}个字符`);
        }
    }

    inputPhone(getFieldDecorator) {
        let prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select className="icp-selector">
                <Option value="86">
                    +86
                </Option>
            </Select>
        )
        return (<Input addonBefore={ prefixSelector } />);
    }

    inputCaptcha(getFieldDecorator) {
        return (
            <Row gutter={ 8 }>
                <Col span={ 12 }>
                { getFieldDecorator('captcha', {
                      rules: [{
                          required: true,
                          message: '请输入手机验证码'
                      }]
                  })(
                      <Input size="large" />
                  ) }
                </Col>
                <Col span={ 12 }>
                <Button size="large">
                    获取验证码
                </Button>
                </Col>
            </Row>
        )
    }

    getImageCaptcha(e) {
        let _this = this;
        if (!this.captcha || !_.isString(e)) {
            db.user.captcha().ajax().then((data) => {
                let sel = $(`#${_.isString(e) ? e : e.id}`);
                sel.html('' + data);
                let cl = 0;
                sel.find('svg path').each(function() {
                    let d = $(this).attr('d');
                    if (d.length > 30) {
                        cl++;
                    }
                });
                _this.refs.form.resetFields(['captcha'])
                _this.captchaBox = sel;
                _this.captchaLength = cl;
                _this.captcha = data;
            });
        }
    }

    tailFormItemLayout = {
        wrapperCol: {
            span: 19,
            offset: 4
        }
    }

    form = {
        fields: [{
            item: _.extend({
                label: '邮箱'
            }, this.formItemLayout),
            name: 'email',
            rules: [{
                required: true,
                message: '请输入您的邮箱'
            }, {
                type: 'email',
                message: '请输入一个有效的邮箱'
            }],
            input: (<Input />)
        }, {
            item: _.extend({
                label: '密码'
            }, this.formItemLayout),
            name: 'password',
            rules: [{
                required: true,
                message: '请输入密码'
            }, _.validator.checkConfirm(this)],
            input: (<Input
                           type="password"
                           onBlur={ this.handlePasswordBlur } />)
        }, {
            item: _.extend({
                label: '确认密码'
            }, this.formItemLayout),
            name: 'confirm',
            rules: [{
                required: true,
                message: '请输入确认密码'
            }, _.validator.checkPassword(this)],
            input: (<Input type="password" />)
        }, {
            item: _.extend({
                label: (<div className="inline">
                            <span>昵称</span>
                            <Tooltip title="别人称呼您更自然">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </div>)
            }, this.formItemLayout),
            name: 'nickname',
            rules: [{
                required: true,
                message: '请输入您的昵称'
            }],
            input: (<Input />)
        }, /*{
            item: _.extend(this.formItemLayout, {
                label: '居住地'
            }),
            init: {
                initialValue: ['310000', '310100', '310104']
            },
            name: 'residence',
            rules: [{
                type: 'array'
            }],
            input: (<Cascader options={ district } />)
        },*/ {
            item: _.extend({
                label: '手机'
            }, this.formItemLayout),
            name: 'mobile',
            rules: [{
                required: true,
                message: '请输入手机号码'
            }, {
                pattern: _.validator.zhMobileRegx,
                message: '请输入正确手机号'
            }],
            input: this.inputPhone
        }, /*{
            item: _.extend(this.formItemLayout, {
                label: '验证码',
                extra: '请输入您的手机验证码，确保信息送达'
            }),
            input: this.inputCaptcha
        },*/ {
            item: _.extend({
                label: '图片验证码',
                className: 'captcha-box'
            }, this.formItemLayout),
            name: 'captcha',
            rules: [{
                required: true,
                message: '请输入验证码'
            }, {
                validator: this.checkCaptcha
            }],
            input: (<Input size="large" />),
            after: (<Div didMount={ this.getImageCaptcha }>
                        { this.captcha }
                    </Div>)
        }, {
            item: _.extend({
                className: 'agreement-box'
            }, this.tailFormItemLayout),
            init: {
                valuePropName: 'checked',
                initialValue: true,
            },
            name: 'agreement',
            rules: [_.validator.checked('请同意用户协议')],
            input: (<Checkbox>
                        I had read the <a>agreement</a>
                    </Checkbox>
            )
        }, {
            item: this.tailFormItemLayout,
            input: (<Button
                            type="primary"
                            htmlType="submit"
                            size="large">
                        注 册
                    </Button>
            )
        }],
        // formProps: {
        //     className: "basicInfoForm",
        //     horizontal: true
        // },
        submit: (values) => {
            let _this = this;
            db.user.registe(values).ajax().done((data) => {

                // 验证码错误提示
                _.showFieldError(_this.refs.form, [{
                    field: 'captcha',
                    message: data.msg,
                    cond: !data.ok,
                    value: values.captcha
                }]);

                // 进行页面跳转
                if (data.ok) {

                }
                console.info(data);
            });
        }
    }

    render() {
        let Form = CsForm.normal(this.form)
        return (
            <div>
                <Form ref="form" />
            </div>
        )
    }
}