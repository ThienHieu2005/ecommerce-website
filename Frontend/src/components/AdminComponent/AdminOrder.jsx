import { WrapperHeader } from './style'
import TableComponent from '../TableComponent/TableComponent'
import * as OrderService from '../../services/OrderService'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Space, Button, Input, Form, Select, Tag } from 'antd'
import { SearchOutlined, EditOutlined } from '@ant-design/icons'
import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModelComponent'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as message from '../Message/Message'

const AdminOrder = () => {
    const user = useSelector((state) => state.user)

    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [orderDetail, setOrderDetail] = useState(null)

    const searchInput = useRef(null)
    const [formUpdate] = Form.useForm()
    const queryClient = useQueryClient()

    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user.access_token)
        return res
    }

    const { data: order } = useQuery({
        queryKey: ['order'],
        queryFn: getAllOrder,
        enabled: !!user?.access_token
    })

    const mutationUpdate = useMutationHooks((data) => {
        const { id, ...rest } = data
        return OrderService.updateOrder(id, rest, user.access_token)
    })

    const {
        data: dataUpdated,
        isSuccess: isSuccessUpdated,
        isError: isErrorUpdated
    } = mutationUpdate

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success()
            setIsOpenDrawer(false)
            mutationUpdate.reset()
            queryClient.invalidateQueries(['order'])
        } else if (isErrorUpdated) {
            message.error()
        }
    }, [isSuccessUpdated, isErrorUpdated, dataUpdated])

    useEffect(() => {
        if (orderDetail) {
            formUpdate.setFieldsValue(orderDetail)
        }
    }, [orderDetail, formUpdate])

    const handleDetailOrder = (record) => {
        setRowSelected(record.key)
        setOrderDetail(record)
        setIsOpenDrawer(true)
    }

    const onUpdateOrder = () => {
        const values = formUpdate.getFieldsValue()

        mutationUpdate.mutate({
            id: rowSelected,
            isDelivered: values.isDelivered
        })
    }

    const handleSearch = (selectedKeys, confirm) => {
        confirm()
    }

    const handleReset = (clearFilters, confirm) => {
        clearFilters()
        confirm()
    }

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={`${selectedKeys[0] || ''}`}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => handleSearch(selectedKeys, confirm)}
                    style={{ marginBottom: 8, display: 'block' }}
                />

                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>

                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters, confirm)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),

        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#0066ff' : undefined }} />
        ),

        onFilter: (value, record) =>
            (record[dataIndex] ?? '')
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
    })

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'key',
            sorter: (a, b) => a.key - b.key,
            ...getColumnSearchProps('key')
        },
        {
            title: 'User ID',
            dataIndex: 'userId',
            sorter: (a, b) => a.userId - b.userId,
        },
        {
            title: 'Phone',
            dataIndex: 'shippingPhone',
            ...getColumnSearchProps('shippingPhone')
        },
        {
            title: 'Address',
            dataIndex: 'shippingAddress',
            ...getColumnSearchProps('shippingAddress')
        },
        {
            title: 'City',
            dataIndex: 'shippingCity',
            ...getColumnSearchProps('shippingCity')
        },
        {
            title: 'Payment',
            dataIndex: 'paymentMethod',
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            render: (value) => `${Number(value).toLocaleString('vi-VN')} đ`
        },
        {
            title: 'Paid',
            dataIndex: 'isPaid',
            render: (v) =>
                v ? <Tag color="green">YES</Tag> : <Tag color="red">NO</Tag>
        },
        {
            title: 'Delivered',
            dataIndex: 'isDelivered',
            render: (v) =>
                v ? <Tag color="green">YES</Tag> : <Tag color="red">NO</Tag>
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => (
                <EditOutlined
                    style={{ fontSize: '28px', cursor: 'pointer' }}
                    onClick={() => handleDetailOrder(record)}
                />
            )
        }
    ]

    const dataTable = (order?.data || []).map((order) => ({
        key: order.Id,
        userId: order.UserId,
        shippingFullName: order.ShippingFullName,
        shippingPhone: order.ShippingPhone,
        shippingAddress: order.ShippingAddress,
        shippingCity: order.ShippingCity,
        isPaid: order.IsPaid,
        isDelivered: order.IsDelivered,
        paymentMethod: order.PaymentMethod,
        itemsPrice: order.ItemsPrice,
        shippingPrice: order.ShippingPrice,
        totalPrice: order.TotalPrice,
        paidAt: order.PaidAt,
        deliveredAt: order.DeliveredAt,
        createdAt: order.CreatedAt
    }))

    return (
        <div>
            <WrapperHeader>Quản lý Đơn hàng</WrapperHeader>

            <div style={{ marginTop: '50px' }}>
                <TableComponent
                    columns={columns}
                    data={dataTable}
                    onRow={(record) => ({
                        onClick: () => {
                            setRowSelected(record.key)
                        }
                    })}
                />
            </div>

            <ModalComponent
                title="Chi tiết đơn hàng"
                isOpen={isOpenDrawer}
                onCancel={() => setIsOpenDrawer(false)}
            >
                {orderDetail && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <b>Mã đơn hàng:</b> #{orderDetail.key}
                            </div>

                            <div>
                                <b>User ID:</b> {orderDetail.userId}
                            </div>

                            <div>
                                <b>Người nhận:</b> {orderDetail.shippingFullName}
                            </div>

                            <div>
                                <b>Số điện thoại:</b> {orderDetail.shippingPhone}
                            </div>

                            <div>
                                <b>Địa chỉ:</b> {orderDetail.shippingAddress}, {orderDetail.shippingCity}
                            </div>

                            <div>
                                <b>Phương thức thanh toán:</b> {orderDetail.paymentMethod}
                            </div>

                            <div>
                                <b>Tiền sản phẩm:</b>{' '}
                                {Number(orderDetail.itemsPrice || 0).toLocaleString('vi-VN')} đ
                            </div>

                            <div>
                                <b>Phí vận chuyển:</b>{' '}
                                {Number(orderDetail.shippingPrice || 0).toLocaleString('vi-VN')} đ
                            </div>

                            <div>
                                <b>Tổng tiền:</b>{' '}
                                <span style={{ color: '#1677ff', fontWeight: 700 }}>
                                    {Number(orderDetail.totalPrice || 0).toLocaleString('vi-VN')} đ
                                </span>
                            </div>

                            <div>
                                <b>Ngày đặt:</b>{' '}
                                {orderDetail.createdAt
                                    ? new Date(orderDetail.createdAt).toLocaleString('vi-VN')
                                    : ''}
                            </div>
                        </div>

                        <Form
                            form={formUpdate}
                            layout="vertical"
                            onFinish={onUpdateOrder}
                            style={{ marginTop: '30px' }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    marginTop: '24px'
                                }}
                            >
                                <span
                                    style={{
                                        minWidth: '180px',
                                        fontWeight: 600
                                    }}
                                >
                                    Trạng thái thanh toán:
                                </span>

                                {orderDetail.isPaid ? (
                                    <Tag color="green">Đã thanh toán</Tag>
                                ) : (
                                    <Tag color="red">Chưa thanh toán</Tag>
                                )}
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    marginTop: '16px'
                                }}
                            >
                                <span
                                    style={{
                                        minWidth: '180px',
                                        fontWeight: 600
                                    }}
                                >
                                    Trạng thái giao hàng:
                                </span>

                                <Form.Item
                                    name="isDelivered"
                                    style={{ marginBottom: 0, flex: 1 }}
                                >
                                    <Select
                                        options={[
                                            { value: true, label: 'Đã giao' },
                                            { value: false, label: 'Chưa giao' }
                                        ]}
                                    />
                                </Form.Item>
                            </div>

                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{
                                    marginTop: '24px',
                                    borderRadius: '6px',
                                    fontWeight: 500
                                }}
                            >
                                Lưu thay đổi
                            </Button>
                        </Form>
                    </>
                )}
            </ModalComponent>
        </div>
    )
}

export default AdminOrder