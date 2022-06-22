import React from 'react';
import {Button, Result} from "@arco-design/web-react";
import PropTypes from 'prop-types';
import {useNavigate} from "react-router-dom";
import {I18n} from 'react-redux-i18n';

Component404.propTypes = {

};

function Component404(props) {
    const navigate = useNavigate();
    return (
        <Result
            style={{height:'50vh',paddingTop:'30vh'}}
            status='404'
            subTitle={I18n.t("page404.pageNotFound")}
            extra={ <Button type='primary' onClick={e=>navigate("/dashboard",{replace:true})}>{I18n.t("page404.backToHomePage")}</Button>}
        >
        </Result>
    );
}

export default Component404;
