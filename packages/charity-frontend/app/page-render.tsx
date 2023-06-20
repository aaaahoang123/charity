'use client';

import Campaign, {CampaignStatus} from "@/app/core/model/campaign";
import {RestMeta} from "@/app/core/model/rest";
import {
    Avatar,
    Button,
    Card,
    Checkbox,
    Col,
    Collapse,
    CollapseProps,
    Form,
    Input, Pagination,
    Progress,
    Row,
    Select,
    Space,
    Statistic,
    Tag
} from "antd";
import Image from "next/image";
import Link from "next/link";
import {DownOutlined, SearchOutlined, UserOutlined} from "@ant-design/icons";
import styles from './page-render.module.scss';
import {useCallback, useMemo, useState} from "react";
import ClientNeedAuth from "@/app/common/component/need-auth/client-need-auth";
import {Role} from "@/app/core/role";
import DeleteCampaignBtn from "@/app/delete-campaign-btn";
import {useSearchParamsObject} from "@/app/common/util/use-search-params-object";
import {sessionMatchAnyRoles} from "@/app/api/auth/[...nextauth]/route";
import {useSession} from "next-auth/react";
import {useParams, useRouter} from "next/navigation";
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import CampaignStatusSelector from "@/app/campaigns/campaign-status-selector";

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

const renderRemainDayTagRender = (daysRemain: number) => {
    if (daysRemain < 0) {
        return <Tag color="magenta" className={'me-0'}>Quá {-daysRemain} ngày</Tag>;
    }

    if (daysRemain === 0) {
        return <Tag color={'orange'} className={'me-0'}>Sắp hết hạn</Tag>;
    }

    return <Tag color={'cyan'} className={'me-0'}>Còn {daysRemain} ngày</Tag>;
};

export const CampaignItem = ({campaign}: { campaign: Campaign }) => {
    const percent = useMemo(() => Math.round(campaign.totalReceivedAmount / campaign.targetAmount), [campaign]);
    return (
        <Card bodyStyle={{padding: 0, flex: 1, display: 'flex', flexDirection: 'column'}} className={'flex flex-1'}>
            <Link href={`/campaigns/${campaign.slug}`} className={'flex-1 flex'}>
                <div className={'flex-1'}>
                    <div className={'aspect-[1.5/1] relative'}>
                        <Image src={campaign.imageUrls?.[0] ?? ''} alt={campaign.title} fill={true} style={{
                            objectFit: 'cover'
                        }}/>
                    </div>
                </div>
            </Link>
            <Link href={`/campaigns/${campaign.slug}`} className={'flex-1 flex'}>
                <div
                    className={'flex-1 px-4 pb-3 pt-4 font-bold text-xl text-gray-600 hover:text-green-700 aspect-auto'}>
                    {campaign.title}
                </div>
            </Link>
            <div className={'px-4 flex-1'}>
                <Row className={'mb-2'}>
                    <Col flex={5}>
                        <Space>
                            <Avatar src={campaign.organization?.avatarUrl} icon={<UserOutlined/>}/>
                            {campaign.organization?.name}
                        </Space>
                    </Col>

                    <Col flex={2} className={'text-right'}>
                        {renderRemainDayTagRender(campaign.daysRemain)}
                    </Col>
                </Row>

                <div className={'mb-1'}>
                    <div><strong
                        className={'text-lg'}>{campaign.totalReceivedAmountStr}</strong> / {campaign.targetAmountStr}
                    </div>
                    <Progress percent={percent} showInfo={false} size={'small'}/>
                </div>

                <Row className={'mb-2'}>
                    <Col flex={1}>
                        <Statistic className={styles.statistic} title="Lượt quyên góp"
                                   value={campaign.totalDonations}/>
                    </Col>
                    <Col flex={1}>
                        <Statistic className={styles.statistic} title="Đạt được" value={`${percent}%`}/>
                    </Col>
                    <Col flex={1} className={'text-right align-middle flex-col flex '}>
                        <ClientNeedAuth roles={[Role.ROLE_ANONYMOUS, Role.ROLE_USER]}>
                            <Button size={'small'}>Quyên góp</Button>
                        </ClientNeedAuth>
                        <ClientNeedAuth roles={[Role.ROLE_ADMIN]}>
                            {
                                campaign.status === CampaignStatus.INITIAL
                                    ? <DeleteCampaignBtn campaign={campaign}/>
                                    : null
                            }
                            {
                                campaign.totalDonations === 0
                                    ?
                                    <Button type={'default'} size={'small'}><Link
                                        href={`/campaigns/${campaign.slug}/edit`}>Sửa</Link></Button>
                                    : null
                            }
                        </ClientNeedAuth>
                    </Col>

                </Row>
            </div>
        </Card>
    )
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
                    {campaigns.map(c => <CampaignItem campaign={c} key={c.id}/>)}
                </div>
            </Card>
            <Card className={'text-center mt-3'}>
                <PaginationRender campaigns={campaigns} pagination={pagination}/>
            </Card>
        </>
    )
};

export default HomeRender;