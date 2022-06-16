import React from 'react';
import PropTypes from 'prop-types';
import {useSelector} from "react-redux";

Dashboard.propTypes = {

};

function Dashboard(props) {
    const currentUser = useSelector(state => state.user.currentUser)
    return (
        <div>{JSON.stringify(currentUser)}</div>
    );
}

export default Dashboard;
