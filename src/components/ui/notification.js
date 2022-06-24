import React, {useEffect, useState} from 'react';
import {
    Alert,
    Badge,
    Button,
    Card,
    Grid, Image,
    Input,
    List,
    Pagination,
    Space,
    Spin,
    Typography
} from "@arco-design/web-react";
import {I18n} from "react-redux-i18n";
import {IconArrowRight} from "@arco-design/web-react/icon";
import Avatar from "@arco-design/web-react/es/Avatar/avatar";
import './notification.css'

Notification.propTypes = {};
const InputSearch = Input.Search;

function Notification(props) {
    const [key, setKey] = useState(window.location.href);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const CHILD_KEY = "child_key";
    const [mockData,setMockData] = useState([]);
    const [data, setData] = useState(null);
    const callback = () => {
        if (localStorage.getItem(CHILD_KEY) !== window.location.href) {
            setKey(window.location.href);
            localStorage.setItem(CHILD_KEY, window.location.href)
        }
    }

    function init() {
        window.addEventListener("click", callback)
    }


    useEffect(() => {


    }, [key])


    useEffect(() => {
        localStorage.setItem(CHILD_KEY, window.location.href);
        init();
        return (() => {
            localStorage.removeItem(CHILD_KEY);
            window.removeEventListener("click", callback)
        })
    }, [])

    const Content = ({children, activated, data}) => {
        return (
            <div className={`msg-container ${activated ? 'msg-activated' : ''}`} onClick={e=>setData(data)}>
                <Avatar style={{margin: 8, width: 40}} size={40}>
                   <Image src={data?.picture?.thumbnail} style={{borderRadius:'50%'}}/>
                </Avatar>
                <div className={"msg-item"}>
                    <div className={"msg-title"}>
                        <Typography.Text style={{fontWeight: 600}}>{data?.email}</Typography.Text>
                        <Typography.Text>17:50 16/02/2022</Typography.Text>
                    </div>
                    <Typography.Text>{JSON.stringify(data?.location.country)}</Typography.Text>
                </div>
                <div className={"msg-action"}>
                    <Space>
                        <Button size={"mini"} type={"primary"} icon={<i className="fa-solid fa-reply"></i>}/>
                        <Button size={"mini"} type={"primary"} icon={<i className="fa-solid fa-trash-can"></i>}/>
                        <Button size={"mini"} type={"primary"} icon={<i className="fa-solid fa-share"></i>}/>
                    </Space>
                </div>
                {children}
            </div>
        );
    };
    const fetchData = (currentPage) => {
        if (currentPage > 10) {

        } else {
            fetch('https://randomuser.me/api/?results=7')
                .then((res) => res.json())
                .then((data) => {
                    setMockData((mockData) => mockData.concat(...data.results));
                })
                .catch((error) => console.error(error));
        }
    };

    useEffect(() => {
        fetchData(1);
    }, []);

    return (
        <Grid.Row style={{margin: 10}}>
            <Grid.Col span={24}>
                <Alert type={"warning"} content={"You have 50+ mail not read"}/>
            </Grid.Col>
            <Grid.Col span={9} style={{marginTop: 10}}>
                <Space style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <InputSearch
                        allowClear
                        placeholder={I18n.t("pageGroups.placeHolderSearch")}
                        style={{width: 350}}
                        size={"default"}
                        searchButton
                        onSearch={event => {
                        }}
                    />
                    <Space style={{width: '100%'}}>
                        {
                            selectedRowKeys.length > 0 &&
                            <Badge count={selectedRowKeys.length} maxCount={999}>
                                <Button size='default' onClick={e => alert("Remove all")}>Delete</Button>
                            </Badge>
                        }
                        <Button size='default' type={"primary"}
                                onClick={e => {
                                }}
                                icon={<i className="fa-solid fa-plus"></i>}></Button>
                    </Space>
                </Space>


                <Space direction={"vertical"} size={"mini"} style={{marginTop: 10, width: '100%'}}>
                    {mockData.map((o, i) => (<Card key={i}  className='card-with-icon-hover' hoverable>
                        <Content data={o} activated={data?.cell===o.cell}/>
                    </Card>))}
                </Space>
                <div className={"notify-pagination"}>
                    <Pagination size={"default"} total={50} showTotal sizeCanChange />
                </div>


            </Grid.Col>
            <Grid.Col span={9} style={{marginTop: 10, marginLeft: 10}}>
                KEY {key}
                {data?.cell}
            </Grid.Col>
        </Grid.Row>
    );
}

function getParameter(key, address) {
    // const address = window.location.search
    const parameterList = new URLSearchParams(address)
    return parameterList.get(key)
}


export default Notification;
