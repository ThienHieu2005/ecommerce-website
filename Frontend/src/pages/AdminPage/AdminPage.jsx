import React, { useState } from 'react'
import { Menu } from 'antd'
import {
    AppstoreOutlined,
    UserOutlined,
    FileDoneOutlined,
    BarChartOutlined
} from '@ant-design/icons'

import AdminUser from '../../components/AdminComponent/AdminUser'
import AdminProduct from '../../components/AdminComponent/AdminProduct'
import AdminOrder from '../../components/AdminComponent/AdminOrder'
import AdminRevenue from '../../components/AdminComponent/AdminRevenue'

const AdminPage = () => {
    const items = [
        {
            key: 'user',
            icon: <UserOutlined />,
            label: 'Người dùng'
        },
        {
            key: 'product',
            icon: <AppstoreOutlined />,
            label: 'Sản phẩm'
        },
        {
            key: 'order',
            icon: <FileDoneOutlined />,
            label: 'Đơn hàng'
        },
        {
            key: 'revenue',
            icon: <BarChartOutlined />,
            label: 'Thống kê'
        }
    ]

    const [keySelected, setKeySelected] = useState('user')

    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return <AdminUser />
            case 'product':
                return <AdminProduct />
            case 'order':
                return <AdminOrder />
            case 'revenue':
                return <AdminRevenue />
            default:
                return <AdminUser />
        }
    }

    return (
        <div style={{ display: 'flex' }}>
            <Menu
                style={{
                    width: 256,
                    height: '100vh',
                    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.08)',
                    borderRight: 'none'
                }}
                items={items}
                selectedKeys={[keySelected]}
                onClick={({ key }) => setKeySelected(key)}
            />

            <div style={{ flex: 1, padding: '15px' }}>
                {renderPage(keySelected)}
            </div>
        </div>
    )
}

export default AdminPage