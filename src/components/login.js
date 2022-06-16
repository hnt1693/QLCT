import React, {useState} from 'react';
import {Card, Grid, Image, Space} from '@arco-design/web-react';
import {Form, Input, Checkbox, Button, Radio,Notification} from '@arco-design/web-react';
import PropTypes from 'prop-types';
import {IconPlayArrow, IconUnlock, IconUser} from "@arco-design/web-react/icon";
import './login.css'
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../redux/user-slice";
import Loading from "./loading";
import authService from '../service/auth-service'

const FormItem = Form.Item;
const RadioGroup = Radio.Group

const Row = Grid.Row;
const Col = Grid.Col;


Login.propTypes = {};

function Login(props) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const currentUser = useSelector(state => state.user.currentUser);

    const handleLogin = async (e) => {
        setLoading(true);
        try {
            let res = await authService.login(e);
            if (res.status === 200) {
                setTimeout(() => {
                    setLoading(false)
                    dispatch(setUser(res.data));
                    Notification.success({ title: 'LOGIN', content: 'This is a success Notification!' });
                }, 3000)
            }
        } catch (e) {
            setTimeout(() => {

                console.log(e.response)
                setLoading(false);
                Notification.error({ title: 'LOGIN', content: e.response.data.message });
            }, 3000)
        }

    }


    return (
        <div className={"login-container"}>
            {loading && <Loading backdrop/>}
            <Row style={{marginBottom: 16, height: '80vh'}} align='center' justify='center'>
                <Col span={5}>
                    <div className={"login-form"}>
                        <div className={"img-container"}>
                            <img src={"https://ps.w.org/login-customizer/assets/icon-256x256.png?rev=2455454"}
                                 width={150}/>
                        </div>
                        <Form onSubmit={e => handleLogin(e)}>
                            <Space wrap direction={"vertical"}>
                                <FormItem field='username' rules={[{required: true, message: "Required"}]} hasFeedback>
                                    <Input placeholder='please enter your name' prefix={<IconUser/>}/>
                                </FormItem>
                                <FormItem field={"password"}
                                          rules={[{required: true, message: "Required"}]}>
                                    <Input.Password prefix={<IconUnlock/>}
                                    />
                                </FormItem>
                                {/*<FormItem wrapperCol={{offset: 5}}>*/}
                                {/*    <Checkbox>I have read the manual</Checkbox>*/}
                                {/*</FormItem>*/}
                                <FormItem>
                                    <Button type='primary' htmlType='submit'>LOGIN</Button>
                                </FormItem>
                            </Space>

                        </Form>
                    </div>
                </Col>


            </Row>

        </div>
    );
}

export default Login;
