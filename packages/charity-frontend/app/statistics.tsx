'use client';

import {ProCard, StatisticCard} from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import {useEffect, useMemo, useState} from 'react';
import {useService} from "@/app/core/http/components";
import DonationService from "@/app/donations/donation-service";
import {DonationStatistic} from "@/app/core/model/donation-statistic";
import {Line} from "@ant-design/plots";
import {TopDonor} from "@/app/core/model/top-donor";
import {Table, TableProps} from "antd";
import CampaignService from "@/app/campaigns/campaign-service";

const topDonorColumns: TableProps<TopDonor>['columns'] = [
    {
        title: 'Tên',
        key: 'name',
        dataIndex: 'name',
    },
    {
        title: 'Đã tham gia',
        key: 'totalCampaign',
        dataIndex: 'totalCampaign',
        render: value => `${value} đợt quyên góp`
    },
    {
        title: 'Đã quyên góp',
        key: 'totalDonate',
        dataIndex: 'totalDonate',
        render: (value?: number) => `${value ?? ''}`?.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    }
];

export default HomePageStatistics;
function HomePageStatistics() {
    const [responsive, setResponsive] = useState(false);
    const donationService = useService(DonationService);
    const campaignService = useService(CampaignService);

    const [donationData, setDonationData] = useState<DonationStatistic[]>([]);
    const [topDonors, setTopDonors] = useState<TopDonor[]>([]);
    const [campaignStatistics, setCampaignStatistics] = useState<{total: number, running: number}>();

    const totalDonationAmount = useMemo(() => {
        let total = 0;
        for (const d of donationData) {
            total += d.totalAmount;
        }
        return `${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }, [donationData]);

    const totalDonationCount = useMemo(() => {
        let total = 0;
        for (const d of donationData) {
            total += d.countDonation;
        }
        return total;
    }, [donationData]);

    useEffect(() => {
        donationService.statistics().then((r) => {
            setDonationData(r.data);
        })
    }, [setDonationData, donationService]);

    useEffect(() => {
        donationService.findTopDonors()
            .then((r) => setTopDonors(r.data));
    }, [donationService]);

    useEffect(() => {
        campaignService.statistics()
            .then(r => setCampaignStatistics(r.data))
    }, [campaignService]);

    return (
        <RcResizeObserver
            key="resize-observer"
            onResize={(offset: any) => {
                setResponsive(offset.width < 596);
            }}
        >
            <ProCard
                split={responsive ? 'horizontal' : 'vertical'}
                headerBordered
                bordered
            >
                <ProCard split="horizontal">
                    <ProCard split="horizontal">
                        <ProCard split="vertical">
                            <StatisticCard
                                statistic={{
                                    title: 'Số đợt quyên góp',
                                    value: campaignStatistics?.total,
                                    // description: (
                                    //     <Statistic
                                    //         title="较本月平均流量"
                                    //         value="8.04%"
                                    //         trend="down"
                                    //     />
                                    // ),
                                }}
                            />
                            <StatisticCard
                                statistic={{
                                    title: 'Số đợt đang chạy',
                                    value: campaignStatistics?.running,
                                    // description: (
                                    //     <Statistic title="月同比" value="8.04%" trend="up"/>
                                    // ),
                                }}
                            />
                        </ProCard>
                        <ProCard split="vertical">
                            <StatisticCard
                                statistic={{
                                    title: 'Số lượt quyên góp',
                                    value: totalDonationCount,
                                    suffix: 'lượt',
                                }}
                            />
                            <StatisticCard
                                statistic={{
                                    title: 'Tổng số tiền',
                                    value: totalDonationAmount,
                                    suffix: 'đ',
                                }}
                            />
                        </ProCard>
                    </ProCard>
                    <StatisticCard
                        title="Thống kê quyên góp"
                        chart={
                            <Line data={donationData}
                                  padding={"auto"}
                                  xField={'date'}
                                  yField={'totalAmount'}
                                  xAxis={{ tickCount: 1 }}
                                  smooth={true}
                            />
                        }
                    />
                </ProCard>
                <StatisticCard
                    title="Top nhà hảo tâm"
                    chart={
                        <Table columns={topDonorColumns}
                               dataSource={topDonors}
                               rowKey={'donorId'}
                               pagination={false}
                        />
                    }
                />
            </ProCard>
        </RcResizeObserver>
    );
}

// import {Card, Col, Row} from "antd";
// import {useService} from "@/app/core/http/components";
// import DonationService from "@/app/donations/donation-service";
// import {useEffect, useState} from "react";
// import {DonationStatistic} from "@/app/core/model/donation-statistic";
// import {Line} from "@ant-design/plots";
//
// const HomePageStatistics = () => {
//     const service = useService(DonationService);
//
//     const [data, setData] = useState<DonationStatistic[]>([]);
//
//     useEffect(() => {
//         service.statistics().then((r) => {
//             setData(r.data);
//         })
//     }, [setData, service]);
//
//     return (
//         <Row gutter={8}>
//             <Col span={6}>
//                 <Card>

//                 </Card>
//             </Col>
//         </Row>
//     )
// }
//
// export default HomePageStatistics;
