'use client';

import Campaign from "@/app/core/model/campaign";
import {RestMeta} from "@/app/core/model/rest";
import {
    Button,
    Card,
    Checkbox,
    Col,
    Collapse,
    CollapseProps,
    Form,
    Input, Pagination,
    Row,
} from "antd";
import {DownOutlined, SearchOutlined} from "@ant-design/icons";
import styles from './page-render.module.scss';
import {useCallback, useState} from "react";
import ClientNeedAuth from "@/app/common/component/need-auth/client-need-auth";
import {Role} from "@/app/core/role";
import {useSearchParamsObject} from "@/app/common/util/use-search-params-object";
import {useSession} from "next-auth/react";
import {useParams, useRouter} from "next/navigation";
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import CampaignStatusSelector from "@/app/campaigns/campaign-status-selector";
import CampaignItem from "@/app/campaign-list-item";

export interface HomeRenderProps {
    campaigns: Campaign[];
    pagination?: RestMeta;
}

const searchParamsCaster = {
    isSubscribed: Boolean,
    page: Number,
    size: Number,
    id: Number,
};

const AdvanceSearch = () => {
    const [activeKey, setActiveKey] = useState<number>();

    const onClickAdvanceSearch = useCallback(() => {
        setActiveKey(old => old ? undefined : 1);
    }, [setActiveKey]);

    const {data: session} = useSession();

    const collapseItems: CollapseProps['items'] = [
        {
            key: 1,
            label: <></>,
            showArrow: false,
            children: (
                <>
                    <Row gutter={8}>
                        <ClientNeedAuth roles={[Role.ROLE_ADMIN]}>
                            <Col span={6}>
                                <Form.Item name={'id'} className={'mb-1'}>
                                    <Input placeholder={'Tìm kiếm ID'}/>
                                </Form.Item>
                            </Col>
                        </ClientNeedAuth>
                        <ClientNeedAuth roles={[Role.ROLE_ADMIN]}>
                            <Col span={6}>
                                <Form.Item name={'phone'} className={'mb-1'}>
                                    <Input placeholder={'Tìm kiếm bằng SDT'}/>
                                </Form.Item>
                            </Col>
                        </ClientNeedAuth>

                        <Col span={6}>
                            <Form.Item name={'status'} className={'mb-1'}>
                                <CampaignStatusSelector allowClear={true} />
                            </Form.Item>
                        </Col>
                        <ClientNeedAuth roles={[Role.ROLE_ANONYMOUS, Role.ROLE_USER]}>
                            <Col span={6}>
                                <Form.Item name={'isSubscribed'} valuePropName={'checked'} className={'mb-1'}>
                                    <Checkbox>
                                        Đã theo dõi
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        </ClientNeedAuth>
                    </Row>
                    <Form.Item>
                        <Button htmlType={'submit'} type={'primary'}>
                            <SearchOutlined/>
                        </Button>
                    </Form.Item>
                </>
            )
        }
    ];

    return (
        <>
            <Button type={'link'}
                    className={'p-0'}
                    onClick={onClickAdvanceSearch}
            >
                Tìm kiếm nâng cao <DownOutlined/>
            </Button>
            <Collapse activeKey={activeKey}
                      items={collapseItems}
                      ghost={true}
                      bordered={false}
                      className={styles['no-header-collapse']}
            />
        </>
    )
}

const SearchBox = () => {
    const params = useSearchParamsObject(searchParamsCaster);
    const [form] = Form.useForm();
    const router = useRouter();

    const handleFinish = useCallback((values: any) => {
        const freshParams = omitBy(values, isNil);
        const params = new URLSearchParams(freshParams).toString();
        router.push('?' + params);
    }, [router]);

    return (

        <Form form={form}
              initialValues={params}
              layout={'vertical'}
              onFinish={handleFinish}
        >
            <Form.Item name={'term'}
                       label={<strong>Tìm theo từ khoá</strong>}
                       className={'mb-1'}
            >
                <Input placeholder={'Nhập từ khoá'}
                       className={'w-full'}
                       allowClear
                />
            </Form.Item>
            <AdvanceSearch/>
        </Form>
    );
};

const PaginationRender = ({pagination}: HomeRenderProps) => {
    const router = useRouter();
    const params = useParams();
    const onChange = (page: number, size: number) => {
        const newParams = {
            ...params,
            page: page - 1,
            size,
        }
        router.push('?' + new URLSearchParams(newParams as any).toString());
    };

    return (
        <Pagination
            current={(pagination?.currentPage ?? 0) + 1}
            pageSize={pagination?.size ?? 20}
            total={pagination?.total}
            onChange={onChange}
            showSizeChanger={true}
            showQuickJumper={true}
        />
    )
};

const HomeRender = ({campaigns, pagination}: HomeRenderProps) => {
    return (
        <>
            <Card>
                <SearchBox/>
            </Card>
            <Card title={<div className={'text-center'}>Những hoàn cảnh khó khăn</div>} className={'mt-3'}>
                <div className={'grid gap-6 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 auto-rows-fr'}>
                    {campaigns.map(c => <CampaignItem campaign={c} key={c.id} displayActions />)}
                </div>
            </Card>
            <Card className={'text-center mt-3'}>
                <PaginationRender campaigns={campaigns} pagination={pagination}/>
            </Card>
        </>
    )
};

export default HomeRender;