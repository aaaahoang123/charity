'use client';

import {Button, Upload, UploadProps} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {forwardRef, useCallback, useEffect, useRef, useState} from "react";
import {UploadChangeParam, UploadFile} from "antd/es/upload/interface";
import {useSession} from "next-auth/react";
import {API_URL} from "@/app/core/constant";
import {isEqual} from "lodash";

export interface FileUpLoadProps extends Omit<UploadProps, 'onChange' | 'action'> {
    value?: string[];
    onChange?: (_: string[]) => any;
    initialValues?: string[];
}

const linksToFiles = (links?: string[]): UploadFile[] => {
    return links?.map((url, index) => {
        const urlObj = new URL(url);
        const name = urlObj.pathname.slice(1);

        return {
            uid: (-index).toString(),
            name,
            status: 'done',
            url,
        };
    }) ?? [];
};

const FileUpload = forwardRef(function FileUpload({
                                                      initialValues,
                                                      value,
                                                      onChange,
                                                      headers,
                                                      ...props
                                                  }: FileUpLoadProps, ref) {
    const [fileList, setFileList] = useState(linksToFiles(initialValues));
    const {data: session} = useSession();

    const initialValueRef = useRef<string[]>();

    useEffect(() => {
        if (!isEqual(initialValueRef.current, initialValues)) {
            setFileList(linksToFiles(initialValues));
        }
        initialValueRef.current = initialValues;
    }, [initialValues, setFileList]);

    const onUpload = useCallback(({fileList, file}: UploadChangeParam) => {
        setFileList(fileList);
        if (file.status === 'done' || file.status === 'removed') {
            const newValue = fileList.filter(f => f.status === 'done')
                .map(f => f.response?.data?.path ?? f.name);
            onChange?.(newValue);
        }
    }, [setFileList, onChange]);

    return (
        <Upload
            ref={ref}
            action={API_URL + `/api/v1/storage`}
            listType="picture"
            fileList={fileList}
            onChange={onUpload}
            headers={{
                ...headers ?? {},
                Authorization: `Bearer ${(session as any)?.accessToken ?? ''}`
            }}
            {...props}
        >
            <Button icon={<UploadOutlined/>}>Upload</Button>
        </Upload>
    )
});

export default FileUpload;
