import './App.css';
import {ConfigProvider, Layout, Menu, Message, Pagination} from "@arco-design/web-react";
import {IconCalendar, IconCaretLeft, IconCaretRight, IconHome} from '@arco-design/web-react/icon';
import React, {useEffect, useState} from "react";
import FooterLayout from "./layout/footer";
import HeaderLayout from "./layout/header";
import {initLocaleEvent} from "./common/event";
import {Provider, useDispatch, useSelector} from "react-redux";
import vn from "@arco-design/web-react/es/locale/vi-VN";
import jp from "@arco-design/web-react/es/locale/ja-JP";
import en from "@arco-design/web-react/es/locale/en-US";
import Radio from "@arco-design/web-react/es/Radio";
import {setSize} from "./redux/config-provider-slice";

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
const Sider = Layout.Sider;
const Header = Layout.Header;
const Footer = Layout.Footer;
const Content = Layout.Content;
const RadioGroup = Radio.Group
const localeObject = {
    vn: vn,
    en: en,
    jp: jp
}

function App() {
    const [collapsed, setCollapsed] = useState(false);
    const configProvider = useSelector(state => state.configProvider);
    const dispatch  = useDispatch();
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
                    <HeaderLayout/>
                </Header>
                <Layout>
                    <Sider collapsed={collapsed}
                           onCollapse={handleCollapsed}
                           collapsible
                           trigger={collapsed ? <IconCaretRight/> : <IconCaretLeft/>} breakpoint='xl'
                           width={350}>
                        <div className='logo'/>
                        <Menu
                            defaultOpenKeys={['1']}
                            defaultSelectedKeys={['0_3']}
                            onClickMenuItem={(key) =>
                                Message.info({content: `You select ${key}`, showIcon: true})
                            }

                            style={{width: '100%'}}
                        >
                            <MenuItem key='0_1' disabled>
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
                            <Pagination
                                total={200}
                                showTotal
                                sizeCanChange
                                style={{marginBottom: 20, marginRight: 40, minWidth: 550}}
                            />

                            <RadioGroup
                                type='button'
                                name='lang'
                                defaultValue='Guangzhou'
                                style={{marginRight: 20, marginBottom: 20}}
                                onChange={value => dispatch(setSize(value))}
                            >
                                <Radio value='mini'>Beijing</Radio>
                                <Radio value='tiny'>Shanghai</Radio>
                                <Radio value='default'>
                                    Guangzhou
                                </Radio>
                                <Radio value='large'>Shenzhen</Radio>
                            </RadioGroup>
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
