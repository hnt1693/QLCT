import React, {useEffect, useState} from 'react';
import {
    Alert, Avatar,
    Button, Divider, Drawer, Empty,
    Form,
    Grid, Image,
    Input,
    Modal,
    Notification,
    Popconfirm,
    Space,
    Table, Tooltip,
    Transfer, Typography
} from "@arco-design/web-react";
import groupService from '../../service/group-service'
import userService from '../../service/user-service'
import './group.css'

const InputSearch = Input.Search;
GroupManager.propTypes = {};

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 19,
    },
};

function GroupManager(props) {
    const [data, setData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [modalVisible, setAddGroupVisible] = useState(false);
    const [loadingModal, setLoadingAddGroupModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({mode: null, currentGroup: null});
    const [users, setUsers] = useState([]);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState({
        sizeCanChange: true,
        showTotal: true,
        total: 0,
        pageSize: 10,
        current: 1,
        pageSizeChangeResetCurrent: true,
        searchData: null,
        sortData: null
    });
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [usersInGroup, setUsersInGroup] = useState([]);


    const submitFormGroup = async () => {
        try {
            let group = await form.validate();
            if (group) {
                setLoadingAddGroupModal(true);
                try {
                    let res = null;
                    if (modalConfig.mode === 0) {
                        res = await groupService.createGroup({...group, id: 0, userIds: usersInGroup});
                    } else {
                        res = await groupService.updateGroup({...group, id: 0, userIds: usersInGroup});
                    }
                    if (res.status === 200) {
                        Notification.success({
                            title: modalConfig.mode === 0 ? 'Add group' : 'Edit group',
                            content: 'Successfully!'
                        });
                        getGroups(null);
                        setAddGroupVisible(false);
                    }
                } catch (e) {
                    setErrorMessage(e.response.data.message)
                    Notification.error({
                        title: modalConfig.mode === 0 ? 'Add group' : 'Edit group',
                        content: 'Failed!'
                    });
                } finally {
                    setLoadingAddGroupModal(false);
                }
            }
        } catch (e) {

        }
    }

    const getUsers = async () => {
        try {
            const res = await userService.getAllUsers();
            if (res.status === 200) {
                const tempUsers = res.data.data.map(ob => ({...ob, value: ob.fullName}));
                setUsers(tempUsers);
            }
        } catch (e) {

        }
    }


    useEffect(() => {
        if ([0, 1].includes(modalConfig.mode)) {
            setAddGroupVisible(true);
        } else if (modalConfig.mode === 2) {
            setDrawerVisible(true);
        } else {
            setDrawerVisible(false)
            setAddGroupVisible(false);
        }
        if (modalConfig.currentGroup) {
            form.setFieldValue("regex", modalConfig.currentGroup.regex)
            form.setFieldValue("groupName", modalConfig.currentGroup.groupName);
            form.setFieldValue("key", modalConfig.currentGroup.key);
            setUsersInGroup(modalConfig.currentGroup.users.map(u => (u.key)))
        } else {
            form.resetFields();
            setUsersInGroup([]);
        }
        setErrorMessage(null)
    }, [modalConfig])

    const getCurrentGroup = async (key, mode) => {
        try {
            const res = await groupService.getById(key);
            if (res.status === 200) {
                setModalConfig({mode: mode, currentGroup: res.data.data})

            }
        } catch (e) {

        }
    }

    const deleteGroups = async (id) => {
        try {
            setLoadingGroups(true);
            const res = await groupService.deletes([id]);
            if (res.status === 200) {
                getGroups(null);
                Notification.success({title: 'Delete group', content: 'Deleted!'})
            }
        } catch (e) {
            Notification.error({title: 'Delete group', content: 'Failed!'})
            console.log(e)
        } finally {
            setLoadingGroups(false);
        }
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'groupName',
            sorter: (a, b) => 0,
        },
        {
            title: 'Regex',
            dataIndex: 'regex',
        },
        {
            title: '',
            dataIndex: 'key',
            width: 250,
            align: 'center',
            render: (key) => <Space>
                <Tooltip content={"Edit group"}>
                    <Button type='primary' status={"success"} size={"small"}
                            icon={<i className="fa-solid fa-marker"></i>}
                            onClick={e => {
                                getCurrentGroup(key, 1);
                            }}/>
                </Tooltip>
                <Tooltip content={"Delete group"}>
                    <Popconfirm
                        position={"bottom"}
                        title='Are you sure you want to delete?'
                        onOk={() => deleteGroups(key)}
                    >

                        <Button type='primary' status={"danger"} size={"small"}
                                icon={<i className="fa-solid fa-trash-can"></i>}/>
                    </Popconfirm>
                </Tooltip>
                <Tooltip content={"View users"}>
                    <Button type='primary' status={"default"} size={"small"}
                            icon={<i className="fa-solid fa-people-roof"></i>}
                            onClick={e => getCurrentGroup(key, 2)}/>
                </Tooltip>

            </Space>,
        }
    ];

    const getGroups = async (searchObject) => {
        try {
            setLoadingGroups(true);
            const res = await groupService.getGroupsPagination(searchObject);
            if (res.status === 200) {
                setData(res.data.data);
                setPagination({
                    sizeCanChange: true,
                    showTotal: true,
                    total: res.data.pagination.total,
                    pageSize: res.data.pagination.pageSize,
                    current: res.data.pagination.page + 1,
                    pageSizeChangeResetCurrent: true,
                    search: res.data.pagination.search,
                    sort: res.data.pagination.sort
                })
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoadingGroups(false)
        }
    }

    useEffect(() => {
        getGroups(pagination);
        getUsers();
    }, [])


    function onChangeTable(pagination, sorter) {
        const {current, pageSize} = pagination;
        setLoadingGroups(true);
        setTimeout(() => {
            if (pagination) {
                getGroups({...pagination, current, pageSize})
            }
            setLoadingGroups(false);
        }, 1000);
    }


    return (
        <Grid.Row justify="center" style={{margin: 10}}>
            <Grid.Col span={24} style={{marginBottom: 10}}>
                <Space style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <InputSearch
                        allowClear
                        placeholder='Enter keyword to search'
                        style={{width: 350}}
                        size={"default"}
                        searchButton
                        onSearch={event => getGroups({...pagination, search: {name: event}})}
                    />
                    <Space style={{flex: 1}}>
                        {
                            selectedRowKeys.length > 0 && <Button size='default'>Delete</Button>
                        }
                        <Button size='default' type={"primary"}
                                onClick={e => setModalConfig({mode: 0, currentGroup: null})}
                                icon={<i className="fa-solid fa-plus"></i>}></Button>
                    </Space>
                </Space>
            </Grid.Col>
            <Grid.Col span={24}>
                <Table
                    size={"default"}
                    stripe
                    loading={loadingGroups}
                    columns={columns}
                    data={data}
                    pagination={pagination}
                    pagePosition={"br"}
                    onChange={onChangeTable}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectedRowKeys(selectedRowKeys);
                        },
                    }}


                    renderPagination={(paginationNode) => (
                        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 10}}>
                            {paginationNode}
                        </div>
                    )}
                />
            </Grid.Col>
            <Modal
                title={modalConfig.mode === 0 ? 'Add Group' : 'Edit group'}
                visible={modalVisible}
                onOk={submitFormGroup}
                confirmLoading={loadingModal}
                onCancel={() => setModalConfig({mode: null, currentGroup: null})}
            >
                <Form
                    {...formItemLayout}
                    form={form}
                    labelCol={{style: {flexBasis: 90}}}
                    wrapperCol={{style: {flexBasis: 'calc(100% - 90px)'}}}
                >
                    <FormItem label='Id' hidden field='key'>
                        <Input placeholder='' hidden/>
                    </FormItem>
                    <FormItem label='Name' field='groupName' rules={[{required: true}]}>
                        <Input placeholder=''/>
                    </FormItem>
                    <FormItem label='Regex' field='regex' rules={[{required: true}]}>
                        <Input placeholder=''/>
                    </FormItem>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-end", marginTop: 15}}>
                        <Transfer
                            onChange={(newTargetKeys, direction, moveKeys) => {
                                switch (direction) {
                                    case "target": {
                                        if (newTargetKeys.length > 0) {
                                            let temp = [...usersInGroup];
                                            newTargetKeys.forEach(key => temp.push(key))
                                            setUsersInGroup(temp)
                                        }
                                        break;
                                    }
                                    case "source": {
                                        if (moveKeys.length > 0) {
                                            let temp = [...usersInGroup];
                                            moveKeys.forEach(key => {
                                                temp.splice(temp.indexOf(key), 1);
                                            })
                                            setUsersInGroup(temp)
                                        }
                                        break;
                                    }
                                }
                            }}
                            pagination
                            showSearch
                            dataSource={users}
                            searchPlaceholder='Please select'
                            targetKeys={usersInGroup}
                            titleTexts={['All user', 'User in group']}
                        />

                    </div>
                    <Grid.Row align={"center"} style={{height: 40, overflow: 'hidden', marginTop: 10}}>
                        <Grid.Col align={"center"} span={24}>
                            {errorMessage && <Alert type='error' content={errorMessage}/>}
                        </Grid.Col>

                    </Grid.Row>

                </Form>
            </Modal>
            <Drawer
                width={400}
                title={<span>{modalConfig.currentGroup?.groupName} </span>}
                visible={drawerVisible}
                onOk={() => {
                    setModalConfig({mode: null, currentGroup: null});
                }}
                onCancel={() => {
                    setModalConfig({mode: null, currentGroup: null});
                }}
            >

                {modalConfig.currentGroup?.users.map((u, key) => renderUser(u))}
                {modalConfig.currentGroup?.users.length>0 && <Divider/>}
                {modalConfig.currentGroup?.users.length>0 && <div style={{textAlign:"right"}}>
                    <Typography.Text style={{fontSize:15}} type={"primary"}>Total: {modalConfig.currentGroup?.users.length}</Typography.Text>
                </div>}
                {modalConfig.currentGroup?.users.length === 0 && <Empty description={"Không có user nào cả"}/>}
            </Drawer>
        </Grid.Row>
    );

}


function renderUser(user) {
    return <div>
        <Alert
            style={{marginBottom: 5}}
            showIcon={false}
            type='info'
            content={
                <Grid.Row align={"center"}>
                    <Grid.Col span={5} align={"center"}>
                        <Avatar>
                            <Image width={160} style={{borderRadius: '50%'}} alt='avatar' preview={false}
                                   src={process.env.REACT_APP_BASE_URL + "/files/" + user.img}/>
                        </Avatar>
                    </Grid.Col>
                    <Grid.Col span={19}>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <Typography.Text style={{fontWeight: 600}}>{user.fullName}</Typography.Text>
                            <Typography.Text><i className="fa-solid fa-circle-info"></i> {user.username}
                            </Typography.Text>
                            <Typography.Text style={{fontSize: 13}}> <i className="fa-solid fa-at"></i> {user.email}
                            </Typography.Text>
                        </div>
                    </Grid.Col>
                </Grid.Row>
            }/>


    </div>
}


export default GroupManager;
