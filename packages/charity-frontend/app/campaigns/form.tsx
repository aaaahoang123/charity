'use client';

import {
    Button,
    Card,
    Cascader, Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Row,
    Select,
    Switch,
    TreeSelect
} from "antd";
import 'easymde/dist/easymde.min.css';
import FileUpload from "@/app/common-component/file-upload";
import {useCallback} from "react";
import dynamic from 'next/dynamic';
import OrganizationSelector from "@/app/campaigns/OrganizationSelector";

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

const CampaignForm = () => {
    const [form] = Form.useForm();

    const onFinish = useCallback((values: any) => {
        console.log(values);
    }, []);

    return (
        <Card>
            <Form
                labelCol={{span: 4}}
                wrapperCol={{span: 14}}
                layout="horizontal"
                initialValues={{size: 'small'}}
                // onValuesChange={onFormLayoutChange}
                size={'small'}
                onFinish={onFinish}
                // style={{ maxWidth: 600 }}
            >
                <Row gutter={8}>
                    <Col xs={24} lg={12}>
                        <h2>Thông tin đợt quyên góp</h2>

                        <Form.Item label="Tiêu đề"
                                   name="title"
                                   rules={[{required: true}, {max: 255, type: 'string'}]}
                        >
                            <Input placeholder={'Tiêu đề đợt quyên góp'} />
                        </Form.Item>
                        <Form.Item label="Mô tả"
                                   rules={[
                                       {required: true},
                                       {max: 500, type: 'string'}
                                   ]}
                                   name={'description'}
                        >
                            <Input.TextArea placeholder={'Mô tả ngắn gọn'} />
                        </Form.Item>
                        <Form.Item label="Deadline"
                                   rules={[
                                       {required: true},
                                   ]}
                                   name={'deadline'}
                        >
                            <DatePicker picker={'date'}
                                        format={'DD/MM/YYYY'}
                                        placeholder={'Ngày kết thúc'}
                            />
                        </Form.Item>
                        <Form.Item label="Mục tiêu"
                                   name={'targetAmount'}
                                   rules={[
                                       {required: true},
                                       {min: 0, type: 'number'}
                                   ]}
                        >
                            <InputNumber placeholder={'Số tiền cần quyên góp'}
                                         className={'w-1/2 !important'}
                            />
                        </Form.Item>
                        <Form.Item label="Hình ảnh"
                                   name={'images'}
                        >
                            <FileUpload multiple={true} />
                        </Form.Item>
                        <Form.Item label="Nội dung"
                                   rules={[
                                       {required: true},
                                       {max: 65535, type: 'string'}
                                   ]}
                                   name={'content'}
                        >
                            <SimpleMDE  />
                        </Form.Item>

                        <h2>Tổ chức/Cá nhân quyên góp</h2>
                        <Form.Item label="Tổ chức" name="organizationId">
                            <OrganizationSelector />
                        </Form.Item>
                        <Form.Item label="Tổ chức" name="organizationName">
                            <Input placeholder={'Tên cá nhân/Tổ chức'} />
                        </Form.Item>
                        <Form.Item label="SĐT" name={'organizationName'}>
                            <Input placeholder={'Số điện thoại'}/>
                        </Form.Item>
                        <Form.Item label="Email"
                                   name={'organizationEmail'}
                                   rules={[{type: 'email'}
                                   ]}>
                            <Input placeholder={'Email'}/>
                        </Form.Item>
                        <Form.Item label="Avatar" name={'organizationAvatar'}>
                            <FileUpload maxCount={1} />
                        </Form.Item>
                        <Form.Item label="TreeSelect">
                            <TreeSelect
                                treeData={[
                                    {title: 'Light', value: 'light', children: [{title: 'Bamboo', value: 'bamboo'}]},
                                ]}
                            />
                        </Form.Item>
                        <Form.Item label="Cascader">
                            <Cascader
                                options={[
                                    {
                                        value: 'zhejiang',
                                        label: 'Zhejiang',
                                        children: [{value: 'hangzhou', label: 'Hangzhou'}],
                                    },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item label="DatePicker">
                            <DatePicker/>
                        </Form.Item>
                        <Form.Item label="InputNumber">
                            <InputNumber/>
                        </Form.Item>
                        <Form.Item label="Switch" valuePropName="checked">
                            <Switch/>
                        </Form.Item>
                        <Form.Item label="Button">
                            <Button>Button</Button>
                        </Form.Item>
                    </Col>

                    <Col xs={24} lg={12}>

                    </Col>
                </Row>
            </Form>

        </Card>
    )
};

export default CampaignForm;