import React from 'react';
import {Button, Result} from "@arco-design/web-react";
import PropTypes from 'prop-types';
import {useNavigate} from "react-router-dom";


Component404.propTypes = {

};

function Component404(props) {
    const navigate = useNavigate();
    return (
        <Result
            style={{height:'50vh',paddingTop:'30vh'}}
            status='404'
            subTitle='Access to this resource on the server is failed. Page not found'
            extra={ <Button type='primary' onClick={e=>navigate("/dashboard",{replace:true})}>Back to HomePage</Button>}
        >
        </Result>
    );
}

export default Component404;
