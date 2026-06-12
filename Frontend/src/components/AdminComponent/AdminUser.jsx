import { WrapperHeader } from './style'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import TableComponent from '../../components/TableComponent/TableComponent'
import { Button, Form, Input, Upload, Select, Space } from 'antd'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as message from "../../components/Message/Message"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import ModalComponent from '../ModalComponent/ModelComponent'
import { SearchOutlined, UploadOutlined } from '@ant-design/icons'
import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

const AdminUser = () => {
    const currentUser = useSelector((state) => state.user)

    const [rowSelected, setRowSelected] = useState('')
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)

    const searchInput = useRef(null)
    const [formUpdate] = Form.useForm()
    const queryClient = useQueryClient()

    const [stateUserDetail, setStateUserDetail] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        isAdmin: '',
        avatar: '',
    })

    const getAllUsers = async () => {
        const res = await UserService.getAllUser(currentUser.access_token)
        return res
    }

    const { data: usersData } = useQuery({
        queryKey: ['users'],
        queryFn: getAllUsers,
        enabled: !!currentUser?.access_token
    })

    const mutationUpdate = useMutationHooks((data) => {
        const { id, ...rest } = data
        return UserService.updateUser(id, rest, currentUser.access_token)
    })

    const mutationDeleted = useMutationHooks((data) => {
        const { id } = data
        return UserService.deleteUser(id, currentUser.access_token)
    })

    const {
        data: dataUpdated,
        isSuccess: isSuccessUpdated,
        isError: isErrorUpdated
    } = mutationUpdate

    const {
        data: dataDeleted,
        isSuccess: isSuccessDeleted,
        isError: isErrorDelete
    } = mutationDeleted

    const fetchGetDetailsUser = async (rowSelected) => {
        const res = await UserService.getDetailUser(
            rowSelected,
            currentUser.access_token
        )

        if (res?.data) {
            setStateUserDetail({
                name: res?.data?.Name,
                email: res?.data?.Email,
                phone: res?.data?.Phone,
                address: res?.data?.Address,
                isAdmin: res?.data?.IsAdmin,
                avatar: res?.data?.Avatar
            })
        }
    }

    useEffect(() => {
        formUpdate.setFieldsValue(stateUserDetail)
    }, [formUpdate, stateUserDetail])

    useEffect(() => {
        if (rowSelected && currentUser?.access_token) {
            fetchGetDetailsUser(rowSelected)
        }
    }, [rowSelected, currentUser?.access_token])

    const handleDetailUser = () => {
        if (rowSelected) {
            fetchGetDetailsUser(rowSelected)
            setIsOpenDrawer(true)
        }
    }

    const renderAction = () => {
        return (
            <div style={{ display: "flex", gap: '10px' }}>
                <DeleteOutlined
                    style={{ fontSize: '30px', color: 'red', cursor: 'pointer' }}
                    onClick={() => setIsModalOpenDelete(true)}
                />

                <EditOutlined
                    style={{ fontSize: '30px', cursor: 'pointer' }}
                    onClick={handleDetailUser}
                />
            </div>
        )
    }

    const handleSearch = (selectedKeys, confirm) => {
        confirm()
    }

    const handleReset = (clearFilters, confirm) => {
        clearFilters()
        confirm()
    }

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters
        }) => (
            <div
                style={{ padding: 8 }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={`${selectedKeys[0] || ''}`}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />

                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>

                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters, confirm)
                        }
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),

        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),

        onFilter: (value, record) =>
            (record[dataIndex] ?? '')
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),

        filterDropdownProps: {
            onOpenChange: (visible) => {
                if (visible) {
                    setTimeout(() => searchInput.current?.select(), 100)
                }
            }
        }
    })

    const columns = [
        {
            title: 'User ID',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            render: text => <a>{text}</a>,
            sorter: (a, b) =>
                String(a.name ?? '').length - String(b.name ?? '').length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            ...getColumnSearchProps('email')
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            ...getColumnSearchProps('phone')
        },
        {
            title: 'Address',
            dataIndex: 'address',
            ...getColumnSearchProps('address')
        },
        {
            title: 'IsAdmin',
            dataIndex: 'isAdmin',

            render: (value) => value ? 'TRUE' : 'FALSE',

            filters: [
                {
                    text: 'Admin',
                    value: true,
                },
                {
                    text: 'User',
                    value: false,
                },
            ],

            onFilter: (value, record) => {
                return record.isAdmin === value;
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: () => renderAction()
        }
    ]

    const dataTable = (usersData?.data || []).map((user) => ({
        key: user.Id,
        id: user.Id,
        name: user.Name,
        email: user.Email,
        phone: user.Phone,
        address: user.Address,
        isAdmin: user.IsAdmin
    }))

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteUser = () => {
        mutationDeleted.mutate({ id: rowSelected })
    }

    const handleCloserDrawer = () => {
        setIsOpenDrawer(false)
        formUpdate.resetFields()
        setStateUserDetail({
            name: '',
            email: '',
            phone: '',
            address: '',
            isAdmin: '',
            avatar: '',
        })
    }

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success()
            handleCloserDrawer()
            mutationUpdate.reset()
            queryClient.invalidateQueries(['users'])
        } else if (isErrorUpdated) {
            message.error()
        }
    }, [isSuccessUpdated, isErrorUpdated, dataUpdated])

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success()
            setIsModalOpenDelete(false)
            mutationDeleted.reset()
            queryClient.invalidateQueries(['users'])
        } else if (isErrorDelete) {
            message.error()
        }
    }, [isSuccessDeleted, isErrorDelete, dataDeleted])

    const handleOnChangeDetail = (e) => {
        setStateUserDetail({
            ...stateUserDetail,
            [e.target.name]: e.target.value
        })
    }

    const onUpdateUser = () => {
        mutationUpdate.mutate({
            id: rowSelected,
            ...stateUserDetail
        })
    }

    const handleOnChangeImageDetail = async ({ fileList }) => {
        const file = fileList[0]

        if (!file) return

        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)

            setStateUserDetail({
                ...stateUserDetail,
                avatar: file.preview
            })
        }
    }

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = (error) => reject(error)
        })
    }

    return (
        <div>
            <WrapperHeader>Quản lý Người dùng</WrapperHeader>

            <div style={{ marginTop: '50px' }}>
                <TableComponent
                    columns={columns}
                    data={dataTable}
                    onRow={(record) => {
                        return {
                            onClick: () => {
                                setRowSelected(record.key)
                            }
                        }
                    }}
                />
            </div>

            <ModalComponent
                title="Chi tiết người dùng"
                isOpen={isOpenDrawer}
                onCancel={handleCloserDrawer}
                footer={null}
            >
                <Form
                    name="basic"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 19 }}
                    requiredMark={false}
                    style={{
                        width: '100%',
                        maxWidth: 950,
                        margin: '0 auto'
                    }}
                    autoComplete="off"
                    onFinish={onUpdateUser}
                    form={formUpdate}
                >
                    <Form.Item
                        label={<span style={{ fontWeight: 600 }}>Name</span>}
                        name="name"
                        rules={[
                            { required: true, message: 'Please input your name!' }
                        ]}
                    >
                        <Input onChange={handleOnChangeDetail} name="name" />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ fontWeight: 600 }}>Email</span>}
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập email!'
                            },
                            {
                                type: 'email',
                                message: 'Email không đúng định dạng!'
                            }
                        ]}
                    >
                        <Input
                            onChange={handleOnChangeDetail}
                            name="email"
                            placeholder="Ví dụ: hieu@gmail.com"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ fontWeight: 600 }}>Phone</span>}
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số điện thoại!'
                            },
                            {
                                pattern: /^(0[0-9]{9})$/,
                                message: 'Số điện thoại phải có 10 số và bắt đầu bằng 0!'
                            }
                        ]}
                    >
                        <Input
                            onChange={handleOnChangeDetail}
                            name="phone"
                            maxLength={10}
                            placeholder="Ví dụ: 0987654321"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ fontWeight: 600 }}>Address</span>}
                        name="address"
                        rules={[
                            { required: true, message: 'Please input your address!' }
                        ]}
                    >
                        <Input onChange={handleOnChangeDetail} name="address" />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ fontWeight: 600 }}>IsAdmin</span>}
                        name="isAdmin"
                        rules={[
                            { required: true, message: 'Please select isAdmin!' }
                        ]}
                    >
                        <Select
                            onChange={(value) =>
                                setStateUserDetail({
                                    ...stateUserDetail,
                                    isAdmin: value
                                })
                            }
                            options={[
                                { value: true, label: 'TRUE' },
                                { value: false, label: 'FALSE' }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ fontWeight: 600 }}>Image</span>}
                        name="image"
                    >
                        <div style={{ display: 'flex', gap: '50px' }}>
                            <Upload
                                showUploadList={false}
                                onChange={handleOnChangeImageDetail}
                                maxCount={1}
                                beforeUpload={() => false}
                            >
                                <Button icon={<UploadOutlined />}>
                                    Select File
                                </Button>
                            </Upload>

                            {stateUserDetail.avatar && (
                                <img
                                    src={stateUserDetail.avatar}
                                    alt="avatar"
                                    style={{
                                        height: '80px',
                                        width: '80px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '2px solid #ccc'
                                    }}
                                />
                            )}
                        </div>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 10, span: 18 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginTop: '30px' }}
                        >
                            Sửa
                        </Button>
                    </Form.Item>
                </Form>
            </ModalComponent>

            <ModalComponent
                title="Xóa người dùng"
                isOpen={isModalOpenDelete}
                onCancel={handleCancelDelete}
                onOk={handleDeleteUser}
            >
                <div>Bạn có chắc Xóa người dùng này không?</div>
            </ModalComponent>
        </div>
    )
}

export default AdminUser