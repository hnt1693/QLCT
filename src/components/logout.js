import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch} from "react-redux";
import {setUser} from "../redux/user-slice";
import {Navigate, useNavigate} from "react-router-dom";

Logout.propTypes = {};

function Logout(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(setUser(null));
        // navigate("/login",{replace: true})
    }, [])

    return (
        <Navigate to="/login" replace />
    );
}

export default Logout;