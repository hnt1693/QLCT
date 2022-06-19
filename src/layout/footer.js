import React from 'react';
import {Grid} from "@arco-design/web-react";
import './footer.css'

const Row = Grid.Row;
const Col = Grid.Col;
FooterLayout.propTypes = {

};

function FooterLayout(props) {
    return (
        <div className={'footer-container'}>
            <div>Copyright 2022</div>
        </div>
    );
}

export default FooterLayout;
