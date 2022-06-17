import React from 'react';
import {Form, Input, Button, Checkbox, Typography, Space} from '@arco-design/web-react';

import PropTypes from 'prop-types';

GroupForm.propTypes = {

};
const FormItem = Form.Item;
function GroupForm(props) {
    return (
        <div>
            <Typography.Title heading={5} style={{marginTop:0}}>CREATE NEW GROUP</Typography.Title>
            <Form >
                <Space direction={"vertical"}>
                    <FormItem label='Name' field={"groupName"} rules={[{required:true,message:"Vui lòng nhập"}]}>
                        <Input placeholder='please enter group name...' />
                    </FormItem>
                    <FormItem label='Regex' field={"regex"}>
                        <Input placeholder='Identify group role...' />
                    </FormItem>
                    <FormItem
                        wrapperCol={{
                            offset: 5,
                        }}
                    >
                        <Space>
                            <Button type='primary' htmlType='submit' size={"default"}>Submit</Button>
                            <Button type='secondary' size={"default"}>Cancel</Button>
                        </Space>

                    </FormItem>
                </Space>

            </Form>
        </div>
    );
}

export default GroupForm;