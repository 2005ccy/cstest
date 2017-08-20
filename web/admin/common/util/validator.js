
// 扩展 _ 方法
Object.assign(_, {
    // 相关验证规则
    validator: {
        // 邮箱正则
        emailRegx: /(?!.*\.co$)^[a-zA-Z0-9._%\-]+@([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,4}$/,
        // 中国手机正则
        zhMobileRegx: /^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/,
        // 日本手机正则
        jaMobileRegx: /^0(7|8|9)0([0-9]{8})$/,
        // 用户名正则
        loginName: /(?!.*\.git$)^[a-zA-Z]([a-zA-Z0-9._-]){7,29}$/,
        // 密码正则
        // passwordRegx: /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{8,20}$/,
        passwordRegx: /^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{8,20}$/,
        //检查长度
        checkLength: (max, msg) => {
            return [{
                validator: (rule, value, callback) => {
                    if (value && value.replace(/[^\x00-\xff]/g, "aa").length > max) {
                        callback(msg)
                    } else {
                        callback();
                    }
                }
            }]
        },
        // 登录名称验证
        checkLoginName: () => {
            return [{
                validator: (rule, value, callback) => {
                    if (_.validator.zhMobileRegx.test(value)
                        || _.validator.jaMobileRegx.test(value)
                        || _.validator.emailRegx.test(value)
                        || _.validator.loginName.test(value)) {
                        callback();
                    }
                    callback('用户名格式错误');
                }
            }]
        },
        // 检查用户名是否存在
        checkLoginNameExists: () => {
            return [{
                validator: _.debounce((rule, value, callback) => {
                    let msg;
                    let cb = (msg) => {
                        callback(msg);
                        if (!msg) {
                            !_.validator.emailRegx.test(value) && db.user.call('pages.forgetPassword.loginName.isMobile', value);
                        }
                    }
                    if (value) {
                        if (_.validator.zhMobileRegx.test(value)
                            || _.validator.jaMobileRegx.test(value)
                            || _.validator.emailRegx.test(value)) {
                            _.validator.checkUser(value, cb, true);
                        } else if (_.validator.loginName.test(value)) {
                            _.validator.checkApiLoginName(value, callback, true);
                        } else {
                            msg = '用户名格式错误';
                        }
                    }
                    if (!value || msg) {
                        callback(msg || '请输入邮件地址/手机/用户名');
                        db.user.call('pages.forgetPassword.loginName.error', value);
                    }
                }, 500)
            }]
        },
        // 检查用户是否存在
        checkUser: (value, callback, reversal) => {
            // 检查用户是否存在
            db.user.checkSignup({
                name: value
            }).noGet().ajax().done((data) => {
                reversal ? callback('用户不存在') : callback();
            }).fail(reversal ? () => {
                callback()
            } : _.validError(callback));
        },
        // 校验登录名是否已经注册
        checkApiLoginName: (value, callback, reversal) => {
            // 检查登录名是否存在
            db.user.checkLoginName({
                name: value
            }).noGet().ajax().done((data) => {
                reversal ? callback('用户不存在') : callback();
            }).fail(reversal ? () => {
                callback()
            } : _.validError(callback));
        },
        // 注册手机
        registeMobile: () => {
            return [{
                validator: (rule, value, callback) => {
                    let msg = !value ? _.i18n.message('手机号不能为空') : null;
                    let zone = _.validator.registeMobileZone || '+86';
                    if (zone === '+86') {
                        // 中文手机格式验证
                        if (!_.validator.zhMobileRegx.test(value)) {
                            msg = _.i18n.message('请输入有效的手机号码')
                        }
                    } else {
                        // 日文手机格式验证
                        if (!_.validator.jaMobileRegx.test(value)) {
                            msg = _.i18n.message('请输入有效的手机号码')
                        }
                    }
                    // 手机为空或正则错误
                    if (msg) {
                        callback(msg);
                        db.user.call('registe.mobile.hide.mobile.validator', value);
                        return;
                    }
                    // 验证用户唯一性
                    _.validator.checkUser(value, (msg) => {
                        callback(msg);
                        if (!msg) {
                            db.user.call('registe.mobile.regex.valid.success', value);
                        }
                    });
                }
            }];
        },
        // 注册邮箱
        registeEmail: () => {
            return [{
                validator: (rule, value, callback) => {
                    let msg = !value ? _.i18n.message('邮箱不能为空') : !_.validator.emailRegx.test(value) ? _.i18n.message('请输入有效的邮箱地址') : null;
                    if (msg) {
                        callback(msg);
                        return;
                    }
                    // 验证用户唯一性
                    _.validator.checkUser(value, callback);
                }
            }];
        },
        // 完善信息登录名
        completeLoginName: () => {
            return [{
                validator: _.debounce((rule, value, callback) => {
                    let msg = !value ? "用户名不能为空" : !_.validator.loginName.test(value) ? "用户名格式不正确" : null;
                    if (msg) {
                        callback(msg);
                        return;
                    }
                    // 验证用户唯一性
                    _.validator.checkApiLoginName(value, callback);
                }, 500)
            }];
        },
        // 完善信息姓名
        completeRealName: () => {
            return [{
                validator: (rule, value, callback) => {
                    let msg = !value ? "姓名不能为空" : !(value.replace(/[^\x00-\xff]/g, "aa").length <= 40) ? "长度不能超过40" : null;
                    if (msg) {
                        callback(msg);
                        return;
                    }
                    callback();
                }
            }];
        },
        // 邮箱规则
        email: () => {
            return [{
                required: true,
                message: _.i18n.message('邮箱不能为空')
            }, {
                type: 'email',
                message: _.i18n.message('请输入有效的邮箱地址')
            }];
        },
        // 密码规则
        password: () => {
            return [{
                required: true,
                message: _.i18n.message('密码不能为空')
            }, {
                pattern: _.validator.passwordRegx,
                message: _.i18n.message('密码需包含字母和数字,长度为8-20个字符')
            }];
        },
        // 项目名称规则
        projectName: () => {
            return [{
                type: 'string',
                max: 40,
                message: _.i18n.message('最大长度为40字符'),
            }, {
                required: true,
                message: _.i18n.message('请输入项目名称'),
            }];
        },
        // 项目简介规则
        projectDesc: () => {
            return [{
                type: 'string',
                max: 1000,
                message: _.i18n.message('最大长度为1000字符')
            }];
        },
        // 复选框规则
        checkbox: (msg) => {
            return [{
                validator: (rule, value, callback) => {
                    if (value) {
                        callback();
                    } else {
                        callback(msg);
                    }
                }
            }]
        },
        // 选中验证器
        checked: (message) => {
            return {
                validator: (rule, value, callback) => {
                    if (value) {
                        callback();
                    } else {
                        callback(message);
                    }
                }
            }
        },
        // 检查重复密码
        checkConfirm: (_this) => {
            return {
                validator: (rule, value, callback) => {
                    let form = _this.refs.form;
                    if (value && form.state.passwordDirty) {
                        form.validateFields(['confirm'], {
                            force: true
                        });
                    }
                    callback();
                }
            }
        },
        // 比对密码是否相同
        checkPassword: (_this) => {
            return {
                validator: (rule, value, callback) => {
                    if (value && value !== _this.refs.form.getFieldValue('password')) {
                        callback('两次密码不一致')
                    } else {
                        callback();
                    }
                }
            }
        }
    },
    // 展示表单错误信息
    showFieldError: (form, rules) => {
        let hasError = false;
        for (let i in rules) {
            let r = rules[i];
            if (r.cond) {
                form.setFields({
                    [r.field]: {
                        value: r.value,
                        errors: [{
                            message: r.message
                        }]
                    }
                });
                hasError = true;
            }
        }
        return hasError;
    },
    // 输入表单控件值
    setFieldValue: (form, field, value) => {
        form && form.setFields({
            [field]: {
                value: value
            }
        });
    },
    // 清空表单
    resetFields: (id) => {
        // 获取缓存表单
        let form = _.getForm(id);
        // 执行表单清空
        form && form.resetFields();
    }

});