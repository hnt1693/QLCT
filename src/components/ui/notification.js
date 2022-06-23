import React, {useEffect, useState} from 'react';
import {Grid} from "@arco-design/web-react";
import Login from "../login";
import {Route, Routes, useSearchParams} from "react-router-dom";

Notification.propTypes = {};

function Notification(props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [key, setKey] = useState(null);
    const [observe, setObserve] = useState(null);
    const queryParams = new URLSearchParams(window.location.search);



    const followUrlChange = () => {
        const ob = new MutationObserver(()=>{

        });
        ob.observe(document, {subtree: true, childList: true});
        setObserve(ob)
    }



    useEffect(() => {
        followUrlChange();
        return (() => {
            if(observe){
                observe.disconnect();
            }
        })
    }, [])

    return (
        <Grid.Row style={{margin: 10}}>
            <Grid.Col span={24}>
                123123
            </Grid.Col>
            <Grid.Col span={24}>
                1231321

            </Grid.Col>
        </Grid.Row>
    );
}

function NotifyDetail(props) {
    return <div>123</div>
}

export default Notification;