import './App.css';
import {ConfigProvider, Layout, Menu, Message} from "@arco-design/web-react";
import {IconCalendar, IconCaretLeft, IconCaretRight, IconHome} from '@arco-design/web-react/icon';
import React, {useEffect, useState} from "react";
import FooterLayout from "./layout/footer";
import HeaderLayout from "./layout/header";
import {useDispatch, useSelector} from "react-redux";
import vn from "@arco-design/web-react/es/locale/vi-VN";
import jp from "@arco-design/web-react/es/locale/ja-JP";
import en from "@arco-design/web-react/es/locale/en-US";
import {Route, Routes} from 'react-router-dom'
import Login from "./components/login";
import Dashboard from "./components/dashboard";

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
    {key: 0, title: "Dashboard", icon: null, child: []},
    {key: 1, title: "Dashboard", icon: null, child: []},
    {key: 2, title: "Dashboard", icon: null, child: []},


]

function App() {
    const [collapsed, setCollapsed] = useState(false);
    const configProvider = useSelector(state => state.configProvider);
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user.currentUser)
    const handleCollapsed = () => {
        setCollapsed(!collapsed);
    }

    useEffect(() => {
        return (() => {

        })
    }, [])
    return (
        <ConfigProvider locale={localeObject[configProvider.locale]} size={configProvider.size}>
            <Layout className='main-layout'>
                <Header>
                    <div className={"header-container"}>
                        <HeaderLayout/>
                    </div>
                </Header>
                <Layout>
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
                                Message.info({content: `You select ${key}`, showIcon: true})
                            }
                            style={{width: '100%'}}
                        >
                            <MenuItem key='0_1'>
                                <IconHome/>
                                Menu 1
                            </MenuItem>
                            <MenuItem key='0_2'>
                                <IconCalendar/>
                                Menu 2
                            </MenuItem>
                            <MenuItem key='0_3'>
                                <IconCalendar/>
                                Menu 3
                            </MenuItem>
                            <SubMenu
                                key='1'
                                title={
                                    <span>
                              <IconCalendar/>
                              Navigation 1
                            </span>
                                }
                            >
                                <MenuItem key='1_1'>Menu 1</MenuItem>
                                <MenuItem key='1_2'>Menu 2</MenuItem>
                                <SubMenu key='2' title='Navigation 2'>
                                    <MenuItem key='2_1'>Menu 1</MenuItem>
                                    <MenuItem key='2_2'>Menu 2</MenuItem>
                                </SubMenu>
                                <SubMenu key='3' title='Navigation 3'>
                                    <MenuItem key='3_1'>Menu 1</MenuItem>
                                    <MenuItem key='3_2'>Menu 2</MenuItem>
                                    <MenuItem key='3_3'>Menu 3</MenuItem>
                                </SubMenu>
                            </SubMenu>
                            <SubMenu
                                key='4'
                                title={
                                    <span>
                              <IconCalendar/>
                              Navigation 4
                            </span>
                                }
                            >
                                <MenuItem key='4_1'>Menu 1</MenuItem>
                                <MenuItem key='4_2'>Menu 2</MenuItem>
                                <MenuItem key='4_3'>Menu 3</MenuItem>
                            </SubMenu>
                        </Menu>
                    </Sider>

                    <Layout>
                        <Content>
                            <Routes>
                                <Route path='/' element={<Dashboard/>}/>
                                <Route path='/setting' element={<Login/>}/>
                                <Route path='/login' element={<Login/>}/>
                                <Route path='/profile' element={<Login/>}/>
                            </Routes>
                        </Content>
                        <Footer>
                            <FooterLayout/>
                        </Footer>
                    </Layout>
                </Layout>

            </Layout>
        </ConfigProvider>
    );
}

export default App;
