'use client';

import Campaign from "@/app/core/model/campaign";
import {Button, Card, Col, Divider, Form, Input, InputNumber, Modal, Row} from "antd";
import TransactionProviderSelector from "@/app/campaigns/transaction-provider-selector";
import {useCallback, useMemo, useState} from "react";
import {TransactionProvider} from "@/app/core/model/donation";
import InputMoney from "@/app/common/component/input-money";
import { SendOutlined } from "@ant-design/icons";
import {useService} from "@/app/core/http/components";
import DonationService from "@/app/campaigns/[slug]/donate/donation-service";
import PaymentInfo from "@/app/core/model/payment-info";
import Image from "next/image";

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

    const onFinish = useCallback((values: any) => {
        const handle = async () => {
            const donation = await service.create(values);
            const paymentInfo = await service.getPaymentInfo(donation.data.id);
            setPaymentInfo(paymentInfo.data);
            setDisplayModal(true);
        };

        handle();
    }, [service, setDisplayModal, setPaymentInfo]);

    return (
        <>
            <Card title={<div className={'text-center'}>{campaign.title}</div>}>
                <Form
                    layout={'vertical'}
                    form={form}
                    className={'w-1/3 mx-auto'}
                    initialValues={initialValues}
                    onFinish={onFinish}
                    // initialValues={{ layout: formLayout }}
                    // onValuesChange={onFormLayoutChange}
                    // style={{ maxWidth: formLayout === 'inline' ? 'none' : 600 }}
                >
                    <Form.Item label="Hình thức" name={'transactionProvider'}>
                        <TransactionProviderSelector />
                    </Form.Item>
                    <Form.Item name={'campaignSlug'} hidden={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={'amount'} label={'Số tiền'}>
                        <InputMoney placeholder={'Nhập số tiền quyên góp'} className={'w-1/2'} />
                    </Form.Item>
                    <Form.Item name={'message'} label={'Lời nhắn'}>
                        <Input placeholder={'Lời nhắn đính kèm'} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary"
                                icon={<SendOutlined />}
                                htmlType={'submit'}
                        >
                            Thanh toán
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Modal open={displayModal}
                   okButtonProps={{ hidden: true }}
                   cancelButtonProps={{ hidden: true }}
                   onCancel={() => setDisplayModal(false)}
                   style={{ width: 1000 }}
            >
                <Row>
                    <Col flex={2} className={'border-r border-solid border-0 border-slate-200'}>
                        <h5 className={'text-center'}>Quét mã để thanh toán</h5>
                        <div className={'w-full relative'}>
                            <div className={'aspect-[1/1.25]'} />
                            <Image src={paymentInfo?.url ?? ''}
                                   alt={paymentInfo?.provider ?? ''}
                                   fill={true}
                                   sizes={'720px'}
                            />
                        </div>
                    </Col>
                    <Col flex={1} className={'relative'}>
                        <h5 className={'text-center'}>Hoặc chuyển khoản</h5>
                    </Col>
                </Row>
            </Modal>
        </>

    )
};

export default DonateRender;