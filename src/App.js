import './App.css';
import {ConfigProvider, Layout, Menu} from "@arco-design/web-react";
import {IconCalendar, IconCaretLeft, IconCaretRight, IconPlayArrow} from '@arco-design/web-react/icon';
import React, {useEffect, useState} from "react";
import FooterLayout from "./layout/footer";
import HeaderLayout from "./layout/header";
import {useDispatch, useSelector} from "react-redux";
import vn from "@arco-design/web-react/es/locale/vi-VN";
import jp from "@arco-design/web-react/es/locale/ja-JP";
import en from "@arco-design/web-react/es/locale/en-US";
import {Route, Routes, useNavigate} from 'react-router-dom'
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import Logout from "./components/logout";
import Profile from "./components/profile";
import Setting from "./components/setting";
import UserManager from "./components/user-manager";
import {useLocation} from "react-router";
import GroupManager from "./components/group-manager";
import Component403 from "./components/ui/compent403";

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
const Sider = Layout.Sider;
const Header = Layout.Header;
const Footer = Layout.Footer;
const Content = Layout.Content;
const localeObject = {
    vn: vn,
    en: en,
    jp: jp
}

const routes = [
    {
        key: "/dashboard",
        title: "Dashboard",
        icon: <i className="fa-solid fa-gauge" style={{marginRight: 16}}></i>,
        child: [
            {key: '0-1', title: "Dashboard1", icon: <IconCalendar/>, child: []},
            {key: '0-2', title: "Dashboard2", icon: <IconCalendar/>, child: []},
        ]
    },
    {key: 1, title: "Home", icon: <IconPlayArrow/>, child: []},
    {key: "/users", title: "Users", icon: <i className="fa-solid fa-users" style={{marginRight: 16}}></i>, child: []},
    {
        key: "/groups",
        title: "Groups",
        icon: <i className="fa-solid fa-people-roof " style={{marginRight: 16}}></i>,
        child: []
    },
]

function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const configProvider = useSelector(state => state.configProvider);
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user.currentUser)
    const handleCollapsed = () => {
        setCollapsed(!collapsed);
    }


    const renderMenuItem = (item) => {
        return item.child.length > 0 ? <SubMenu
            key={item.key}
            title={
                <span>
                    {item.icon}
                    {item.title}
                </span>
            }
        >
            {item.child.map(ob => (renderMenuItem(ob)))}
        </SubMenu> : <MenuItem key={item.key}>
            {item.icon}
            {item.title}
        </MenuItem>
    }

    useEffect(() => {
        if (currentUser) {
            navigate(location.pathname !== "/logout" ? location.pathname : "/", {replace: true})
        }
    }, [currentUser]);
    const navigateTo = (key) => {
        navigate(key, {replace: true})
    }
    return (
        <ConfigProvider locale={localeObject[configProvider.locale]} size={configProvider.size}>
            <Layout className='main-layout'>
                <Header>
                    <div className={"header-container"}>
                        <HeaderLayout/>
                    </div>
                </Header>
                {currentUser ? <Layout>
                    <Sider collapsed={collapsed}
                           onCollapse={handleCollapsed}
                           collapsible
                           trigger={collapsed ? <IconCaretRight/> : <IconCaretLeft/>} breakpoint='xl'
                           width={320}>
                        {/*<div className='logo'/>*/}
                        <Menu
                            defaultOpenKeys={['1']}
                            defaultSelectedKeys={['0_3']}
                            onClickMenuItem={(key) =>
                                navigateTo(key)
                            }
                            accordion={false}
                            style={{width: '100%'}}
                        >
                            {routes.map(route => (renderMenuItem(route)))}
                        </Menu>
                    </Sider>

                    <Layout>
                        <Content style={{overflow: "auto !important"}}>
                            <Routes>}
                                {privateRoute(["ROLE_ADMIN"],currentUser.roles,"/dashboard",<Dashboard/>)}
                                <Route path='/' element={<Dashboard/>}/>
                                <Route path='/setting' element={<Setting/>}/>
                                {/*<Route path='/login' element={<Login/>}/>*/}
                                <Route path='/profile' element={<Profile/>}/>
                                <Route path='/logout' element={<Logout/>}/>
                                <Route path='/users' element={<UserManager/>}/>
                                <Route path='/groups' element={<GroupManager/>}/>
                            </Routes>
                        </Content>
                        <Footer>
                            <FooterLayout/>
                        </Footer>
                    </Layout>
                </Layout> : <Login/>}


            </Layout>
        </ConfigProvider>
    );
}

function privateRoute(roles, userRoles, path, element) {
    if (roles.length > 0) {
        const intersection = roles.filter(val=>userRoles.includes(val));
        if (intersection.length !== 0) {
            return <Route path={path} element={element}/>
        }
    }
    return <Route path={path} element={<Component403/>} />

}

export default App;
