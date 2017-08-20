
import { Link } from 'react-router'
import { Icon, Input, Button, Checkbox } from 'antd';
import { CsForm } from 'component';

import './login.scss'

export default class Login extends Component {

    form = {
        fields: [{
            name: 'username',
            rules: [{
                required: true,
                message: '请输入用户名称'
            }],
            input: (<Input
                           addonBefore={ <Icon type="user" /> }
                           placeholder="请输入用户名称" />)
        }, {
            name: 'password',
            rules: [{
                required: true,
                message: '请输入密码'
            }],
            input: (<Input
                           addonBefore={ <Icon type="lock" /> }
                           type="password"
                           placeholder="Password" />)
        }, {
            init: {
                valuePropName: 'checked',
                initialValue: true
            },
            name: 'remember',
            input: (<Checkbox>
                        2周不再登录
                    </Checkbox>),
            after: (<span><a className="login-form-forgot">忘记密码</a> <div className="text-center"> <Button
                                                                                                          type="primary"
                                                                                                          htmlType="submit"
                                                                                                          className="login-form-button"> 登 录 </Button> </div></span>
            )
        }],
        // formProps: {
        //     className: "basicInfoForm",
        //     horizontal: true
        // },
        submit: this.login
    }

    login(values) {
        db.user.login(values).ajax().then((data) => {
            this.go('/#/b/server/list');
        });
    }

    render() {
        let Form = CsForm.normal(this.form)
        return (
            <div>
                <Form />
            </div>
        )
    }
}