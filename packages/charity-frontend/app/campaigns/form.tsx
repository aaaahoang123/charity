'use client';

import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Row,
} from "antd";
import 'easymde/dist/easymde.min.css';
import FileUpload from "@/app/common/component/file-upload";
import {useCallback} from "react";
import dynamic from 'next/dynamic';
import OrganizationSelector from "@/app/campaigns/OrganizationSelector";
import Organization from "@/app/core/model/organization";
import {FormItemProps} from "antd/es/form/FormItem";
import ReactMarkdown from 'react-markdown';
import MarkDownEditor from "@/app/common/component/MarkDownEditor";

const CampaignForm = () => {
    const [form] = Form.useForm();

    const onFinish = useCallback((values: any) => {
        console.log(values);
    }, []);
    const onSelectOrganization = useCallback((org?: Organization) => {
        form.setFieldsValue({
            organizationName: org?.name,
            organizationPhone: org?.phoneNumber,
            organizationEmail: org?.email,
            organizationAvatar: org?.avatar,
        });
    }, [form]);

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
                form={form}
                // style={{ maxWidth: 600 }}
            >
                <Row gutter={8}>
                    <Col xs={24} lg={12}>
                        <h2>Thông tin đợt quyên góp</h2>

                        <Form.Item label="Tiêu đề"
                                   name="title"
                                   rules={[{required: true}, {max: 255, type: 'string'}]}
                        >
                            <Input placeholder={'Tiêu đề đợt quyên góp'}/>
                        </Form.Item>
                        <Form.Item label="Mô tả"
                                   rules={[
                                       {required: true},
                                       {max: 500, type: 'string'}
                                   ]}
                                   name={'description'}
                        >
                            <Input.TextArea placeholder={'Mô tả ngắn gọn'}/>
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
                            <FileUpload multiple={true}/>
                        </Form.Item>
                        <Form.Item label="Nội dung"
                                   rules={[
                                       {required: true},
                                       {max: 65535, type: 'string'}
                                   ]}
                                   name={'content'}
                        >
                            <MarkDownEditor />
                        </Form.Item>

                        <h2>Tổ chức/Cá nhân quyên góp</h2>
                        <Form.Item label="Tổ chức" name="organizationId">
                            <OrganizationSelector onSelectObject={onSelectOrganization}/>
                        </Form.Item>

                        <Form.Item noStyle={true}
                                   shouldUpdate={(oldData, newData) => {
                                       // console.log({oldData, newData})
                                       return oldData.organizationId !== newData.organizationId
                                   }}
                        >
                            {form => {
                                // if (form.getFieldValue('organizationId')) {
                                const isDisabled = !!form.getFieldValue('organizationId');
                                const commonRules: FormItemProps['rules'] | undefined = isDisabled ? undefined : [
                                    {required: true},
                                    {max: 255, type: 'string'}
                                ];
                                // }
                                return (
                                    <>
                                        <Form.Item label="Tổ chức" name="organizationName"
                                                   rules={commonRules}>
                                            <Input placeholder={'Tên cá nhân/Tổ chức'} disabled={isDisabled}/>
                                        </Form.Item>
                                        <Form.Item label="SĐT"
                                                   name={'organizationPhone'}
                                                   rules={commonRules}
                                        >
                                            <Input placeholder={'Số điện thoại'} disabled={isDisabled}/>
                                        </Form.Item>
                                        <Form.Item label="Email"
                                                   name={'organizationEmail'}
                                                   rules={[{type: 'email'}]}>
                                            <Input placeholder={'Email'} disabled={isDisabled}/>
                                        </Form.Item>
                                        <Form.Item label="Avatar"
                                                   name={'organizationAvatar'}>
                                            <FileUpload maxCount={1} disabled={isDisabled}/>
                                        </Form.Item>
                                    </>
                                )
                            }}
                        </Form.Item>

                        <Form.Item label="Button">
                            <Button htmlType={'submit'}>Button</Button>
                        </Form.Item>
                    </Col>

                    <Col xs={24} lg={12}>
                        <Form.Item noStyle={true}
                                   shouldUpdate={(oldValue, newValue) => oldValue.content !== newValue.content}>
                            {form => (
                                <ReactMarkdown>
                                    {form.getFieldValue('content')}
                                </ReactMarkdown>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

        </Card>
    )
};

export default CampaignForm;