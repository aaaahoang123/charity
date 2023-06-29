import Campaign from "@/app/core/model/campaign";
import {Button, ButtonProps} from "antd";
import {forwardRef, PropsWithChildren, Ref, useCallback, MouseEvent as ReactMouseEvent} from "react";
import {BellOutlined} from "@ant-design/icons";
import {useService} from "@/app/core/http/components";
import CampaignService from "@/app/campaigns/campaign-service";
import {useRouter} from "next/navigation";

export interface SubscribeButtonProps extends ButtonProps, PropsWithChildren {
    campaign: Campaign;
}

const InnerSubscribeButton = ({campaign, onClick, ...props}: SubscribeButtonProps, ref?: Ref<HTMLElement>) => {
    const service = useService(CampaignService);
    const router = useRouter();
    const onClickWrapper: ButtonProps['onClick'] = (event) => {
        service.triggerSubscribe(campaign.slug)
            .then(() => {
                router.refresh();
            });
    };

    return (
        <Button {...props}
                ref={ref}
                onClick={onClickWrapper}
        >
            <BellOutlined /> Theo dõi
        </Button>
    );
};

const SubscribeButton = forwardRef(InnerSubscribeButton);

export default SubscribeButton;