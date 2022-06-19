import React, {useRef} from 'react';
import {
    Badge,
    Button,
    Image,
    Menu,
    PageHeader,
    Popover,
    Space,
    Switch,
    Tooltip,
    Typography
} from "@arco-design/web-react";
import {IconExport, IconNotification, IconSettings, IconSun, IconUser} from "@arco-design/web-react/icon";

import Avatar from "@arco-design/web-react/es/Avatar/avatar";
import './header.css'
import {GB, JP, VN, CN} from 'country-flag-icons/react/3x2'
import {emitLocaleEvent} from "../common/event";
import {useDispatch, useSelector} from "react-redux";
import {setDarkMode, setLocale} from "../redux/config-provider-slice";
import {Link, useNavigate} from "react-router-dom";

HeaderLayout.propTypes = {};
const IMAGE_URL = process.env.REACT_APP_BASE_URL + "/files"
const locales = [
    {key: "vn", value: "Vietnamese", icon: <VN className={"ac"} style={{height: 12}}/>},
    {key: "en", value: "English", icon: <GB className={"ac"} style={{height: 12}}/>},
    {key: "jp", value: "Japanese", icon: <JP className={"ac"} style={{height: 12}}/>},
    {key: "cn", value: "China", icon: <CN className={"ac"} style={{height: 12}}/>},
]

const userMenus = [
    {
        key: "/profile",
        title: "Profile",
        icon: <i className="fa-solid fa-bell" style={{marginRight: 5}}></i>,
        requiredLogin: true
    },
    {
        key: "/setting",
        title: "Setting",
        icon: <i className="fa-solid fa-gears" style={{marginRight: 5}}></i>,
        requiredLogin: true
    },
    {
        key: "/logout",
        title: "Logout",
        icon: <i className="fa-solid fa-right-from-bracket" style={{color: "red", marginRight: 5}}></i>,
        requiredLogin: true
    },
    {
        key: "/login",
        title: "Login",
        icon: <i className="fa-solid fa-arrow-right-to-bracket" style={{color: "green", marginRight: 5}}></i>,
        requiredLogin: false,
        roles: ["ADMIN"]
    },
];

function HeaderLayout(props) {
    let navigate = useNavigate();
    const locale = useSelector(state => state.configProvider.locale);
    const currentUser = useSelector(state => state.user.currentUser);
    const darkMode = useSelector(state => state.configProvider.darkMode);
    const dispatch = useDispatch();
    const languageMenuRef = useRef();
    const userMenuRef = useRef();

    const handleLocaleChange = (e) => {
        emitLocaleEvent(e)
        dispatch(setLocale(e));
        languageMenuRef.current.click();
    }
    const handleUserMenuSelected = (key) => {
        navigate(key, {replace: true});
        userMenuRef.current.click();
    }
    const handleChangeDarkMode = (value) => {
        dispatch(setDarkMode(value))
    }

    const languageMenu =
        <Menu style={{width: 200}} onClickMenuItem={handleLocaleChange}>
            {locales.map((l, index) => (
                <Menu.Item key={l.key} className={l.key === locale ? 'arco-menu-selected' : ''}>
                    {l.icon}
                    <label style={{marginLeft: 10}}>  {l.value}</label>
                </Menu.Item>))}

        </Menu>

    const userMenu =
        <Menu style={{width: 200}} onClickMenuItem={handleUserMenuSelected}>
            {userMenus.filter(l => {
                if (currentUser) {
                    return l.requiredLogin
                } else {
                    return !l.requiredLogin
                }
            }).map((l, index) => (
                <Menu.Item key={l.key}>
                    {l.icon}
                    <label style={{marginLeft: 0, fontWeight: 500}}>  {l.title}</label>
                </Menu.Item>))}
        </Menu>;

    const renderNotification = (notifications) => {
        return <div style={{width: 300}}>
            <Typography.Title heading={6} style={{paddingLeft: 10}}>Notifications</Typography.Title>
            {notifications.map((nt, id) => (
                <div className={"notify-item"} key={id}>
                    <Space direction={"horizontal"} align={"center"}>
                        <Badge status={nt.seen ? 'success' : 'error'}/>
                        <Typography.Text className={"notify-from"}>{nt.from}</Typography.Text>
                    </Space>
                    <Typography.Text className={"notify-msg"}>{nt.msg}</Typography.Text>
                    <Typography.Text type={"primary"} style={{fontSize: 12, textAlign: "right"}}>09:00:12
                        12/12/2012</Typography.Text>
                </div>

            ))}
            <Link to={"/notification"} replace>
                <Typography.Text type={"primary"} style={{textAlign: "center", display: 'block'}}>View
                    more</Typography.Text>
            </Link>
        </div>

    }
    const notis = [
        {
            from: 'System',
            msg: "Message Center is a web-based console that lets you view and manage messages quarantined as spam. Depending on the settings the administrator selects, ...",
            seen: true
        },
        {from: 'System', msg: "Please activated this account", seen: false},
        {
            from: 'System',
            msg: "Message Center is a web-based console that lets you view and manage messages quarantined as spam. Depending on the settings the administrator selects, ...",
            seen: false
        },
    ]
    return (
        <PageHeader
            style={{background: 'var(--color-neutral-2)', borderBottom: 'solid 1px rgb(225 224 224)'}}
            title='ArcoDesign'
            subTitle='This is a description'
            extra={
                <div className={'header-container'}>
                    <Space>
                        {currentUser &&
                        <Popover position='br' content={renderNotification(notis)}
                                 trigger={'click'}>
                            <Badge count={9} dot dotStyle={{width: 6, height: 6}}>
                                <Button type='secondary' style={{backgroundColor: 'var(--color-fill-4)'}} shape='circle'
                                        icon={<i className="fa-solid fa-bell"></i>}/>
                            </Badge>
                        </Popover>}

                        <Tooltip position='br' trigger='hover' content={`Dark mode ${darkMode ? 'on' : 'off'}`}>
                            <Switch checkedText={<i className="fa-solid fa-moon"></i>} uncheckedText={<i
                                className="fa-solid fa-sun"></i>}
                                    onChange={handleChangeDarkMode}/>
                        </Tooltip>

                        <Popover position='br' content={languageMenu} trigger={'click'}>
                            <Button ref={languageMenuRef} type='secondary' shape='circle'
                                    style={{backgroundColor: 'var(--color-fill-4)'}}
                            >{locales.find(l => l.key === locale).icon}</Button>
                        </Popover>


                        <Popover position='br' content={userMenu} trigger={'click'}>
                            <Avatar ref={userMenuRef} style={{cursor: "pointer"}}>
                                <Image src={IMAGE_URL + "/" + currentUser?.img}/>
                            </Avatar>
                        </Popover>
                        {currentUser && <div className={"user-info-container"}>
                            <Typography.Text bold style={{fontSize: 14}} type={darkMode ? "secondary" : "primary"}>
                                {currentUser.fullName}
                            </Typography.Text>
                            <Typography.Text style={{fontSize: 10, textOverflow: 'ellipsis', maxWidth: 120}}>
                                {currentUser.email || 'hnt1693@gmail.com'}
                            </Typography.Text>
                        </div>}

                    </Space>
                </div>
            }
        />
    );
}

export default HeaderLayout;
