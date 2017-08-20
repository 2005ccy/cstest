
import { Icon, Button, message, Input, Radio, Badge, Popconfirm, Table } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import { ModalForm, CsButton } from 'component';
import './client-list.scss';

export default class ClientList extends Component {

    // 新增服务器，弹窗--表单样式
    formItemLayout = {
        labelCol: {
            span: 5
        },
        wrapperCol: {
            span: 18
        },
        hasFeedback: true
    }

    // 新增服务，表单设置
    form = {
        fields: [{
            item: _.extend({
                label: '服务器名称'
            }, this.formItemLayout),
            name: 'name',
            rules: [{
                required: true,
                message: '请输入服务器名称'
            }],
            input: (<Input placeholder="请输入服务器名称" />)
        }, {
            item: _.extend({
                label: '访问URL'
            }, this.formItemLayout),
            name: 'url',
            rules: [{
                required: true,
                message: '请输入访问URL'
            }],
            input: (<Input placeholder="请输入访问URL" />)
        }, {
            item: _.extend({
                label: '转发匹配规则'
            }, this.formItemLayout),
            name: 'rule',
            rules: [{
                required: true,
                message: '请输入转发规则'
            }],
            input: (<Input placeholder="请输入转发规则" />)
        }, {
            item: _.extend({
                label: '服务器状态'
            }, this.formItemLayout),
            name: 'status',
            init: {
                initialValue: 'normal'
            },
            input: (
            <RadioGroup>
                <RadioButton value="normal">
                    正常
                </RadioButton>
                <RadioButton value="break">
                    中断
                </RadioButton>
                <RadioButton value="upgrade">
                    升级
                </RadioButton>
            </RadioGroup>
            )
        }]
    }

    // 组件状态数据
    state = {
        data: [],
        showModal: false,
        form: this.form,
        oper: 'insert',
        pagination: {
            current: 1,
            pageSize: 2,
            total: 20
        }

    }

    // 列表服务器，状态控件展示
    statusBadge = {
        normal: <Badge
                       status="success"
                       text="正常" />,
        break: <Badge
                      status="error"
                      text="中断" />,
        upgrade: <Badge
                        status="processing"
                        text="版本升级" />,
    }

    // 表格列数据声明
    columns =[{
        title: '服务器名称',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        width: '20%'
    }, {
        title: '访问URL',
        dataIndex: 'url',
        key: 'url',
        sorter: true,
        render: (text, record) => {
            return (<a
                       key={ `url-${record._id}` }
                       href={ text }>
                        { text }
                    </a>)
        },
        width: '20%'
    }, {
        title: '转发规则',
        dataIndex: 'rule',
        key: 'rule'
    }, {
        title: '服务器状态',
        dataIndex: 'status',
        key: 'status',
        filters: [{
            text: '正常',
            value: 'normal'
        }, {
            text: '中断',
            value: 'break'
        }, {
            text: '版本升级',
            value: 'upgrade'
        }],
        render: (text, record) => {
            return (<div key={ `status-${record._id}` }>
                        { this.statusBadge[text] }
                    </div>);
        }
    }, {
        title: '操作',
        key: 'action',
        render: (text, record) => {
            return (<div key={ `action-${record._id}` }>
                        <Popconfirm
                                    title="确定删除当前数据吗？"
                                    okText="是"
                                    cancelText="否"
                                    onConfirm={ this.deleteServer.bind(this, record) }>
                            <a
                               href="javascript:void(0)"
                               id={ record._id }>删除</a>
                        </Popconfirm>
                        <span className="ant-divider" />
                        <a
                           href="javascript:void(0)"
                           onClick={ this.showUpdateModal.bind(this, record) }
                           id={ record._id }>更新</a>
                    </div>)
        }
    }];

    // 删除服务
    deleteServer(server) {
        db.server.delete(server).ajax();
    }

    showUpdateModal(item) {
        this.item = item;
        let newForm = this.formInitValue(this.form, item);
        this.setState({
            showModal: true,
            oper: 'update',
            form: newForm
        })
    }

    // 展示服务器列表
    showServerList(data) {
        var data = data && data.data;
        this.setState(_.extend({
            items: data.items
        },
            data.count > 0 && {
                pagination: {
                    total: data.count
                }
            }
        ));
    }

    // 表格数据，分页、过滤、排序，相关操作
    findServerList(pagination, filters, sorter) {
        return db.server.tableList(pagination, filters, sorter)
            .ajax()
            .done(this.showServerList);
    }

    // 刷新列表
    refreshList() {
        this.findServerList().then(() => {
            message.success('数据刷新成功');
        })
    }

    // 增加服务器，弹窗
    showInsertModal() {
        this.setState({
            showModal: true
        })
    }

    // 取消弹窗操作
    cancelModal() {
        this.setState({
            showModal: false,
            oper: 'insert',
            form: this.form
        })
    }

    // 确定新增服务器
    okModal(values) {
        // 新增数据操作
        if (this.state.oper === 'insert') {
            // 向缓存对象插入数据
            db.server.add(values).ajax().then((item) => {
                this.cancelModal();
            });
        // 更新数据操作
        } else if (this.state.oper === 'update') {
            // 向缓存对象更新数据
            this.item.update(values).ajax().then(() => {
                this.cancelModal();
            });
        }
    }

    // 组件加载完成
    componentDidMount() {
        this.findServerList();
    }

    // 渲染页面
    render() {
        return (
            <div id="table-client-list">
                <div className="button-box">
                    <CsButton
                              type="ghost"
                              icon="reload"
                              onClick={ this.refreshList }>
                        刷新
                    </CsButton>
                    <Button
                            type="ghost"
                            icon="plus"
                            onClick={ this.showInsertModal }>
                        新增
                    </Button>
                </div>
                <Table
                       pagination={ this.state.pagination }
                       columns={ this.columns }
                       rowKey={ record => record._id }
                       dataSource={ this.state.items }
                       onChange={ this.findServerList } />
                <ModalForm
                           title="新增集群服务器"
                           visible={ this.state.showModal }
                           form={ this.state.form }
                           onCancel={ this.cancelModal }
                           onOk={ this.okModal } />
            </div>
            );
    }
}