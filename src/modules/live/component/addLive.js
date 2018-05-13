import React from 'react';
import { Form, Row, Col, Icon, Input, InputNumber, Dropdown, Menu, Avatar, Select, Divider, Button, Upload, notification, Spin } from 'antd';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';
import ZZEditor from '../../../components/zzEditor/zzEditor';

import { EditorState, convertFromRaw, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const FormItem = Form.Item;
const Option = Select.Option;

const saveLiveUrl = restUrl.ADDR + 'health/saveLive';

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
};

class AddLive extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fileList: [],
            editorState: EditorState.createEmpty(),
        };
    }

    componentDidMount = () => {
    }

    handleChange = ({ fileList }) => this.setState({ fileList })

    saveEditorState = (editorState) => {
        this.setState({
            editorState
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.live_cover = values.live_cover.fileList.map((item, index) => {
                    return item.response.data.id;
                }).join(',');
                values.live_content = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
                console.log('handleSubmit  param === ', values);

                ajax.postJSON(saveLiveUrl, JSON.stringify(values), (data) => {
                    if(data.success){
                        notification.open({
                            message: '新增健康信息成功！',
                            icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
                        });
                        this.context.router.push('/frame/live/liveList');
                    }
                });
            }
        });
    }

    render() {
        let { fileList, editorState } = this.state;
        const { getFieldDecorator, setFieldsValue } = this.props.form;

        return (
            <div className="zui-content">
                <div className="ibox-title">
                    <h5>新增动态</h5>
                </div>
                <div className="ibox-content">
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    label="封面图片"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('live_cover', {
                                        rules: [{ required: true, message: '封面图片不能为空!' }],
                                    })(
                                        <Upload
                                            action={restUrl.UPLOAD}
                                            listType={'picture'}
                                            className='upload-list-inline'
                                            onChange={this.handleChange}
                                        >
                                            {fileList.length >= 1 ? null : <Button><Icon type="upload" /> 上传</Button>}
                                        </Upload>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    label="名称"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('live_title', {
                                        rules: [{ required: true, message: '名称不能为空!' }],
                                    })(
                                        <Input placeholder="" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    label="说明"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('live_desc', {
                                        rules: [{ required: true, message: '说明不能为空!' }],
                                    })(
                                        <Input.TextArea autosize={{minRows: 4, maxRows: 6}} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <ZZEditor editorState={editorState} saveEditorState={this.saveEditorState} />
                            </Col>
                        </Row>
                        <Divider></Divider>
                        <Row type="flex" justify="center">
                            <Col>
                                <Button type="primary" htmlType="submit">
                                    提交
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        );
    }
}

const WrappedAddLive = Form.create()(AddLive);
AddLive.contextTypes = {
    router:React.PropTypes.object
}

export default WrappedAddLive;
