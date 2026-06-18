import React, { useState } from 'react'
import { Select, Card } from 'antd'
import { Column } from '@ant-design/charts'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import * as OrderService from '../../services/OrderService'
import { WrapperHeader } from './style'

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

    const formatMoney = (value) => {
        return `${Number(value || 0).toLocaleString('vi-VN')} đ`
    }

    const formatMoneyShort = (value) => {
        const num = Number(value || 0)

        if (num >= 1000000000) {
            return `${(num / 1000000000).toFixed(1)} tỷ`
        }

        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(0)} triệu`
        }

        return num.toLocaleString('vi-VN')
    }

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

        return `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`
    }

    const getSortValue = (date) => {
        const d = new Date(date)

        if (type === 'day') {
            return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
        }

        if (type === 'week') {
            const firstDay = new Date(d.getFullYear(), 0, 1)
            const days = Math.floor((d - firstDay) / (24 * 60 * 60 * 1000))
            const week = Math.ceil((days + firstDay.getDay() + 1) / 7)
            return d.getFullYear() * 100 + week
        }

        return d.getFullYear() * 100 + d.getMonth() + 1
    }

    const revenueMap = {}

    const orders = order?.data || []

    orders
        .filter(item => item.IsPaid)
        .forEach(item => {
            const label = getLabel(item.CreatedAt)
            const sortValue = getSortValue(item.CreatedAt)

            if (!revenueMap[label]) {
                revenueMap[label] = {
                    key: label,
                    label,
                    sortValue,
                    totalOrders: 0,
                    revenue: 0
                }
            }

            revenueMap[label].totalOrders += 1
            revenueMap[label].revenue += Number(item.TotalPrice || 0)
        })

    const dataChart = Object.values(revenueMap).sort(
        (a, b) => a.sortValue - b.sortValue
    )

    const totalRevenue = dataChart.reduce(
        (sum, item) => sum + item.revenue,
        0
    )

    const totalOrders = dataChart.reduce(
        (sum, item) => sum + item.totalOrders,
        0
    )

    const chartConfig = {
        data: dataChart,
        xField: 'label',
        yField: 'revenue',
        height: 360,
        autoFit: true,
        columnWidthRatio: 0.35,

        label: {
            text: (datum) => formatMoney(datum.revenue),
            position: 'top',
            style: {
                fontSize: 12,
                fontWeight: 600
            }
        },

        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false
            }
        },

        yAxis: {
            label: {
                formatter: (value) => formatMoneyShort(value)
            }
        },

        tooltip: {
            formatter: (datum) => {
                return {
                    name: 'Doanh thu',
                    value: formatMoney(datum.revenue)
                }
            }
        },

        meta: {
            label: {
                alias: 'Thời gian'
            },
            revenue: {
                alias: 'Doanh thu'
            }
        }
    }

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
                <Card style={{ flex: 1, borderRadius: '12px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '8px' }}>
                        Tổng doanh thu
                    </div>
                    <div style={{ fontSize: '24px', color: '#1677ff', fontWeight: 700 }}>
                        {formatMoney(totalRevenue)}
                    </div>
                </Card>

                <Card style={{ flex: 1, borderRadius: '12px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '8px' }}>
                        Tổng đơn hàng đã thanh toán
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>
                        {totalOrders}
                    </div>
                </Card>
            </div>

            <Card
                title="Biểu đồ doanh thu"
                style={{
                    marginTop: '20px',
                    borderRadius: '12px'
                }}
            >
                {dataChart.length > 0 ? (
                    <Column {...chartConfig} />
                ) : (
                    <div
                        style={{
                            height: '260px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999'
                        }}
                    >
                        Chưa có dữ liệu doanh thu
                    </div>
                )}
            </Card>
        </div>
    )
}

export default AdminRevenue