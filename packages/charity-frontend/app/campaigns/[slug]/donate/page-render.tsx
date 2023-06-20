'use client';

import Campaign from "@/app/core/model/campaign";
import {Button, Card, Form, Input, InputNumber} from "antd";
import TransactionProviderSelector from "@/app/campaigns/transaction-provider-selector";
import {useCallback, useMemo} from "react";
import {TransactionProvider} from "@/app/core/model/donation";
import InputMoney from "@/app/common/component/input-money";
import {PayCircleFilled, SendOutlined} from "@ant-design/icons";

const DonateRender = ({ campaign }: { campaign: Campaign }) => {
    const [form] = Form.useForm();

    const initialValues = useMemo(() => {
        return {
            transactionProvider: TransactionProvider.TRANSFER,
            campaignSlug: campaign.slug,
        };
    }, [campaign]);

    const onFinish = useCallback((values: any) => {
        console.log(values);
    }, []);

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
        </>

    )
};

export default DonateRender;