'use client'

import {memo, useMemo} from "react";
import {SimpleMDEReactProps} from "react-simplemde-editor/src/SimpleMdeReact";
import dynamic from "next/dynamic";
import {useAxios} from "@/app/core/http/components";
import Rest from "@/app/core/model/rest";

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {ssr: false});

interface MarkDownEditorProps extends SimpleMDEReactProps {

}

function MarkDownEditor(props: SimpleMDEReactProps) {
    const axios = useAxios();
    const options = useMemo<MarkDownEditorProps['options']>(() => {
        return {
            uploadImage: true,
            imageUploadFunction(file, resolve, reject) {
                const form = new FormData();
                form.append('file', file);
                axios.post<Rest<any>>('/api/v1/storage', form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }).then(response => {
                    resolve(response.data.data.uri);
                }).catch(e => {
                    reject(e.message);
                });
            }
        };
    }, [axios]);
    return (
        <SimpleMDE options={options} {...props} />
    );
}

export default memo(MarkDownEditor);