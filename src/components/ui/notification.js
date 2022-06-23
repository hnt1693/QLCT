import React, {useEffect, useState} from 'react';
import {Grid} from "@arco-design/web-react";
import Login from "../login";
import {Route, Routes, useLinkClickHandler, useSearchParams} from "react-router-dom";
import {observe} from "web-vitals/dist/modules/lib/observe";

Notification.propTypes = {};

function Notification(props) {
    const [key, setKey] = useState(window.location.href);
    const [handleChange, setChange] = useState(null);
    const [obs, setObs] = useState(null);
    let render = 0;

    const callback = () => {
        setChange(window.location.href);
    }
    useEffect(() => {
        let observable = new MutationObserver((e) => {
                callback();
            }
        )
        setObs(observable);
    }, [])

    useEffect(() => {
        if (obs) {
            obs.observe(document, {attributes: true, childList: true, subtree: true})
        }
        return (() => {
            if (obs) {
                obs.disconnect()
            }
        })
    }, [obs])



    useEffect(() => {
        if (key !== window.location.href) {
            setKey(window.location.href);
        }
    }, [handleChange])

    useEffect(() => {


    }, [key])


    return (
        <Grid.Row style={{margin: 10}}>
            <Grid.Col span={24}>
                123123 {render}
            </Grid.Col>
            <Grid.Col span={24}>
                KEY {key}
            </Grid.Col>
        </Grid.Row>
    );
}

function getParameter(key) {
    const address = window.location.search
    const parameterList = new URLSearchParams(address)
    return parameterList.get(key)
}


export default Notification;
