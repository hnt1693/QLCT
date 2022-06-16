import {useState, useEffect} from 'react';
import {Table, Space, Button, Grid, Popconfirm, Message, Input} from '@arco-design/web-react';
import {IconDelete, IconEdit, IconTool} from "@arco-design/web-react/icon";

const InputSearch = Input.Search;
const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        sorter: (a,b)=> 0,
    },
    {
        title: 'Salary',
        dataIndex: 'salary',
    },
    {
        title: 'Address',
        dataIndex: 'address',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: '',
        dataIndex: 'key',
        render: (key) => <Space>
            <Button type='primary' status={"success"} size={"small"} icon={<IconEdit/>} onClick={e => alert(key)}/>

            <Popconfirm
                position={"bottom"}
                title='Are you sure you want to delete?'
                onOk={() => {
                    Message.info({content: 'ok'});
                }}
                onCancel={() => {
                    Message.error({content: 'cancel'});
                }}
            >
                <Button type='primary' status={"danger"} size={"small"} icon={<IconDelete/>}/>
            </Popconfirm>
            <Button type='primary' status={"default"} size={"small"} icon={<IconTool/>} onClick={e => alert(key)}/>
        </Space>,
    }
];

const allData = Array(200)
    .fill('12')
    .map((_, index) => ({
        key: `${index}`,
        name: `Kevin Sandra ${index}`,
        salary: 22000,
        address: `${index} Park Road, London`,
        email: `kevin.sandra_${index}@example.com`,
    }));
UserManager.propTypes = {};

function UserManager(props) {
    const [data, setData] = useState(allData);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [pagination, setPagination] = useState({
        sizeCanChange: true,
        showTotal: true,
        total: 96,
        pageSize: 10,
        current: 1,
        pageSizeChangeResetCurrent: true,
    });
    const [loading, setLoading] = useState(false);

    function onChangeTable(pagination,sorter) {
        const {current, pageSize} = pagination;
        setLoading(true);
        setTimeout(() => {
            setData(allData.slice((current - 1) * pageSize, current * pageSize));
            setPagination((pagination) => ({
                ...pagination,
                current,
                pageSize,
            }));
            setLoading(false);
        }, 1000);
    }

    return (
        <Grid.Row justify="center" style={{margin: 10}}>
            <Grid.Col span={24} style={{marginBottom: 10}}>
                <Space style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <InputSearch
                        allowClear
                        placeholder='Enter keyword to search'
                        style={{width: 350}}
                        searchButton
                        onSearch={event => console.log(event)}
                    />
                    {selectedRowKeys.length > 0 && <Space style={{flex: 1}}>
                        <span>Selected {selectedRowKeys.length}</span>
                        <Button size='small'>Save</Button>
                        <Button size='small'>Delete</Button>
                    </Space>}
                </Space>
            </Grid.Col>
            <Grid.Col span={24}>
                <Table
                    size={"default"}
                    stripe
                    loading={loading}
                    columns={columns}
                    data={data}
                    pagination={pagination}
                    pagePosition={"br"}
                    onChange={onChangeTable}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectedRowKeys(selectedRowKeys);
                        },
                    }}
                    renderPagination={(paginationNode) => (
                        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 10}}>
                            {paginationNode}
                        </div>
                    )}
                />
            </Grid.Col>


        </Grid.Row>
    );
}

export default UserManager;