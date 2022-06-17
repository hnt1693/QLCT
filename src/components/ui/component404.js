import React from 'react';
import PropTypes from 'prop-types';
import {Button, Result} from "@arco-design/web-react";

Component404.propTypes = {
    
};

function Component404(props) {
    return (
        <Result
            style={{height:'50vh',paddingTop:'30vh'}}
            status='404'
            subTitle='Access to this resource on the server is denied.'
            extra={ <Button type='primary'>Back</Button>}
        >
        </Result>
    );
}

export default Component404;