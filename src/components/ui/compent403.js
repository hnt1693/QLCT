import React from 'react';
import PropTypes from 'prop-types';
import {Button, Result} from "@arco-design/web-react";

Component403.propTypes = {

};

function Component403(props) {
    return (
        <Result
            style={{height:'50vh',paddingTop:'30vh'}}
            status='403'
            subTitle='Access to this resource on the server is denied.'
            extra={ <Button type='primary'>Back</Button>}
        >
        </Result>
    );
}

export default Component403;
