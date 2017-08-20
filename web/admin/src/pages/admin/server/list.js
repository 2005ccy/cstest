import './list.scss';

import ClientList from 'widgets/table/client-list';

export default class ServerList extends Component {

    render() {
        return (<div className="col-md-12">
                    <div className="card">
                        <div className="header">
                            <h4 className="title">集群服务器列表</h4>
                            <p className="category">
                                支持各种服务，服务器列表；如：文件上传、数据访问
                            </p>
                        </div>
                        <div className="content">
                            <ClientList />
                        </div>
                    </div>
                </div>)
    }
}