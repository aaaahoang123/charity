'use client';

import {ProCard, StatisticCard} from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import {useEffect, useMemo, useState} from 'react';
import {useService} from "@/app/core/http/components";
import DonationService from "@/app/donations/donation-service";
import {DonationStatistic} from "@/app/core/model/donation-statistic";
import {Line} from "@ant-design/plots";

const {Statistic} = StatisticCard;


export default CC;
function CC() {
    const [responsive, setResponsive] = useState(false);
    const donationService = useService(DonationService);

    const [donationData, setDonationData] = useState<DonationStatistic[]>([]);

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
                                    value: 234,
                                    description: (
                                        <Statistic
                                            title="较本月平均流量"
                                            value="8.04%"
                                            trend="down"
                                        />
                                    ),
                                }}
                            />
                            <StatisticCard
                                statistic={{
                                    title: 'Số đợt đang chạy',
                                    value: 234,
                                    description: (
                                        <Statistic title="月同比" value="8.04%" trend="up"/>
                                    ),
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
                        title="流量走势"
                        chart={
                            <Line data={donationData}
                                  padding={"auto"}
                                  xField={'date'}
                                  yField={'countDonation'}
                                  xAxis={{ tickCount: 1 }}
                                  smooth={true}
                            />
                        }
                    />
                </ProCard>
                <StatisticCard
                    title="流量占用情况"
                    chart={
                        <img
                            src="https://gw.alipayobjects.com/zos/alicdn/qoYmFMxWY/jieping2021-03-29%252520xiawu4.32.34.png"
                            alt="大盘"
                            width="100%"
                        />
                    }
                />
            </ProCard>
        </RcResizeObserver>
    );
};

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
