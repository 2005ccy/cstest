import { Upload, Button, Icon, Spin, message } from 'antd';
import './Upload.css';

message.config({
    top: 100,
    duration: 5,
});

export default class FileUpload extends Component {

    state = {
        disabled: true,
        listType: 'picture',
        fileList: []
    }

    // 构建百度bos 上传组件
    bosUpload() {
        // 构建input file id
        let fid = this.id + '-file';
        // 查询 file 容器
        let box = this.jquery('.ant-upload-select-picture');
        // 设置属性
        box.css({
            overflow: 'hidden',
            position: 'relative'
        });
        // 删除 antd-uploader 中的 file
        this.jquery('[type="file"]').remove();
        // 将新的file，加入容器
        box.append('<input type="file" id="' + fid + '"/>')
        // 设置新file的样式
        $('#' + fid).css({
            display: 'block',
            position: 'absolute',
            filter: 'alpha(opacity=0)',
            '-moz-opacity': 0,
            opacity: 0,
            left: '-100px',
            top: '0px',
            'z-index': 999,
            cursor: 'pointer',
            height: '28px',
            width: '200px'
        });

        // 别名this
        let _this = this;
        // 上传成功，计算图片url
        function toUrl(object) {
            var url = 'http://vege-temp.bj.bcebos.com/' + encodeURIComponent(object).replace(/%2F/gi, '/');
            return url;
        }
        // 上传图片百分比
        let percent = 0;
        // 上传超时对象
        let uploadTimeout;
        // 构建百度bos 上传对象
        this.uploader = new baidubce.bos.Uploader({
            browse_button: '#' + fid, // 设置 file id
            multi_selection: true, // 运行多文件上传
            bos_bucket: 'vege-temp', // bos 上传bucket 名称
            bos_endpoint: 'http://bj.bcebos.com', // bos 服务器url
            uptoken_url: '/bos/writeSTS', // 获取上传session Token 服务接口 
            get_new_uptoken: false, // 是否重新请求 session Token
            max_file_size: '10Mb', // 单个文件，最大尺寸
            bos_multipart_min_size: '10Mb', // 超过这个文件大小之后，开始使用分片上传，默认(10M)
            bos_task_parallel: 3, // 队列中的文件，并行上传的个数，默认(3)
            auto_start: true, // 是否自动上传，默认(false)
            init: {
                // 文件上传，支持更复杂的验证规则
                FilesFilter: function(_, files) {
                    // 添加更多的过滤规则，比如文件大小之类的
                },
                // 文件开始添加
                FilesAdded: function(_, files) {
                    // 上传进度为0
                    percent = 0;
                    // 当前上传的文件数组
                    let fs = [];
                    // 遍历文件数组
                    for (let f of files) {
                        // 文件uuid
                        f.uid = _this.uuid();
                        // 向文件数组放置文件
                        fs.push({
                            uid: f.uid, // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
                            name: f.name, // 文件名
                            status: 'uploading', // 状态有：uploading done error removed
                            percent: 0 // 上传进度为0
                        })
                    }
                    // 更新组件状态，上传状态
                    _this.setState({
                        'status': 'uploading',
                        'fileList': _this.state.fileList.concat(fs)
                    });
                    // 设置页面超时时间，为30秒
                    uploadTimeout = setTimeout(() => {
                        message.error('连接文件服务器失败，5秒后刷新页面重连');
                        // 5秒后，将重新加载当前页面
                        setTimeout(() => {
                            location.reload();
                        }, 5000);
                    }, 30000);
                },
                // 文件上传前，回调函数
                BeforeUpload: function(_, file) {},
                // 上传进度，回调函数
                UploadProgress: function(_, file, progress, event) {
                    // 查询当前文件
                    let f = _this.state.fileList.find((f) => {
                        return f.uid === file.uid;
                    });
                    // 如果，现在进度 大于 文件存储进度
                    if (progress > f.percent) {
                        // 设置新的进度
                        f.percent = progress * 100;
                        // 刷新组件
                        _this.setState({});
                    }
                },
                // 构建上传文件，名称
                Key: function(_, file) {
                    // 获得承诺对象
                    var deferred = baidubce.sdk.Q.defer();
                    // 文件的新名称
                    var key = _this.uuid() + '__' + file.name;
                    // 正确的承诺对象
                    deferred.resolve(key);
                    // 返回承诺对象
                    return deferred.promise;
                },
                // 单个文件上传完成
                FileUploaded: function(_, file, info) {
                    // 计算文件访问路径
                    var url = toUrl(info.body.object);
                    // 获取当前文件
                    let f = _this.state.fileList.find((f) => {
                        return f.uid === file.uid;
                    });
                    // 设置文件url
                    f.url = url;
                    // 设置文件状态
                    f.status = 'done';
                    // 设置文件服务器状态
                    f.response = '{"status": "success"}'
                    // 刷新组件状态
                    _this.setState({});
                },
                // 所有上传文件速度，上传字节、剩余字节、上传时间、回调函数
                NetworkSpeed: function(_, bytes, time, pendings) {
                    // 计算上传百分比
                    let p = (bytes / (bytes + pendings)) * 100;
                    // 显示文件10格，上传进度
                    if (p > (percent + 1) * 10) {
                        // 上传进度递增
                        percent++;
                        // 查询上传状态的文件数组
                        let fs = _this.state.fileList.filter((f) => {
                            return f.status === 'uploading'
                        });
                        // 如果速度进度，大于文件进度
                        if (p > fs[0].percent) {
                            // 设置文件，最新进度
                            for (let f of fs) {
                                f.percent = p;
                            }
                            // 刷新组件
                            _this.setState({});
                        }
                    }
                },
                // 文件都上传完成，回调函数
                UploadComplete: function() {
                    // 上传完成，刷新组件
                    _this.setState({
                        'status': 'complete'
                    });
                    // 清除超时对象
                    clearTimeout(uploadTimeout);
                    // 重载上传组件
                    _this.bosUpload();
                },
                // 分块列表，回调函数
                ListParts: function(_, file, uploadId) {},
                // 分块上传，回调函数
                ChunkUploaded: function(_, file, result) {},
                // 上传被中断，回调函数
                Aborted: function(_, error, file) {},
                // 分块加载，回调函数
                Error: function(_, error, file) {
                    // 展示错误信息
                    message.error('文件上传失败，5秒后刷新页面');
                    // 5秒后，将重新加载当前页面
                    setTimeout(() => {
                        location.reload();
                    }, 5000);
                }
            }
        });
    }

    componentDidMount() {
        // 加载bce 上传插件
        jsCache.load({
            url: "http://websdk.cdn.bcebos.com/bos/bce-bos-uploader/bce-bos-uploader.bundle.min.js"
        }).then(() => {
            // 执行上传组件构造
            this.bosUpload();
        });
    }

    render() {
        // 构建上传组件
        let up = (<div
                       id={ this.id }
                       style={ { padding: '30px' } }>
                      <Upload
                              defaultFileList={ this.props.defaultFileList }
                              {...this.state}
                              className="upload-list-inline">
                          <Button type="ghost">
                              <Icon type="upload" /> upload
                          </Button>
                      </Upload>
                  </div>)
        // 如果处在文件上传，加载等待状态
        if (this.state.status === 'uploading') {
            up = (<Spin tip="上传中...">
                      { up }
                  </Spin>)
        }
        // 开始渲染组件
        return up
    }
}