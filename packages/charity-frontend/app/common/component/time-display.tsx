import {memo, useMemo} from "react";
import dayjs from "dayjs";
import {FieldTimeOutlined} from "@ant-design/icons";

export interface TimeDisplayProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    time: string | null | undefined | Date;
    format?: string;
}

const defaultFormat = 'HH:mm DD/MM/YYYY';

const InnerTimeDisplay = ({ time, format, ...props }: TimeDisplayProps) => {
    const display = useMemo(() => {
        const day = dayjs(time);
        if (day.isValid()) {
            return day.format(format ?? defaultFormat);
        }
        return 'Ngày không hợp lệ'
    }, [time, format]);

    return (
        <span {...props}>
            <FieldTimeOutlined style={{ fontSize: '1rem' }} /> {display}
        </span>
    );
};

const TimeDisplay = memo(InnerTimeDisplay);

export default TimeDisplay;