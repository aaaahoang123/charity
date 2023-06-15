import {InputNumber, InputNumberProps} from "antd";
import {forwardRef} from "react";

const defaultFormatter = (value?: number) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const defaultParser = (value?: string) => value!.replace(/\$\s?|(,*)/g, '');

const InputMoney = forwardRef<HTMLInputElement, InputNumberProps<number>>(
    ({formatter, parser, ...props}, ref) => (
        <InputNumber<number> formatter={formatter ?? defaultFormatter}
                            parser={parser ?? defaultParser as any}
                            ref={ref}
                            {...props}
        />
    )
);

InputMoney.displayName = 'InputMoney';

export default InputMoney;