import React, { useState } from 'react'
import { Select, Card } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import * as OrderService from '../../services/OrderService'
import { WrapperHeader } from './style'
import TableComponent from '../TableComponent/TableComponent'

const AdminRevenue = () => {
    const user = useSelector((state) => state.user)
    const [type, setType] = useState('month')

    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user.access_token)
        return res
    }

    const { data: order } = useQuery({
        queryKey: ['order-revenue'],
        queryFn: getAllOrder,
        enabled: !!user?.access_token
    })

    const getLabel = (date) => {
        const d = new Date(date)

        if (type === 'day') {
            return d.toLocaleDateString('vi-VN')
        }

        if (type === 'week') {
            const firstDay = new Date(d.getFullYear(), 0, 1)
            const days = Math.floor((d - firstDay) / (24 * 60 * 60 * 1000))
            const week = Math.ceil((days + firstDay.getDay() + 1) / 7)
            return `Tuần ${week}/${d.getFullYear()}`
        }

        return `${d.getMonth() + 1}/${d.getFullYear()}`
    }

    const revenueMap = {}

        ; (order?.data || [])
            .filter(item => item.IsPaid)
            .forEach(item => {
                const label = getLabel(item.CreatedAt)

                if (!revenueMap[label]) {
                    revenueMap[label] = {
                        key: label,
                        label,
                        totalOrders: 0,
                        revenue: 0
                    }
                }

                revenueMap[label].totalOrders += 1
                revenueMap[label].revenue += Number(item.TotalPrice || 0)
            })

    const dataTable = Object.values(revenueMap)

    const totalRevenue = dataTable.reduce(
        (sum, item) => sum + item.revenue,
        0
    )

    const totalOrders = dataTable.reduce(
        (sum, item) => sum + item.totalOrders,
        0
    )

    const columns = [
        {
            title: 'Thời gian',
            dataIndex: 'label'
        },
        {
            title: 'Số đơn hàng',
            dataIndex: 'totalOrders'
        },
        {
            title: 'Doanh thu',
            dataIndex: 'revenue',
            render: (value) => `${Number(value || 0).toLocaleString('vi-VN')} đ`
        }
    ]

    return (
        <div>
            <WrapperHeader>Thống kê doanh thu</WrapperHeader>

            <div
                style={{
                    marginTop: '30px',
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >

                <Select
                    value={type}
                    style={{ width: 200 }}
                    onChange={(value) => setType(value)}
                    options={[
                        { value: 'day', label: 'Theo ngày' },
                        { value: 'week', label: 'Theo tuần' },
                        { value: 'month', label: 'Theo tháng' }
                    ]}
                />
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <Card style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '8px' }}>
                        Tổng doanh thu
                    </div>
                    <div style={{ fontSize: '24px', color: '#1677ff', fontWeight: 700 }}>
                        {totalRevenue.toLocaleString('vi-VN')} đ
                    </div>
                </Card>

                <Card style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '8px' }}>
                        Tổng đơn hàng
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>
                        {totalOrders}
                    </div>
                </Card>
            </div>

            <TableComponent
                columns={columns}
                data={dataTable}
                pagination={{
                    pageSize: 5,
                    showSizeChanger: false
                }}
            />
        </div>
    )
}

export default AdminRevenue