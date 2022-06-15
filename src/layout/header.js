import React, {useRef} from 'react';
import {Badge, Button, Dropdown, Empty, Icon, Menu, PageHeader, Popover, Space} from "@arco-design/web-react";
import {IconNotification} from "@arco-design/web-react/icon";
import Avatar from "@arco-design/web-react/es/Avatar/avatar";
import './header.css'
import {GB, JP, VN} from 'country-flag-icons/react/3x2'
import {emitLocaleEvent} from "../common/event";
import {useDispatch, useSelector} from "react-redux";
import {setLocale} from "../redux/config-provider-slice";

HeaderLayout.propTypes = {};

const locales = [
    {key: "vn", value: "Vietnamese", icon: <VN className={"ac"} style={{height: 12}}/>},
    {key: "en", value: "English", icon: <GB className={"ac"} style={{height: 12}}/>},
    {key: "jp", value: "Japanese", icon: <JP className={"ac"} style={{height: 12}}/>},
]
const IconFont = Icon.addFromIconFontCn({src: '//at.alicdn.com/t/font_180975_ue66sq60vyd.js'});

function HeaderLayout(props) {

    const locale = useSelector(state => state.configProvider.locale)
    const dispatch = useDispatch();
    const languageMenuRef = useRef();
    const content = <div style={{width: 300}}><Empty/></div>;



    const handleLocaleChange = (e) => {
        emitLocaleEvent(e)
        dispatch(setLocale(e));
        languageMenuRef.current.click();
    }


    const languageMenu =
        <Menu style={{width: 200}} onClickMenuItem={handleLocaleChange}>
            {locales.map((l, index) => (
                <Menu.Item key={l.key} className={l.key === locale ? 'arco-menu-selected' : ''}>
                    {l.icon}
                    <label style={{marginLeft: 10}}>  {l.value}</label>
                </Menu.Item>))}

        </Menu>

    const userMenu = <div style={{width: 300}}>
        User Menu
    </div>;


    return (
        <PageHeader
            style={{background: 'var(--color-neutral-2)'}}
            title='ArcoDesign'
            subTitle='This is a description'
            extra={
                <div className={'header-container'}>
                    <Space size={"default"}>
                        <Popover position='br' title='Notifications' content={content} trigger={'click'}>
                            <Badge count={9} dot dotStyle={{width: 10, height: 10}}>
                                <Button type='default' shape='circle' icon={<IconNotification fontSize={20}/>}/>
                            </Badge>
                        </Popover>

                        <Popover position='br' content={languageMenu} trigger={'click'}>
                            <Button ref={languageMenuRef} type='secondary' shape='circle'
                            >{locales.find(l => l.key === locale).icon}</Button>
                        </Popover>

                        <Popover position='br' content={userMenu} trigger={'click'}>
                            <Avatar style={{cursor: "pointer"}}>AVT</Avatar>
                        </Popover>

                    </Space>
                </div>
            }
        />
    );
}

export default HeaderLayout;
