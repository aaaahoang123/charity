'use client';

import Campaign from "@/app/core/model/campaign";
import {Button, Card, Col, Form, Input, Modal, Row} from "antd";
import TransactionProviderSelector from "@/app/campaigns/transaction-provider-selector";
import {useCallback, useMemo, useState} from "react";
import {TransactionProvider} from "@/app/core/model/donation";
import InputMoney from "@/app/common/component/input-money";
import {SendOutlined} from "@ant-design/icons";
import {useService} from "@/app/core/http/components";
import DonationService from "@/app/campaigns/[slug]/donate/donation-service";
import PaymentInfo, {PaymentOpenType} from "@/app/core/model/payment-info";
import Image from "next/image";
import CampaignItem from "@/app/campaign-list-item";
import DonorSelector from "@/app/campaigns/[slug]/donate/donor-selector";
import Donor from "@/app/core/model/donor";
import ClientNeedAuth from "@/app/common/component/need-auth/client-need-auth";
import {Role} from "@/app/core/role";

const hasDifferenceDonorId = (oldData: any, newData: any) => oldData?.donorId !== newData?.donorId;

const DonateRender = ({ campaign }: { campaign: Campaign }) => {
    const [form] = Form.useForm();
    const [displayModal, setDisplayModal] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>();

    const initialValues = useMemo(() => {
        return {
            transactionProvider: TransactionProvider.TRANSFER,
            campaignSlug: campaign.slug,
        };
    }, [campaign]);

    const service = useService(DonationService);

    const onSelectDonor = useCallback((donor?: Donor) => {
        form.setFieldsValue({
            donorName: donor?.name,
            donorPhoneNumber: donor?.phoneNumber,
            donorEmail: donor?.email,
        });
    }, [form]);

    const onFinish = useCallback((values: any) => {
        const handle = async () => {
            if (paymentInfo) {
                setDisplayModal(true);
                return;
            }
            const donation = await service.create(values);
            const paymentResponse = await service.getPaymentInfo(donation.data.id);
            setPaymentInfo(paymentResponse.data);
            if (paymentResponse.data.openType === PaymentOpenType.MODAL) {
                setDisplayModal(true);
            } else {
                window.location.href = paymentResponse.data.url;
            }
        };

        handle();
    }, [service, setDisplayModal, setPaymentInfo, paymentInfo]);

    return (
        <>
            <Row gutter={16}>
                <Col md={18}>
                    <Card title={<div className={'text-center'}>Thông tin quyên góp</div>}>

                        <Form
                            layout={'vertical'}
                            form={form}
                            initialValues={initialValues}
                            onFinish={onFinish}
                            // initialValues={{ layout: formLayout }}
                            // onValuesChange={onFormLayoutChange}
                            // style={{ maxWidth: formLayout === 'inline' ? 'none' : 600 }}
                        >
                            <Row gutter={16}>
                                <Col md={12}>
                                    <Form.Item label="Hình thức" name={'transactionProvider'}>
                                        <TransactionProviderSelector />
                                    </Form.Item>
                                    <Form.Item name={'campaignSlug'} hidden={true}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name={'amount'}
                                               label={'Số tiền (VND)'}
                                               rules={[
                                                   {required: true},
                                                   {type: 'number', min: 0}
                                               ]}
                                    >
                                        <InputMoney placeholder={'Nhập số tiền quyên góp'}
                                                    className={'w-1/2'}
                                                    min={0}
                                                    step={1000}
                                        />
                                    </Form.Item>
                                    <Form.Item name={'message'} label={'Lời nhắn'}>
                                        <Input placeholder={'Lời nhắn đính kèm'} />
                                    </Form.Item>
                                </Col>
                                <Col md={12}>
                                    <ClientNeedAuth roles={[Role.ROLE_USER]}>
                                        <Form.Item name={'donorId'}
                                                   label={'Chọn thông tin ủng hộ'}
                                        >
                                            <DonorSelector className={'w-full'}
                                                           allowClear={true}
                                                           onSelectDonor={onSelectDonor}
                                            />
                                        </Form.Item>
                                    </ClientNeedAuth>
                                    <Form.Item
                                        noStyle={true}
                                        shouldUpdate={hasDifferenceDonorId}
                                    >
                                        {form => {
                                            const disabled = !!form.getFieldValue('donorId');

                                            return (
                                                <>
                                                    <Form.Item name={'donorName'}
                                                               label={'Tên người ủng hộ'}
                                                               rules={[
                                                                   {type: 'string', max: 255}
                                                               ]}
                                                    >
                                                        <Input placeholder={'Nhập tên'}
                                                               disabled={disabled}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item name={'donorPhoneNumber'}
                                                               label={'SĐT'}
                                                               rules={[
                                                                   {type: 'string', max: 255}
                                                               ]}
                                                    >
                                                        <Input placeholder={'Nhập số điện thoại'}
                                                               disabled={disabled}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item name={'donorEmail'}
                                                               label={'Email'}
                                                               rules={[
                                                                   {type: 'email', max: 255}
                                                               ]}
                                                    >
                                                        <Input placeholder={'Nhập email'}
                                                               disabled={disabled}
                                                        />
                                                    </Form.Item>
                                                </>
                                            )
                                        }}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item>
                                <Button type="primary"
                                        icon={<SendOutlined />}
                                        htmlType={'submit'}
                                        className={'w-full'}
                                >
                                    Thanh toán
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
                <Col md={6}>
                    <CampaignItem campaign={campaign}
                                  title={<div className={'text-center'}>Đợt quyên góp</div>}
                    />
                </Col>
            </Row>
            <Modal open={displayModal}
                   okButtonProps={{ className: 'hidden' }}
                   cancelButtonProps={{ className: 'hidden' }}
                   onCancel={() => setDisplayModal(false)}
                   style={{ width: 1000 }}
                   title={<div className={'text-center'}>Quét mã để thanh toán</div>}
            >
                <span className={'text-xs text-cyan-600'}>
                    Vui lòng sử dụng ứng dụng ngân hàng để quét mã QR bên dưới, hoặc chuyển khoản theo thông tin đính kèm
                </span>
                <div className={'w-full relative'}>
                    <div className={'aspect-[1/1.25]'} />
                    <Image src={paymentInfo?.url ?? ''}
                           alt={paymentInfo?.provider ?? ''}
                           fill={true}
                           sizes={'720px'}
                    />
                </div>
            </Modal>
        </>

    )
};

export default DonateRender;