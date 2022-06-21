import React, {useEffect, useState} from 'react';
import {
    Button,
    Card,
    Form,
    Grid,
    Input, InputNumber,
    Modal,
    Notification,
    Popconfirm,
    Select,
    Space, Switch,
    Table,
    Tooltip
} from "@arco-design/web-react";
import menuService from '../../service/menu-service'
import groupService from '../../service/group-service'
import Tree from "@arco-design/web-react/es/Tree";
import route from '../../common/routes'

const InputSearch = Input.Search;


const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 19,
    },
};


const generatorTreeNodes = (treeData) => {
    return treeData.map((item) => {
        const {children, key, ...rest} = item;
        return (
            <Tree.Node key={key} icon={item?.icon ? <i className={item.icon}></i> : null} title={item.title}
                       dataRef={item}>
                {children ? generatorTreeNodes(item.children) : null}
            </Tree.Node>
        );
    });
};


MenuManager.propTypes = {};

function MenuManager(props) {
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [roles, setRoles] = useState([]);
    const [data, setData] = useState([]);
    const [currentMenu, setCurrentMenu] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [modalVisible, setAddGroupVisible] = useState(false);
    const [loadingModal, setLoadingAddGroupModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({mode: null, currentMenu: null, parentMenu: null});
    const [iconForm, setIconForm] = useState(null);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState({
        sizeCanChange: true,
        showTotal: true,
        total: 0,
        pageSize: 10,
        current: 1,
        pageSizeChangeResetCurrent: true,
        search:null,
        sort:null
    });

    const [usersInGroup, setUsersInGroup] = useState([]);


    const submitFormGroup = async () => {
        try {
            let menu = await form.validate();
            if (menu) {
                setLoadingAddGroupModal(true);
                try {
                    let res = null;
                    if (modalConfig.mode === 0) {
                        res = await menuService.createGroup({
                            ...menu,
                            icon: form.getFieldValue("icon").split("\"")[1],
                            parentMenu: menu.parentId ? {key: menu.parentId} : null
                        });
                    } else {
                        res = await menuService.updateGroup({
                            ...menu,
                            icon: form.getFieldValue("icon").split("\"")[1],
                            parentMenu: menu.parentId ? {key: menu.parentId} : null
                        });
                    }
                    if (res.status === 200) {
                        Notification.success({
                            title: modalConfig.mode === 0 ? 'Add group' : 'Edit group',
                            content: 'Successfully!'
                        });
                        getMenus(null);
                        setAddGroupVisible(false);
                    }
                } catch (e) {
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


    const getRoles = async () => {
        try {
            let res = await groupService.getGroups(null);
            if (res.status === 200) {
                setRoles(res.data.data.map(ob => ob.regex))
            }
        } catch (e) {

        }
    }


    useEffect(() => {
        if (modalConfig.mode !== null) {
            setAddGroupVisible(true);
            if (modalConfig.mode === 1) {
                form.setFieldValue("title", modalConfig.currentMenu.title);
                form.setFieldValue("icon", `<i className="${modalConfig.currentMenu.icon}"></i>`);
                form.setFieldValue("path", modalConfig.currentMenu.path);
                form.setFieldValue("roles", modalConfig.currentMenu.roles);
                form.setFieldValue("key", modalConfig.currentMenu.key);
                form.setFieldValue("sort", modalConfig.currentMenu.sort);
                form.setFieldValue("activated", modalConfig.currentMenu.activated);
                form.setFieldValue("parentId", modalConfig.parentMenu?.key);
                setIconForm(modalConfig.currentMenu.icon);
            }

        } else {
            setAddGroupVisible(false);
        }

        if (modalConfig.currentMenu) {
            form.setFieldValue("key", modalConfig.currentMenu.key);
        } else if (modalConfig.parentMenu) {
            form.setFieldValue("parentId", modalConfig.parentMenu?.key);
        } else {
            form.resetFields();
            setUsersInGroup([]);
        }


    }, [modalConfig])

    const getCurrentGroup = async (key) => {
        try {
            const res = await menuService.getById(key);
            if (res.status === 200) {
                setCurrentMenu(res.data.data);
                setPagination({
                    sizeCanChange: true,
                    showTotal: true,
                    total: 1,
                    pageSize: 10,
                    current: 1,
                    pageSizeChangeResetCurrent: true,
                })
            }
        } catch (e) {

        }
    }

    const deleteMenu = async (id) => {
        try {
            setLoadingGroups(true);
            const res = await menuService.deletes([id]);
            if (res.status === 200) {
                getMenus(null);
                Notification.success({title: 'Delete group', content: 'Deleted!'})
            }
        } catch (e) {
            Notification.error({title: 'Delete group', content: 'Failed!'})
        } finally {
            setLoadingGroups(false);
        }
    }

    const renderTooltipRoles = (roles) => {
        return <div>
            <Space style={{maxWidth: 500}} direction='vertical'>
                {roles?.map((r, index) => {
                    return <span key={index} style={{
                        border: "solid 1px",
                        padding: "1px 4px",
                        fontSize: 13
                    }} key={r}>{r}</span>

                })}
            </Space>
        </div>


    }

    const columns = [

        {
            title: 'Title',
            dataIndex: 'title',
            sorter: (a, b) => 0,
        },
        {
            title: 'Path',
            dataIndex: 'path',
        },
        {
            width: 70,
            title: 'Icon',
            align: "center",
            dataIndex: 'icon',
            render: (key) => <i className={key}></i>
        },
        {
            width: 300,
            title: 'Roles',
            dataIndex: 'roles',
            render: (roles) =>
                <Tooltip content={renderTooltipRoles(roles)}>
                    <Space>
                        {roles?.map((r, index) => {
                            if (index === 2) {
                                return <span key={index} style={{
                                    border: "solid 1px",
                                    padding: "1px 4px",
                                    fontSize: 13,
                                    backgroundColor: "var(--color-neutral-3)"
                                }} key={r}>{roles.length - 2}+...</span>
                            } else if (index > 2) {
                                return "";
                            }
                            return <span key={index} style={{
                                border: "solid 1px",
                                padding: "1px 4px",
                                fontSize: 13,
                                backgroundColor: "var(--color-neutral-3)"
                            }} key={r}>{r}</span>

                        })}
                    </Space>
                </Tooltip>

        },
        {
            title: '',
            dataIndex: 'key',
            width: 150,
            align: 'center',
            render: (key, data) => <Space>
                <Button type='primary' status={"default"} size={"small"}
                        icon={<i className="fa-solid fa-plus"></i>}
                        onClick={e => setModalConfig({mode: 0, currentMenu: null, parentMenu: {key:data.key}})}/>
                <Button type='primary' status={"warning"} size={"small"} icon={<i className="fa-solid fa-marker"></i>}
                        onClick={e => {
                            setModalConfig({mode: 1, currentMenu: data, parentMenu: null});
                        }}/>
                <Popconfirm
                    position={"bottom"}
                    title='Are you sure you want to delete?'
                    onOk={() => deleteMenu(key)}
                >
                    <Button type='primary' status={"danger"} size={"small"}
                            icon={<i className="fa-solid fa-trash-can"></i>}/>
                </Popconfirm>

            </Space>,
        }
    ];

    const getMenus = async (searchObject) => {
        try {
            setLoadingGroups(true);
            const res = await menuService.getMenus(searchObject);
            if (res.status === 200) {
                setData(res.data.data);
                setPagination({...pagination,total: 1})
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoadingGroups(false)
        }
    }

    useEffect(() => {
        getMenus(null);
        getRoles()
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
            <Grid.Col span={6}>
                <Button size='default' type={"primary"}
                        onClick={e => setModalConfig({mode: 0, currentGroup: null})}
                        icon={<i className="fa-solid fa-plus"></i>}></Button>
            </Grid.Col>
            <Grid.Col span={18} style={{marginBottom: 10}}>
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
                    </Space>
                </Space>
            </Grid.Col>
            <Grid.Col span={6} sm={{span: 24}} md={{span: 6}}>
                <Card style={{marginRight: 10}}>
                    <Tree
                        blockNode
                        // checkable\
                        onSelect={(selectedKeys, extra) => {
                            getCurrentGroup(selectedKeys[0])
                        }}
                        renderExtra={(node) => {
                            return (
                                <Space>


                                    <Button
                                        size={"mini"}
                                        style={{
                                            top: 5,
                                            position: 'absolute',
                                            right: 70,
                                            fontSize: 12
                                        }}
                                        type={"primary"}
                                        status={"primary"}
                                        icon={<i className="fa-solid fa-plus"></i>}
                                        onClick={() => {
                                            setModalConfig({mode: 0, currentMenu: null, parentMenu: node.dataRef});
                                        }}
                                    />

                                    <Button
                                        size={"mini"}
                                        style={{
                                            top: 5,
                                            position: 'absolute',
                                            right: 40,
                                            fontSize: 12,
                                        }}
                                        type={"primary"}
                                        status={"warning"}
                                        icon={<i className="fa-solid fa-pen-clip"></i>}
                                        onClick={() => {
                                            console.log(node)
                                            setModalConfig({
                                                mode: 1,
                                                currentMenu: node.dataRef,
                                                parentMenu: {key: parseInt(node?.parentKey) || null}
                                            });

                                        }}
                                    />
                                    <Popconfirm
                                        title={"Delete this menu?"}
                                        onOk={() => {

                                            deleteMenu(node.dataRef.key)
                                        }}
                                        okButtonProps={{size: "small"}}
                                        cancelButtonProps={{size: "small"}}
                                    >
                                        <Button
                                            size={"mini"}
                                            style={{
                                                top: 5,
                                                position: 'absolute',
                                                right: 10,
                                                fontSize: 12,
                                            }}
                                            type={"primary"}
                                            status={"danger"}
                                            icon={<i className="fa-solid fa-trash-can"></i>}

                                        />

                                    </Popconfirm>
                                </Space>
                            );
                        }}
                    >
                        {generatorTreeNodes(data)}
                    </Tree>
                </Card>
            </Grid.Col>
            <Grid.Col span={18} sm={{span: 24}} md={{span: 18}}>
                <Table

                    expandedRowKeys={[currentMenu?.key]}
                    indentSize={55}
                    size={"default"}
                    stripe
                    loading={loadingGroups}
                    columns={columns}
                    data={currentMenu ? [currentMenu] : []}
                    pagination={pagination}
                    pagePosition={"br"}
                    onChange={onChangeTable}
                    // rowSelection={{
                    //     selectedRowKeys,
                    //     onChange: (selectedRowKeys, selectedRows) => {
                    //         setSelectedRowKeys(selectedRowKeys);
                    //     },
                    // }}
                    expandedRowRender={(record) => {
                        if (record.children && record.children.length > 0) {
                            return <Table borderCell={true} columns={columns} data={currentMenu.children}
                                          pagination={false}/>;
                        } else {
                            return null;
                        }
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
                    <FormItem label='ParentId' field='parentId' hidden>
                        <Input placeholder=''/>
                    </FormItem>
                    <FormItem label='Id' field='key' hidden>
                        <Input placeholder=''/>
                    </FormItem>
                    <FormItem label='Title' field='title' rules={[{required: true}]}>
                        <Input placeholder=''/>
                    </FormItem>
                    <FormItem label='Icon' field='icon' rules={[{required: true}]}>
                        <Input onChange={value => setIconForm(value.split("\"")[1])} placeholder=''
                               suffix={<i className={iconForm}></i>}/>
                    </FormItem>

                    <FormItem
                        label='Path'
                        required

                        field='path'
                        rules={[{type: 'array', minLength: 0}]}
                    >
                        <Select
                            allowCreate
                            showSearch
                            mode='single'
                            placeholder='please select'
                            options={Object.keys(route)}
                        />
                    </FormItem>
                    <FormItem
                        label='Roles'
                        required
                        field='roles'
                        rules={[{type: 'array', minLength: 0}]}
                    >
                        <Select
                            showSearch
                            mode='multiple'
                            maxTagCount={2}
                            placeholder='please select'
                            options={roles}
                        />
                    </FormItem>

                    <FormItem label='Sort' field='sort' rules={[{required: true}]}>
                        <InputNumber
                            mode='button'
                            min={1}
                            style={{width: 160}}
                        />
                    </FormItem>
                    <FormItem
                        label='Activated'
                        field='activated'
                        triggerPropName='checked'
                    >
                        <Switch/>
                    </FormItem>

                </Form>
            </Modal>

        </Grid.Row>

    );
}

export default MenuManager;
