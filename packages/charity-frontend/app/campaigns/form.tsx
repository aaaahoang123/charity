'use client';

import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber, message,
    Row,
} from "antd";
import 'easymde/dist/easymde.min.css';
import FileUpload from "@/app/common/component/file-upload";
import {useCallback, useState} from "react";
import OrganizationSelector from "@/app/campaigns/OrganizationSelector";
import Organization from "@/app/core/model/organization";
import {FormItemProps} from "antd/es/form/FormItem";
import ReactMarkdown from 'react-markdown';
import MarkDownEditor from "@/app/common/component/MarkDownEditor";
import {ReloadOutlined, SendOutlined} from "@ant-design/icons";
import {useService} from "@/app/core/http-service";
import CampaignService from "@/app/campaigns/campaign-service";
import {useRouter} from "next/navigation";

const CampaignForm = () => {
    const [form] = Form.useForm();
    const [isSubmit, setSubmit] = useState(false);
    const router = useRouter();

    const service = useService(CampaignService);
    const onFinish = useCallback((values: any) => {
        setSubmit(true);
        const processedValues = {
            ...values,
            images: values.images?.join(','),
            organizationAvatar: values.organizationAvatar?.join(','),
        };
        service.create(processedValues)
            .then(response => {
                message.success('Tạo đợt quyên góp thành công');
                router.push('/');
            }).catch(e => {
                message.error('Tạo đợt quyên góp thất bại.');
                console.error(e);
            })
            .finally(() => setSubmit(false));
    }, [setSubmit, service, router]);
    const onSelectOrganization = useCallback((org?: Organization) => {
        form.setFieldsValue({
            organizationName: org?.name,
            organizationPhone: org?.phoneNumber,
            organizationEmail: org?.email,
            organizationAvatar: org?.avatar ? [org?.avatar] : undefined,
            initialAvatarUrl: org?.avatarUrl ? [org?.avatarUrl] : undefined,
        });
    }, [form]);

    return (

        <Form
            labelCol={{span: 4}}
            wrapperCol={{span: 14}}
            layout="horizontal"
            initialValues={{size: 'small'}}
            // onValuesChange={onFormLayoutChange}
            size={'small'}
            onFinish={onFinish}
            form={form}
        >
            <Row gutter={8}>
                <Col xs={24} lg={12}>
                    <Card title={'Thông tin quyên góp'}>
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
                            <MarkDownEditor/>
                        </Form.Item>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title={'Tổ chức/Cá nhân quyên góp'}>
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
                                            <FileUpload maxCount={1}
                                                        disabled={isDisabled}
                                                        initialValues={form.getFieldValue('initialAvatarUrl')}
                                            />
                                        </Form.Item>
                                    </>
                                )
                            }}
                        </Form.Item>
                    </Card>
                    <Card className={'mt-2 campaign-content'} title={'Xem trước nội dung'}>
                        <Form.Item noStyle={true}
                                   shouldUpdate={(oldValue, newValue) => oldValue.content !== newValue.content}>
                            {form => (
                                <ReactMarkdown>
                                    {form.getFieldValue('content')}
                                </ReactMarkdown>
                            )}
                        </Form.Item>
                    </Card>

                    <Row gutter={8} className={'mt-2'}>
                        <Col span={12}>
                            <Form.Item noStyle>
                                <Button htmlType={'submit'}
                                        className={'w-full'}
                                        type={'primary'}
                                        icon={<SendOutlined />}
                                        loading={isSubmit}
                                >
                                    Submit
                                </Button>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Button htmlType={'reset'}
                                    className={'w-full'}
                                    type={'dashed'}
                                    icon={<ReloadOutlined />}
                            >
                                Reset
                            </Button>
                        </Col>
                    </Row>

                </Col>
            </Row>
        </Form>
    )
};

export default CampaignForm;