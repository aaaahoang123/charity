'use client';

import Donation from "@/app/core/model/donation";
import {memo, useCallback} from "react";
import {useService} from "@/app/core/http/components";
import DonationService from "@/app/donations/donation-service";
import {Divider, Form, Input, Space, App} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import { useRouter } from 'next/navigation';

export interface DonationActionProps {
    donation: Donation;
}

const InnerDonationAction = ({donation}: DonationActionProps) => {
    const donationService = useService(DonationService);
    const [form] = Form.useForm();

    const router = useRouter();
    const app = App.useApp();
    const messageSuccess = app.message.success;
    const confirm = app.modal.confirm;
    const warning = app.modal.warning;
    const onApprove = useCallback(() => {
        confirm({
            title: (
                <>Bạn chắc chắn muốn duyệt yêu cầu quyên góp mã {donation.id} (DNC_{donation.id}) của <b>{donation.donor?.name ?? 'Người ẩn danh'}</b> với số tiền {donation.amountStr} chứ?</>
            ),
            content: (
                <Form form={form}>
                    <Form.Item name={'transactionCode'}
                               rules={[{required: true}, {type: 'string', max: 50}]}
                    >
                        <Input placeholder={'Vui lòng nhập mã ngân hàng'} />
                    </Form.Item>

                </Form>
            ),
            onOk() {
                return new Promise((resolve, reject) => {
                    const isFormValid = form
                        .getFieldsError()
                        .every((fieldErr) => fieldErr.errors.length === 0);

                    if (!isFormValid) reject();

                    else return donationService.approve(donation.id, form.getFieldValue('transactionCode'))
                        .then((result) => {
                            messageSuccess('Duyệt yêu cầu quyên góp thành công');
                            router.refresh();
                            resolve(result);
                        });
                });
            }
        });
    }, [donation.id, donation.donor?.name, donation.amountStr, form, donationService, router, confirm, messageSuccess]);

    const onReject = useCallback(() => {
        warning({
            title: <>Bạn chắc chắn muốn huỷ yêu cầu quyên góp mã {donation.id} (DNC_{donation.id}) của <b>{donation.donor?.name ?? 'Người ẩn danh'}</b> với số tiền {donation.amountStr} chứ?</>,
            content: 'Nhấn đồng ý đồng nghĩa với huỷ giao yêu cầu quyên góp này',
            onOk() {
                return donationService.reject(donation.id)
                    .then(response => {
                        messageSuccess('Huỷ yêu cầu quyên góp thành công')
                        router.refresh();
                        return response;
                    });
            }
        })
    }, [donation.amountStr, donation.donor?.name, donation.id, donationService, messageSuccess, router, warning]);

    return (
        <Space>
            <CheckOutlined className={'text-green-600 cursor-pointer'}
                        onClick={onApprove}
            />
            <Divider type={'vertical'} />
            <CloseOutlined className={'text-red-600 cursor-pointer'}
                           onClick={onReject}
            />
        </Space>
    );
};

const DonationAction = memo(InnerDonationAction);

export default DonationAction;
