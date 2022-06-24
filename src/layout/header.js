import React, {useRef} from 'react';
import {
    Alert,
    Badge,
    Button,
    Image,
    Menu,
    PageHeader,
    Popover,
    Space,
    Switch, Tag,
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
import {Link, useNavigate, createSearchParams} from "react-router-dom";
import {I18n} from 'react-redux-i18n';

HeaderLayout.propTypes = {};
const IMAGE_URL = process.env.REACT_APP_BASE_URL + "/files"
const locales = [
    {key: "vn", value: "Vietnamese", icon: <VN className={"ac"} style={{height: 12}}/>},
    {key: "en", value: "English", icon: <GB className={"ac"} style={{height: 12}}/>},
    {key: "jp", value: "Japanese", icon: <JP className={"ac"} style={{height: 12}}/>},
    {key: "cn", value: "China", icon: <CN className={"ac"} style={{height: 12}}/>},
]


function HeaderLayout(props) {
    let navigate = useNavigate();
    const locale = useSelector(state => state.configProvider.locale);
    const currentUser = useSelector(state => state.user.currentUser);
    const darkMode = useSelector(state => state.configProvider.darkMode);
    const dispatch = useDispatch();
    const languageMenuRef = useRef();
    const userMenuRef = useRef();
    const notifyMenuRef = useRef();

    const userMenus = [
        {
            key: "/profile",
            title: I18n.t("header.userMenu.profile"),
            icon: <i className="fa-solid fa-bell" style={{marginRight: 5}}></i>,
            requiredLogin: true
        },
        {
            key: "/setting",
            title: I18n.t("header.userMenu.setting"),
            icon: <i className="fa-solid fa-gears" style={{marginRight: 5}}></i>,
            requiredLogin: true
        },
        {
            key: "/logout",
            title: I18n.t("header.userMenu.logout"),
            icon: <i className="fa-solid fa-right-from-bracket" style={{color: "red", marginRight: 5}}></i>,
            requiredLogin: true
        },
        {
            key: "/login",
            title: I18n.t("header.userMenu.login"),
            icon: <i className="fa-solid fa-arrow-right-to-bracket" style={{color: "green", marginRight: 5}}></i>,
            requiredLogin: false,
            roles: ["ADMIN"]
        },
    ];

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
        <Menu style={{minWidth: 200}} onClickMenuItem={handleUserMenuSelected}>
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

            <Typography.Title heading={6}
                              className={"notify-title"}
                              style={{padding: 10, margin: 0, color: "white"}}
            >
                <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                    Notifications
                    <Tag color='rgb(181 65 29)' style={{marginLeft: 10}}>
                        50+
                    </Tag>
                </div>


            </Typography.Title>

            {notifications.map((nt, id) => (
                <div className={"notify-item"} key={id}
                     onClick={e => {
                         notifyMenuRef.current.click();
                         navigate({
                             pathname: "/notifications",
                             search: createSearchParams({
                                 key: nt.key
                             }).toString()
                         })
                     }
                     }>
                    <Space direction={"horizontal"} align={"center"}>
                        <Badge status={nt.seen ? 'success' : 'error'}/>
                        <Typography.Text className={"notify-from"} style={{fontWeight:600}}>{nt.from}</Typography.Text>
                    </Space>
                    <Typography.Text className={"notify-msg"}>{nt.msg}</Typography.Text>
                    <Typography.Text type={"primary"} style={{fontSize: 12, textAlign: "right"}}>09:00:12
                        12/12/2012</Typography.Text>
                </div>

            ))}
            <Button type={"primary"}
                    status={"default"}
                    size={"large"}
                    onClick={e => {
                        notifyMenuRef.current.click();
                        navigate("/notifications", {replace: true});

                    }}
                    style={{width: '100%'}}>
                View more
            </Button>

        </div>

    }
    const notis = [
        {
            key: 1,
            from: 'System',
            msg: "Message Center is a web-based console that lets you view and manage messages quarantined as spam. Depending on the settings the administrator selects, ...",
            seen: true
        },
        {key: 2, from: 'System', msg: "Please activated this account", seen: false},
        {
            key: 3,
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
                        <Popover position='br' className={"notify-popover"}
                                 content={renderNotification(notis)}
                                 trigger={'click'}
                        >
                            <Badge count={9}
                                   dot
                                   dotStyle={{width: 6, height: 6}}
                                   ref={notifyMenuRef}>
                                <Button type='secondary'
                                        style={{backgroundColor: 'var(--color-fill-4)'}}
                                        shape='circle'
                                        icon={<i className="fa-solid fa-bell"></i>}/>
                            </Badge>
                        </Popover>}

                        <Tooltip position='br'
                                 trigger='hover'
                                 content={darkMode ? I18n.t("header.darkMode.off") : I18n.t("header.darkMode.on")}>
                            <Switch checked={darkMode}
                                    checkedText={<i className="fa-solid fa-moon"></i>}
                                    uncheckedText={<i className="fa-solid fa-sun"></i>}
                                    onChange={handleChangeDarkMode}/>
                        </Tooltip>

                        <Popover position='br'
                                 content={languageMenu}
                                 trigger={'click'}>
                            <Button ref={languageMenuRef}
                                    type='secondary'
                                    shape='circle'
                                    style={{backgroundColor: 'var(--color-fill-4)'}}>
                                {locales.find(l => l.key === locale).icon}
                            </Button>
                        </Popover>

                        <Popover position='br'
                                 content={userMenu}
                                 trigger={'click'}>
                            <Avatar ref={userMenuRef}
                                    style={{cursor: "pointer"}}>
                                <Image width={160}
                                       style={{borderRadius: '50%'}}
                                       alt='avatar'
                                       preview={false}
                                       src={IMAGE_URL + "/" + currentUser?.img}/>
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
