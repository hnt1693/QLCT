import React from 'react';
import {useSelector} from "react-redux";
import {Grid} from "@arco-design/web-react";

Dashboard.propTypes = {

};

function Dashboard(props) {
    const currentUser = useSelector(state => state.user.currentUser)
    return (
        <Grid.Row justify="center" style={{margin: 10}}>
            {JSON.stringify(currentUser)}
        </Grid.Row>
    );
}

export default Dashboard;
