import './App.css';
import {
    Badge,
    Breadcrumb,
    Button,
    Empty,
    Layout,
    Menu,
    Message,
    PageHeader,
    Popover,
    Radio, Space
} from "@arco-design/web-react";
import {IconCalendar, IconCaretLeft, IconCaretRight, IconHome, IconNotification} from '@arco-design/web-react/icon';
import {useEffect, useState} from "react";
import Avatar from "@arco-design/web-react/es/Avatar/avatar";
import FooterLayout from "./layout/footer";
import HeaderLayout from "./layout/header";
import {initLocaleEvent} from "./common/event";

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
const Sider = Layout.Sider;
const Header = Layout.Header;
const Footer = Layout.Footer;
const Content = Layout.Content;

function App() {
    const [collapsed, setCollapsed] = useState(false);
    const handleCollapsed = () => {
        setCollapsed(!collapsed);
    }

    useEffect(() => {
        initLocaleEvent();
        return (() => {

        })
    }, [])
    return (
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
                    <Content>Content</Content>
                    <Footer>
                        <FooterLayout/>
                    </Footer>
                </Layout>
            </Layout>

        </Layout>
    );
}

export default App;
