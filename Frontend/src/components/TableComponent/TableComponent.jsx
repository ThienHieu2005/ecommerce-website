import React from 'react';
import { Table } from 'antd';

const TableComponent = (props) => {
    const {
        data = [],
        columns = [],
        onRow,
        rowKey = 'key',
        pagination = {
            pageSize: 10,
            showSizeChanger: false,
        },
        scroll
    } = props;

    return (
        <Table
            columns={columns}
            dataSource={data}
            onRow={onRow}
            rowKey={rowKey}
            scroll={scroll}
            pagination={pagination}
        />
    );
};

export default TableComponent;