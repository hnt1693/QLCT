import './App.css';
import {ConfigProvider, Layout, Menu} from "@arco-design/web-react";
import {IconCaretLeft, IconCaretRight} from '@arco-design/web-react/icon';
import React, {useEffect, useState} from "react";
import FooterLayout from "./layout/footer";
import HeaderLayout from "./layout/header";
import {useDispatch, useSelector} from "react-redux";
import vn from "@arco-design/web-react/es/locale/vi-VN";
import jp from "@arco-design/web-react/es/locale/ja-JP";
import en from "@arco-design/web-react/es/locale/en-US";
import cn from "@arco-design/web-react/es/locale/zh-CN";
import {Route, Routes, useNavigate} from 'react-router-dom'
import Login from "./components/login";
import Logout from "./components/logout";
import {useLocation} from "react-router";
import Component403 from "./components/ui/compent403";
import menuService from './service/menu-service'
import {combineRoutes} from "./common/routes";
import Component404 from "./components/ui/component404";
import {getUserInfo} from "./redux/user-slice";
import {setLocale, I18n} from 'react-redux-i18n';
import userService from './service/user-service'
import {setConfig} from "./redux/config-provider-slice";

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
const Sider = Layout.Sider;
const Header = Layout.Header;
const Footer = Layout.Footer;
const Content = Layout.Content;
const localeObject = {
    vn: vn,
    en: en,
    jp: jp,
    cn: cn
}


function App() {

    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [menu, setMenu] = useState([]);
    const configProvider = useSelector(state => state.configProvider);
    const i18n = useSelector(state => state.i18n);
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user.currentUser);
    const handleCollapsed = () => {
        setCollapsed(!collapsed);
    }


    const renderMenuItem = (item) => {
        if (!item.activated) return;

        if(item.roles.length>0){
            const intersection = item?.roles.filter(val => currentUser?.roles.includes(val));
            if(intersection.length===0) return ;
        }


        return item.children.length > 0 ? <SubMenu
            key={item.path}
            title={
                <span>
                    <i className={item.icon} style={{marginRight: 16}}></i>
                    {item.title}
                </span>
            }
        >
            {item.children.map(ob => (renderMenuItem(ob)))}
        </SubMenu> : <MenuItem key={item.path}>
            <i className={item.icon} style={{marginRight: 16}}></i>
            {item.title}
        </MenuItem>
    }

    const loadMenu = async () => {
        const res = await menuService.getMenus(null);
        if (res.status === 200) {
            setMenu(combineRoutes(res.data.data));
        }
    }

    useEffect(() => {
        loadMenu();
        if (currentUser) {
            getUserInfoApp();
        }
    }, [])

    useEffect(()=>{
        if(currentUser){
            dispatch(setConfig(currentUser.config))
        }

    },[currentUser])


    useEffect(() => {
        if (configProvider.locale) {
            dispatch(setLocale(configProvider.locale));
        }
        if (configProvider && currentUser) {
            userService.updateConfig(configProvider);
        }
    }, [configProvider])


    const getUserInfoApp = async () => {
        dispatch(getUserInfo());
    }

    useEffect(() => {
        if (currentUser) {
            navigate(location.pathname !== "/logout" && location.pathname !== "/login" ? location.pathname : "/dashboard", {replace: true})
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
                            {menu.map(route => (renderMenuItem(route)))}
                        </Menu>
                    </Sider>

                    <Layout>
                        <Content style={{overflow: "auto !important"}}>
                            <Routes>
                                {menu.map((m, index) =>
                                    privateRoute(m.roles, currentUser.roles, m.path, m.element)
                                )}
                                <Route path='/login' element={<Login/>}/>
                                <Route path='/logout' element={<Logout/>}/>
                                <Route path='*' element={<Component404/>}/>
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


function privateRoute(roles, userRoles, path, element, i18n) {

    if (roles.length > 0) {
        const intersection = roles.filter(val => userRoles.includes(val));
        if (intersection.length !== 0) {
            return <Route path={path} element={element} key={path}/>
        }
    } else {
        return <Route path={path} element={element} key={path}/>
    }
    return <Route key={path} path={path} element={<Component403/>}/>

}

export default App;
