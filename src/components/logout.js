import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useDispatch} from "react-redux";
import {setUser} from "../redux/user-slice";
import {Navigate, useNavigate} from "react-router-dom";
import Loading from "./loading";

Logout.propTypes = {};

function Logout(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        setTimeout(() => {
            dispatch(setUser(null));
            navigate("/login",{replace:true})
        }, 5000)
    }, [])

    return (
        <Loading backdrop/>
    );
}

export default Logout;