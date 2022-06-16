import React from 'react';
import './loading.css'
import PropTypes from 'prop-types';
import {Spin} from "@arco-design/web-react";

Loading.propTypes = {

};

function Loading(props) {
    return (
        <div className={"loading-container"}>
            {props?.backdrop &&  <div className={"loading-backdrop"}>
            </div>}
            <div className={"loading-pannel"}>
                <Spin dot />
            </div>

        </div>
    );
}

export default Loading;