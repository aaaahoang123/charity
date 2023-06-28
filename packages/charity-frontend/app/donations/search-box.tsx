import {useSearchParamsObject} from "@/app/common/util/use-search-params-object";
import {Button, Col, Form, Input, Row} from "antd";
import {useCallback} from "react";
import omitBy from "lodash/omitBy";
import isNil from "lodash/isNil";
import {useRouter, usePathname} from "next/navigation";
import DonationStatusSelector from "@/app/donations/donation-status-selector";
import TransactionProviderSelector from "@/app/campaigns/transaction-provider-selector";
import {SearchOutlined} from "@ant-design/icons";

const caster = {
    page: Number,
    size: Number,
};

const layout = {
    lg: 6,
    md: 8,
    sm: 12,
    xs: 24,
};

const DonationSearchBox = () => {
    const params = useSearchParamsObject(caster);
    const [form] = Form.useForm();
    const router = useRouter();
    const path = usePathname();

    const handleFinish = useCallback((values: any) => {
        const freshParams = omitBy(values, isNil);
        const params = new URLSearchParams(freshParams).toString();
        router.push(path + '?' + params);
    }, [router, path]);

    return (
        <Form form={form}
              onFinish={handleFinish}
              initialValues={params}
              layout={'vertical'}
        >
            <Row gutter={8}>
                <Col {...layout}>
                    <Form.Item name={'term'}
                               label={'Từ khoá'}
                    >
                        <Input placeholder={'Tìm kiếm theo lời nhắn/thông tin người quyên góp'}/>
                    </Form.Item>
                </Col>

                <Col {...layout}>
                    <Form.Item name={'status'}
                               label={'Trạng thái'}
                    >
                        <DonationStatusSelector allowClear={true} />
                    </Form.Item>
                </Col>

                <Col {...layout}>
                    <Form.Item name={'provider'}
                               label={'Hình thức thanh toán'}
                    >
                        <TransactionProviderSelector type={'select'} allowClear={true} />
                    </Form.Item>
                </Col>
                <Col {...layout}>
                    <Form.Item label={' '}
                               className={''}
                    >
                        <Button icon={<SearchOutlined />}
                                type={'primary'}
                                htmlType={'submit'}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default DonationSearchBox;