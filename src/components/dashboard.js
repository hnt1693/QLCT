import React from 'react';
import {useSelector} from "react-redux";
import {Alert, Calendar, Card, Grid, Space, Timeline, Typography} from "@arco-design/web-react";
import {IconCheck} from "@arco-design/web-react/icon";

Dashboard.propTypes = {};

function Dashboard(props) {
    const currentUser = useSelector(state => state.user.currentUser)
    return (
        <Grid.Row justify="center" className={"dashboard"} style={{margin: 10}}>
            <Grid.Col span={18}>
                <Space>
                    {[1,2,3].map((ob,idx)=>renderCard(ob))}
                </Space>
                </Grid.Col>
            <Grid.Col span={5}>
                <Space direction={"vertical"} style={{width:'100%'}}>
                    <Alert
                        type='info'
                        title='Info'
                        content='Here is an info text'
                    />
                    <div style={{maxHeight: '800px', overflow: 'auto'}}>
                        <Calendar
                            panel
                            panelWidth={'100%'}
                            headerType='select'
                            defaultValue='2020-04-01'
                        />
                    </div>
                    <Timeline style={{ marginRight: 40 }} mode={"right"}>
                        <Timeline.Item
                            label='2020-04-12'
                            dot={
                                <IconCheck
                                    style={{ fontSize: 12, padding: 2, boxSizing: 'border-box', borderRadius: '50%', backgroundColor: 'var(--color-primary-light-1)' }}
                                />
                            }
                        >
                            The first milestone
                        </Timeline.Item>
                        <Timeline.Item
                            label='2020-05-17'
                            dot={
                                <IconCheck
                                    style={{ fontSize: 12, padding: 2, boxSizing: 'border-box', borderRadius: '50%', backgroundColor: 'var(--color-primary-light-1)' }}
                                />
                            }
                        >
                            The second milestone
                        </Timeline.Item>
                        <Timeline.Item label='2020-06-22'>The third milestone</Timeline.Item>
                        <Timeline.Item label='2020-06-22' dotColor='var(--color-fill-4)'>
                            The third milestone
                        </Timeline.Item>
                    </Timeline>
                </Space>

            </Grid.Col>

        </Grid.Row>
    );
}

function renderCard(info){
    return <Card style={{flex:1}}>
        132123
    </Card>

}

export default Dashboard;
