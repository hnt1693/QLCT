import React, {useEffect, useState} from 'react';
import {
    Button,
    Form,
    Grid,
    Input,
    Modal,
    Notification,
    Popconfirm,
    Space,
    Table,
    Transfer
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
                    }else{
                        res = await groupService.updateGroup({...group, id: 0, userIds: usersInGroup});
                    }
                    if (res.status === 200) {
                        Notification.success({title: modalConfig.mode===0? 'Add group':'Edit group', content: 'Successfully!'});
                        getGroups(null);
                        setAddGroupVisible(false);
                    }
                } catch (e) {
                    Notification.error({title:  modalConfig.mode===0? 'Add group':'Edit group', content: 'Failed!'});
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
        if (modalConfig.mode !== null) {
            setAddGroupVisible(true);
        } else {
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

    }, [modalConfig])

    const getCurrentGroup = async (key) => {
        try {
            const res = await groupService.getById(key);
            if (res.status === 200) {
                setModalConfig({mode: 1, currentGroup: res.data.data})

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
                <Button type='primary' status={"success"} size={"small"} icon={<i className="fa-solid fa-marker"></i>}
                        onClick={e => {
                            getCurrentGroup(key);
                        }}/>
                <Popconfirm
                    position={"bottom"}
                    title='Are you sure you want to delete?'
                    onOk={() => deleteGroups(key)}
                >
                    <Button type='primary' status={"danger"} size={"small"}
                            icon={<i className="fa-solid fa-trash-can"></i>}/>
                </Popconfirm>
                <Button type='primary' status={"default"} size={"small"}
                        icon={<i className="fa-solid fa-people-roof"></i>} onClick={e => alert(key)}/>
            </Space>,
        }
    ];

    const getGroups = async (searchObject) => {
        try {
            setLoadingGroups(true);
            const res = await groupService.getGroups(searchObject);
            if (res.status === 200) {
                setData(res.data.data);
                setPagination({
                    sizeCanChange: true,
                    showTotal: true,
                    total: res.data.pagination.total,
                    pageSize: res.data.pagination.pageSize,
                    current: res.data.pagination.page + 1,
                    pageSizeChangeResetCurrent: true,
                })
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoadingGroups(false)
        }
    }

    useEffect(() => {
        getGroups(null);
        getUsers();
    }, [])


    function onChangeTable(pagination, sorter) {
        const {current, pageSize} = pagination;
        setLoadingGroups(true);
        setTimeout(() => {
            // setData(allData.slice((current - 1) * pageSize, current * pageSize));
            // setPagination((pagination) => ({
            //     ...pagination,
            //     current,
            //     pageSize,
            // }));
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
                        onSearch={event => console.log(event)}
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
                </Form>
            </Modal>

        </Grid.Row>
    );

}


export default GroupManager;
