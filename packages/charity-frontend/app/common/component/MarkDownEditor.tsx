'use client'

import {memo, useMemo} from "react";
import dynamic from "next/dynamic";
import Rest from "@/app/core/model/rest";
import {SimpleMDEReactProps} from "react-simplemde-editor";
import {useSession} from "next-auth/react";
import {API_URL} from "@/app/core/constant";

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {ssr: false});

interface MarkDownEditorProps extends SimpleMDEReactProps {

}

function MarkDownEditor(props: SimpleMDEReactProps) {
    const { data: session } = useSession();
    const accessToken = (session as any)?.accessToken;

    const options = useMemo<MarkDownEditorProps['options']>(() => {
        return {
            uploadImage: true,
            imageUploadFunction(file, resolve, reject) {
                const form = new FormData();
                form.append('file', file);
                fetch(API_URL + '/api/v1/storage', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: form,
                })
                    .then(res => {
                        if (res.ok) {
                            return res.json();
                        }
                        reject('Upload failed with status: ' + res.status);
                    })
                    .then((json) => resolve(json.data.uri))
                    .catch(e => reject(e));
            }
        };
    }, [accessToken]);
    return (
        <SimpleMDE options={options} {...props} />
    );
}

export default memo(MarkDownEditor);