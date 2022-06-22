import React, {useEffect, useState} from 'react';
import {
    Button,
    Form,
    Grid,
    Input,
    Message,
    Modal,
    Popconfirm, Progress, Slider,
    Space,
    Table,
    Tooltip,
    Upload,
    Notification, Select, Image as Img, Alert
} from '@arco-design/web-react';
import userService from "../../service/user-service";
import authService from "../../service/auth-service";
import groupService from "../../service/group-service";
import fileService from "../../service/file.service";
import {IconEdit, IconMinus, IconPlus, IconRotateLeft} from "@arco-design/web-react/icon";
import * as PropTypes from "prop-types";
import EasyCropper from 'react-easy-crop';
import './user.css'
import {UPLOAD_URL} from "../../service/file.service";
import {useSelector} from "react-redux";
import {I18n} from 'react-redux-i18n'
import Avatar from "@arco-design/web-react/es/Avatar/avatar";

const InputSearch = Input.Search;


const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
};
const headerCellStyle = {
    height: 80
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


UserManager.propTypes = {};


EasyCropper.propTypes = {
    aspect: PropTypes.number,
    rotation: PropTypes.number,
    style: PropTypes.shape({containerStyle: PropTypes.shape({width: PropTypes.string, height: PropTypes.number})}),
    zoom: PropTypes.number,
    onCropChange: PropTypes.func,
    onRotationChange: PropTypes.func,
    image: PropTypes.string,
    onCropComplete: PropTypes.func,
    crop: PropTypes.shape({x: PropTypes.number, y: PropTypes.number}),
    onZoomChange: PropTypes.func,
    cropSize: PropTypes.shape({width: PropTypes.number, height: PropTypes.number})
};

function UserManager(props) {
    const currentUser = useSelector(state => state.user.currentUser);
    const [groups, setGroups] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [modalVisible, setAddGroupVisible] = useState(false);
    const [file, setFileAvatar] = useState(null);
    const [pagination, setPagination] = useState({
        sizeCanChange: true,
        showTotal: true,
        total: 96,
        pageSize: 10,
        current: 1,
        pageSizeChangeResetCurrent: true,
        search: null,
        sort: null
    });
    const [loading, setLoading] = useState(false);
    const [loadingUser, setLoadingUsers] = useState(false);
    const [modalConfig, setModalConfig] = useState({mode: null, currentGroup: null});
    const [loadingModal, setLoadingAddGroupModal] = useState(false);

    const validateRules = {
        username: [
            {required: true, message: "Required"},
            {match: new RegExp("^[a-zA-Z0-9]+$"), message: "Not contain special characters"},
            {minLength: 6, message: "Valid 6-40 characters"},
            {maxLength: 40, message: "Valid 6-40 characters"}],
        password: [],
        passwordAddUser: [
            {required: true},
            {minLength: 6, message: "Valid 6-40 characters"},
            {maxLength: 40, message: "Valid 6-40 characters"}
        ],
        fullName: [
            {required: true, message: "Required"},
            {minLength: 6, message: "Valid 6-40 characters"},
            {maxLength: 40, message: "Valid 6-40 characters"},
        ],
        email: [{
            match: new RegExp("^([a-zA-Z0-9\\.])+@([a-zA-Z0-9]+\\.){1,2}([a-zA-Z0-9]+){1}$"),
            message: "Email not valid"
        }],
        groups: [{type: 'array'}]
    }

    const columns = [
        {
            title: 'FullName',
            dataIndex: 'fullName',
            headerCellStyle: headerCellStyle,
            fixed: "left",
            width: 200
        },
        {
            title: 'Username',
            dataIndex: 'username',
            // width: 150,
            sorter: (a, b) => 0,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            render: () => '1326/5 Quốc Lộ 1A - Khu phố 1, Phường Thới An, Quận 12,TP  Hồ Chí Minh',
            width: 300,
            // ellipsis:true

        },
        {
            title: 'Email',
            dataIndex: 'email',
            // width: 250
        }, {
            width: 300,
            title: 'Roles',
            dataIndex: 'groups',
            render: (roles) =>

                <Tooltip content={renderTooltipRoles(roles.map(gr => (gr.regex)))}>
                    <Space>
                        {roles.map(gr => (gr.regex))?.map((r, index) => {
                            if (index === 2) {
                                return <span style={{
                                    border: "solid 1px",
                                    padding: "1px 4px",
                                    fontSize: 13,
                                    backgroundColor: "var(--color-neutral-3)"
                                }} key={r}>{roles.length - 2}+...</span>
                            } else if (index > 2) {
                                return "";
                            }
                            return <span style={{
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

            fixed: 'right',
            title: '',
            dataIndex: 'key',
            width: 150,
            align: 'center',
            render: (key) => <Space>
                <Button type='primary' status={"success"} size={"small"} icon={<i className="fa-solid fa-marker"></i>}
                        onClick={async (e) => {
                            try {
                                let res = await userService.getById(key);
                                if (res.status === 200) {
                                    setModalConfig({mode: 1, currentUser: res.data.data})
                                }
                            } catch (e) {

                            }

                        }}/>

                <Popconfirm
                    position={"bottom"}
                    title='Are you sure you want to delete?'
                    okButtonProps={{size: "small"}}
                    cancelButtonProps={{size: "small"}}
                    onOk={() => {
                        Message.info({content: 'ok'});
                    }}
                    onCancel={() => {
                        Message.error({content: 'cancel'});
                    }}
                >
                    <Button type='primary' status={"danger"} size={"small"}
                            icon={<i className="fa-solid fa-trash-can"></i>}/>
                </Popconfirm>
                <Button type='primary' status={"default"} size={"small"}
                        icon={<i className="fa-solid fa-people-roof"></i>}
                        onClick={e => alert(key)}/>
            </Space>,
        }
    ];

    const getUsers = async (pagination) => {
        try {
            setLoadingUsers(true);
            const res = await userService.getAllPagination(pagination);
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
            setLoadingUsers(false)
        }
    }

    const getGroups = async () => {
        try {
            const res = await groupService.getGroups();
            if (res.status === 200) {
                setGroups(res.data.data);
            }
        } catch (e) {
            console.log(e)
        } finally {
        }
    }

    useEffect(() => {
        getUsers(pagination);
        getGroups();
    }, [])


    useEffect(() => {
        if (modalConfig.mode !== null) {
            setAddGroupVisible(true);
        } else {
            setAddGroupVisible(false);
            setFileAvatar(null);
        }
        if (modalConfig.currentUser) {
            form.setFieldValue("key", modalConfig.currentUser.key)
            form.setFieldValue("username", modalConfig.currentUser.username);
            form.setFieldValue("email", modalConfig.currentUser.email);
            form.setFieldValue("fullName", modalConfig.currentUser.fullName);
            form.setFieldValue("groups", modalConfig.currentUser.groups.map(o => (o.key)));
        } else {
            form.resetFields();
        }
        setErrorMessage(null);
    }, [modalConfig])

    const submitFormGroup = async () => {
        try {
            let user = await form.validate();
            if (user) {
                setLoadingAddGroupModal(true);
                try {
                    let res = null;
                    if (modalConfig.mode === 0) {
                        res = await authService.register({
                            ...user,
                            id: 0,
                            groups: form.getFieldValue("groups")?.map(g => ({key: g}))
                        });
                    } else {
                        res = await userService.update({
                            ...user,
                            groups: form.getFieldValue("groups")?.map(g => ({key: g}))
                        });
                    }
                    if (res.status === 200) {
                        Notification.success({
                            title: modalConfig.mode === 0 ? 'Add User' : 'Edit User',
                            content: 'Successfully!'
                        });
                        getUsers(pagination);
                        setAddGroupVisible(false);
                    }
                } catch (e) {
                    console.log(e.response.data)
                    setErrorMessage(I18n.t("errorCode."+e.response.data.details));
                    Notification.error({
                        title: modalConfig.mode === 0 ? 'Add User' : 'Edit User',
                        content: 'Failed!'
                    });
                } finally {
                    setLoadingAddGroupModal(false);
                }
            }
        } catch (e) {

        }
    }
    useEffect(() => {
        if (file && file.response) {
            form.setFieldValue("img", file.response.url);
        } else {
            form.setFieldValue("img", null);
        }
    }, [file])

    function onChangeTable(pagination, sorter) {
        const {current, pageSize} = pagination;
        setLoading(true);
        setTimeout(() => {
            if (pagination) {
                getUsers({...pagination, current, pageSize})
            }
            setLoading(false);
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
                        searchButton
                        onSearch={event => getUsers({...pagination, search: {username: event}})}
                    />
                    {selectedRowKeys.length > 0 && <Space style={{flex: 1}}>
                        <span>Selected {selectedRowKeys.length}</span>
                        <Button size='small'>Save</Button>
                        <Button size='small'>Delete</Button>
                    </Space>}
                    <Space style={{flex: 1}}>
                        {
                            selectedRowKeys.length > 0 && <Button size='default'>Delete</Button>
                        }
                        <Button size='default' type={"primary"}
                                onClick={e => setModalConfig({mode: 0, currentUser: null})}
                                icon={<i className="fa-solid fa-plus"/>}/>
                    </Space>
                </Space>
            </Grid.Col>
            <Grid.Col span={24}>
                <Table
                    // virtualized
                    scroll={{x: 1500, y: 590}}
                    border={{wrapper: true, cell: true}}
                    borderCell={true}
                    size={"default"}
                    stripe
                    loading={loading}
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
                        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 10, zIndex: 200}}>
                            {paginationNode}
                        </div>
                    )}
                />
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
                    >
                        <FormItem label='Id' hidden field='key'>
                            <Input placeholder=''/>
                        </FormItem>
                        <FormItem label='Username' field='username' rules={validateRules.username}>
                            <Input placeholder='' readOnly={modalConfig.mode === 1}/>
                        </FormItem>
                        <FormItem label='Name' field='fullName' rules={validateRules.fullName}>
                            <Input placeholder=''/>
                        </FormItem>
                        <FormItem label='Email' field='email' rules={validateRules.email}>
                            <Input placeholder=''/>
                        </FormItem>
                        <FormItem field='img' hidden>
                            <Input placeholder=''/>
                        </FormItem>
                        {modalConfig.mode === 0 &&
                        <FormItem label='Password' field='password'
                                  rules={modalConfig.mode === 0 ? validateRules.passwordAddUser : validateRules.password}>
                            <Input.Password placeholder='Keep with empty'/>
                        </FormItem>}
                        <FormItem
                            label='Groups'
                            field='groups'
                            rules={validateRules.groups}
                        >
                            <Select
                                showSearch
                                mode='multiple'
                                maxTagCount={2}
                                placeholder='please select'
                                options={groups.map(o => ({...o, label: o.groupName, value: o.key}))}
                                filterOption={((inputValue, option) => {
                                    return option.props.children.toLowerCase().includes(inputValue.toLowerCase());
                                })}
                            />
                        </FormItem>
                        <Grid.Row align='center'>
                            <Grid.Col span={6} align={"center"}>
                                {modalConfig.currentUser &&
                                <Img width={'80%'} style={{borderRadius: '50%'}} alt='avatar' preview={false}
                                     src={process.env.REACT_APP_BASE_URL + "/files" + "/" + modalConfig.currentUser?.img}/>}
                                <div style={{height: 20}}></div>
                            </Grid.Col>
                            <Grid.Col span={18}>
                                <Upload
                                    style={{width: '100%'}}
                                    listType='picture-card'
                                    multiple={false}
                                    limit={1}
                                    autoUpload={true}
                                    accept={"image/*"}
                                    onChange={(uploadItem, currentFile) => {
                                        if (uploadItem.length !== 0) {
                                            setFileAvatar({
                                                ...currentFile,
                                                url: URL.createObjectURL(currentFile.originFile),
                                            })
                                        }
                                    }}
                                    headers={{Authorization: `Bearer ${currentUser.accessToken}`}}
                                    action={UPLOAD_URL + "/avatar"}
                                    onPreview={file => {
                                        Modal.info({
                                            title: 'Preview',
                                            content: <div style={{textAlign: 'center'}}>
                                                <img style={{maxWidth: '100%'}}
                                                     src={file.url || URL.createObjectURL(file.originFile)}/>
                                            </div>,
                                            okText: "OK"
                                        })
                                    }}

                                    onRemove={file => {
                                        return new Promise((resolve, reject) => {
                                            Modal.confirm({
                                                title: 'Remove this avatar',
                                                content: `Remove ${file.name}`,
                                                onConfirm: () => {
                                                    fileService.removeFile(file.response.url);
                                                    resolve(true);
                                                    setFileAvatar(null);
                                                },
                                                onCancel: () => reject('cancel'),
                                            });
                                        });
                                    }}
                                    fileList={file ? [file] : []}
                                    beforeUpload={async (file) => {
                                        return new Promise((resolve) => {
                                            const modal = Modal.confirm({
                                                title: 'Upload Avatar',
                                                onCancel: () => {
                                                    resolve(false);
                                                    modal.close();
                                                },
                                                simple: false,
                                                width: 500,
                                                content: (
                                                    <Cropper
                                                        file={file}
                                                        onOk={(file) => {
                                                            resolve(file);
                                                            modal.close();
                                                        }}
                                                        onCancel={() => {
                                                            resolve(false);
                                                            modal.close();
                                                        }}
                                                    />
                                                ),
                                                footer: null,
                                            });
                                        });
                                    }}
                                >
                                    <div className={null}>
                                        {file && file.url ? (
                                            <div className='arco-upload-list-item-picture custom-upload-avatar'>
                                                <img src={file.url}/>
                                                <div className='arco-upload-list-item-picture-mask'>
                                                    <IconEdit/>
                                                </div>
                                                {file.status === 'uploading' && file.percent < 100 && <Progress
                                                    percent={file.percent}
                                                    type='circle'
                                                    size='mini'
                                                    style={{
                                                        position: 'absolute',
                                                        left: '50%',
                                                        top: '50%',
                                                        transform: 'translateX(-50%) translateY(-50%)'
                                                    }}
                                                />
                                                }
                                            </div>
                                        ) : (
                                            <div className='arco-upload-trigger-picture'>
                                                <div className='arco-upload-trigger-picture-text'>
                                                    <IconPlus/>
                                                    <div style={{marginTop: 10, fontWeight: 600}}>Upload Avatar</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Upload>
                                <Grid.Row align={"center"} style={{overflow: 'hidden', margin: '10px 0'}}>
                                    <Grid.Col align={"center"} span={24}>
                                        {errorMessage && <Alert type='error' content={errorMessage}/>}
                                    </Grid.Col>

                                </Grid.Row>
                            </Grid.Col>

                        </Grid.Row>

                        {/*<div style={{display: "flex", flexDirection: "row", justifyContent: "flex-end", marginTop: 15}}>*/}
                        {/*    <Transfer*/}
                        {/*        onChange={(newTargetKeys, direction, moveKeys) => {*/}
                        {/*            switch (direction) {*/}
                        {/*                case "target": {*/}
                        {/*                    if (newTargetKeys.length > 0) {*/}
                        {/*                        let temp = [...usersInGroup];*/}
                        {/*                        newTargetKeys.forEach(key => temp.push(key))*/}
                        {/*                        setUsersInGroup(temp)*/}
                        {/*                    }*/}
                        {/*                    break;*/}
                        {/*                }*/}
                        {/*                case "source": {*/}
                        {/*                    if (moveKeys.length > 0) {*/}
                        {/*                        let temp = [...usersInGroup];*/}
                        {/*                        moveKeys.forEach(key => {*/}
                        {/*                            temp.splice(temp.indexOf(key), 1);*/}
                        {/*                        })*/}
                        {/*                        setUsersInGroup(temp)*/}
                        {/*                    }*/}
                        {/*                    break;*/}
                        {/*                }*/}
                        {/*            }*/}
                        {/*        }}*/}
                        {/*        pagination*/}
                        {/*        showSearch*/}
                        {/*        dataSource={users}*/}
                        {/*        searchPlaceholder='Please select'*/}
                        {/*        targetKeys={usersInGroup}*/}
                        {/*        titleTexts={['All user', 'User in group']}*/}
                        {/*    />*/}
                        {/*</div>*/}
                    </Form>
                </Modal>
            </Grid.Col>


        </Grid.Row>
    );
}

async function _getCroppedImg(url, pixelCrop, rotation = 0) {
    const image = await new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.src = url;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx || !image) {
        return null;
    }
    const imageSize = 2 * ((Math.max(image.width, image.height) / 2) * Math.sqrt(2));
    canvas.width = imageSize;
    canvas.height = imageSize;

    if (rotation) {
        ctx.translate(imageSize / 2, imageSize / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-imageSize / 2, -imageSize / 2);
    }

    ctx.drawImage(image, imageSize / 2 - image.width / 2, imageSize / 2 - image.height / 2);
    const data = ctx.getImageData(0, 0, imageSize, imageSize);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
        data,
        Math.round(0 - imageSize / 2 + image.width * 0.5 - pixelCrop.x),
        Math.round(0 - imageSize / 2 + image.height * 0.5 - pixelCrop.y)
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        });
    });
}


const Cropper = (props) => {
    const {file, onOk} = props;
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [newFile, setNewFile] = useState(file);
    const [size, setSize] = useState(200);
    const url = React.useMemo(() => {
        return URL.createObjectURL(file);
    }, [file]);

    // useEffect(() => {
    //     if (file) {
    //         setCrop({x: 0, y: 0});
    //         setZoom(1)
    //     }
    // }, [file])

    return (
        <div>
            <div style={{width: '100%', height: 480, position: 'relative'}}>
                <EasyCropper
                    // style={{containerStyle: {width: '100%', height: 400}}}
                    cropSize={{width: size, height: size}}
                    cropShape={"rect"}
                    aspect={4 / 4}
                    image={url}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    onRotationChange={setRotation}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={async (_, pixels) => {
                        const blob = await _getCroppedImg(url || '', pixels, rotation);
                        if (blob) {
                            const newFile = new File([blob], file.name || 'image', {
                                type: file.type || 'image/*',
                            });
                            setNewFile(newFile);
                        }
                    }}
                />
            </div>
            <Grid.Row justify='space-between' style={{marginTop: 20, marginBottom: 20}}>
                <Grid.Row style={{flex: 1, marginLeft: 12, marginRight: 12}}>
                    <IconMinus
                        style={{marginRight: 10}}
                        onClick={() => {
                            setSize(Math.max(100, size - 20));
                        }}
                    />
                    <Slider
                        style={{flex: 1}}
                        step={20}
                        value={size}
                        onChange={(v) => {
                            setSize(v);
                        }}
                        min={100}
                        max={300}
                    />
                    <IconPlus
                        style={{marginLeft: 10}}
                        onClick={() => {
                            setSize(Math.min(300, zoom + 20));
                        }}
                    />
                </Grid.Row>

                <IconRotateLeft
                    onClick={() => {
                        setRotation(rotation - 90);
                    }}
                />
            </Grid.Row>

            <Grid.Row justify='end'>
                <Button onClick={props.onCancel} style={{marginRight: 20}}>
                    Cancel
                </Button>
                <Button
                    type='primary'
                    onClick={() => {
                        props.onOk(newFile);
                    }}
                >
                    Confirm
                </Button>
            </Grid.Row>
        </div>
    );
};

export default UserManager;
