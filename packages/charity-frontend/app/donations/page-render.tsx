'use client';

import Donation, {DonationStatus} from "@/app/core/model/donation";
import {RestMeta} from "@/app/core/model/rest";
import {Avatar, Card, Divider, Popover, Space, Table, TableProps} from "antd";
import Campaign from "@/app/core/model/campaign";
import Link from "next/link";
import {MailOutlined, PhoneOutlined, UserOutlined} from "@ant-design/icons";
import DonationStatusTag from "@/app/donations/donation-status-tag";
import DonationAction from "@/app/donations/donation-action";
import DonationSearchBox from "@/app/donations/search-box";
import Donor from "@/app/core/model/donor";

export interface DonationPageRenderProps {
    donations: Donation[];
    pagination?: RestMeta;
}

const columns: TableProps<Donation>['columns'] = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Đợt quyên góp',
        dataIndex: 'campaign',
        key: 'campaign',
        render: (campaign: Campaign) => {
            const popoverContent = (
                <Space>
                    <Avatar src={campaign.organization?.avatarUrl} icon={<UserOutlined />} />
                    {campaign.organization?.name}
                    <Divider type={'vertical'} />
                    <span className={'float-right'}>
                        {campaign.createdAt}
                    </span>
                </Space>
            );

            return (
                <Popover content={popoverContent} title={campaign.title}>
                    <Link href={'/campaigns/' + campaign.slug}>
                        <div className={'max-w-[30ch] whitespace-nowrap text-ellipsis overflow-hidden'} >
                            {campaign.title}
                        </div>
                    </Link>
                </Popover>
            )
        }
    },
    {
        title: 'Người ủng hộ',
        dataIndex: 'donor',
        key: 'donor',
        render(donor: Donor) {
            return (
                <>
                    <span>
                        <UserOutlined /> {donor?.name ?? 'Giấu tên'}
                    </span>
                    <Divider type={'vertical'} />
                    <span>
                        <PhoneOutlined /> {
                        donor?.phoneNumber?.length ? <a href={'tel:' + donor.phoneNumber}>{donor.phoneNumber}</a> : 'Chưa rõ'
                    }
                    </span>
                    <Divider type={'vertical'} />
                    <span>
                        <MailOutlined /> {
                        donor?.email?.length ? <a href={'mailto:' + donor.email}>{donor.email}</a> : 'Chưa rõ'
                    }
                    </span>
                </>
            );
        }
    },
    {
        title: 'Số tiền',
        dataIndex: 'amountStr',
        key: 'amountStr',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (status: DonationStatus) => <DonationStatusTag status={status} />
    },
    {
        title: 'Hành động',
        dataIndex: 'id',
        key: 'id',
        render: (id, record) => {
            return record.status !== DonationStatus.REJECTED
                && record.status !== DonationStatus.CONFIRMED
                    ? <DonationAction donation={record} />
                    : null;
        },
    }
];

const DonationPageRender = ({donations, pagination}: DonationPageRenderProps) => {
    console.log(donations, pagination);
    return (
        <>
            <Card>
                <DonationSearchBox />
            </Card>
            <Card title={'Danh sách giao dịch'}
                  className={'mt-2'}
            >
                <Table dataSource={donations}
                       columns={columns}
                       rowKey={'id'}
                />
            </Card>
        </>
    );
};

export default DonationPageRender;