import React, { useState } from 'react'
import { WrapperHeader, WrapperButton, WrapperDrawerForm } from './style'
import { UserAddOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import TableComponent from '../../components/TableComponent/TableComponent';
import { UploadOutlined } from '@ant-design/icons';
import * as ProductService from '../../services/ProductService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import { useEffect } from 'react';
import * as message from "../../components/Message/Message";
import { useQuery } from '@tanstack/react-query'
import ModalComponent from '../ModalComponent/ModelComponent'
import { useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Modal, Form, Input, Upload, Select } from 'antd';
import { useSelector } from 'react-redux'
const AdminProduct = () => {
    const [rowSelected, setRowSelected] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [isCustomType, setIsCustomType] = useState(false)
    const [stateProduct, setStateProduct] = useState({
        name: '',
        price: '',
        description: '',
        rating: '',
        image: '',
        type: '',
        discount: '',
        countInStock: ''
    })
    const [stateProductDetail, setStateProductDetail] = useState({
        name: '',
        price: '',
        description: '',
        rating: '',
        image: '',
        type: '',
        discount: '',
        countInStock: ''
    })
    const [form] = Form.useForm();
    const [formUpdate] = Form.useForm();
    const queryClient = useQueryClient()
    const currentUser = useSelector((state) => state.user)
    const mutation = useMutationHooks((data) => {
        const {
            name,
            price,
            description,
            rating,
            image,
            type,
            countInStock,
            discount
        } = data

        return ProductService.createProduct(
            {
                name,
                price,
                description,
                rating,
                image,
                type,
                countInStock,
                discount
            },
            currentUser.access_token
        )
    })
    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, ...rest } = data
            return ProductService.updateProduct(id, rest, currentUser.access_token)
        }
    )
    const mutationDeleted = useMutationHooks(
        (data) => {
            const { id } = data
            return ProductService.deleteProduct(id, currentUser.access_token)
        }
    )
    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }
    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        return res?.data
    }

    const { data, isLoading, isSuccess, isError } = mutation
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate;
    const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDelete } = mutationDeleted;
    const { data: products } = useQuery({ queryKey: ['products'], queryFn: getAllProducts })
    const { data: typeProducts } = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct })



    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailProduct(rowSelected)
        if (res?.data) {
            setStateProductDetail({
                name: res?.data?.Name,
                price: res?.data?.Price,
                description: res?.data?.Description,
                rating: res?.data?.Rating,
                image: res?.data?.Image,
                type: res?.data?.Type,
                discount: res?.data?.Discount,
                countInStock: res?.data?.CountInStock
            })
        }
    }


    useEffect(() => {
        formUpdate.setFieldsValue(stateProductDetail)
    }, [formUpdate, stateProductDetail])
    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailsProduct(rowSelected)
        }
    }, [rowSelected])


    const hadleDetailProduct = () => {

        if (rowSelected) {
            fetchGetDetailsProduct(rowSelected)
            setIsOpenDrawer(true)
        }

    }
    const renderAction = () => {
        return (
            <div style={{ display: "flex", gap: '10px' }}>
                <DeleteOutlined style={{ fontSize: '30px', color: 'red', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ fontSize: '30px', cursor: 'pointer' }} onClick={hadleDetailProduct} />
            </div>
        )
    }


    const handleChangeSelect = (value) => {
        if (value === 'other') {
            setIsCustomType(true)
            setStateProduct({
                ...stateProduct,
                type: ''
            })
        } else {
            setIsCustomType(false)
            setStateProduct({
                ...stateProduct,
                type: value
            })
        }
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };
    const handleReset = (clearFilters, confirm) => {
        clearFilters();
        confirm();
        setSearchedColumn('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={`${selectedKeys[0] || ''}`}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
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
            <SearchOutlined
                style={{
                    color: filtered ? '#0066ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            (record[dataIndex] ?? '').toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: text => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            filters: [
                {
                    text: 'Dưới 5 triệu',
                    value: 'under5',
                },
                {
                    text: '5 - 20 triệu',
                    value: '5to20',
                },
                {
                    text: 'Trên 20 triệu',
                    value: 'over20',
                },
            ],

            onFilter: (value, record) => {
                if (value === 'under5') {
                    return record.price < 5000000;
                }

                if (value === '5to20') {
                    return record.price >= 5000000 &&
                        record.price <= 20000000;
                }

                return record.price > 20000000;
            },
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: (a, b) => a.rating - b.rating,

            filters: [
                {
                    text: '4 sao trở lên',
                    value: '>=4',
                },
                {
                    text: 'Dưới 4 sao',
                    value: '<4',
                },
            ],

            onFilter: (value, record) => {
                if (value === '>=4') {
                    return record.rating >= 4;
                }

                return record.rating < 4;
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
            ...getColumnSearchProps('type')
        },
        {
            title: 'CountInStock',
            dataIndex: 'countInStock',

            filters: [
                {
                    text: 'Còn dưới 20 sản phẩm',
                    value: 'under20',
                },
            ],

            onFilter: (value, record) => {
                if (value === 'under20') {
                    return record.countInStock < 20;
                }
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: () => renderAction()
        }
    ];

    const dataTable = (products?.data || []).map((product) => ({
        key: product.Id,
        name: product.Name || '',
        price: Number(product.Price) || 0,
        type: product.Type || '',
        rating: Number(product.Rating) || 0,
        countInStock: Number(product.CountInStock) || 0
    }));





    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields()
        setStateProduct({
            name: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            type: '',
            discount: '',
            countInStock: ''
        })
    };

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    }
    const handleDeleteProduct = () => {
        mutationDeleted.mutate({ id: rowSelected })
    }
    const handleCloserDrawer = () => {
        setIsOpenDrawer(false);
        formUpdate.resetFields()
        setStateProductDetail({
            name: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            type: '',
            discount: '',
            countInStock: ''
        })
    };

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success();
            handleCancel();
            mutation.reset();
            queryClient.invalidateQueries(['products'])
        } else if (isError) {
            message.error();
        }

    }, [isSuccess, isError, data, handleCancel]);

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success();
            handleCloserDrawer();
            mutationUpdate.reset()
            queryClient.invalidateQueries(['products'])
        } else if (isErrorUpdated) {
            message.error();
        }

    }, [isSuccessUpdated, isErrorUpdated, data, handleCloserDrawer]);

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success();
            setIsModalOpenDelete(false);
            mutationDeleted.reset()
            queryClient.invalidateQueries(['products'])
        } else if (isErrorDelete) {
            message.error();
        }

    }, [isSuccessDeleted, isErrorDelete, dataDeleted,]);
    const onFinish = () => {
        mutation.mutate({
            ...stateProduct,
            price: Number(stateProduct.price),
            rating: Number(stateProduct.rating),
            countInStock: parseInt(stateProduct.countInStock),
            discount: Number(stateProduct.discount) // int
        })
    }


    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })

    }
    const handleOnChangeDetail = (e) => {
        setStateProductDetail({
            ...stateProductDetail,
            [e.target.name]: e.target.value
        })

    }


    const onUpdateProduct = () => {
        mutationUpdate.mutate({
            id: rowSelected,
            ...stateProductDetail,
            price: Number(stateProductDetail.price),
            rating: Number(stateProductDetail.rating),
            countInStock: Number(stateProductDetail.countInStock),
            discount: Number(stateProductDetail.discount) // ✅ QUAN TRỌNG
        })
    }
    const handleOnChangeImage = async ({ fileList }) => {
        const file = fileList[0]

        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
            setStateProduct({
                ...stateProduct,
                image: file.preview
            })

        }
    }
    const handleOnChangeImageDetail = async ({ fileList }) => {
        const file = fileList[0]

        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
            setStateProductDetail({
                ...stateProductDetail,
                image: file.preview
            })

        }
    }
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };
    return (
        <div>
            <WrapperHeader>Quản lý sản phẩm </WrapperHeader>
            <WrapperButton style={{ display: 'flex', gap: '10px' }} onClick={() => setIsModalOpen(true)}> <UserAddOutlined />thêm </WrapperButton>
            <div style={{ marginTop: '50px' }}>
                <TableComponent columns={columns} data={dataTable} onRow={(record) => {
                    return {
                        onClick: () => {
                            setRowSelected(record.key);
                        }
                    };
                }} />
            </div>
            <ModalComponent
                title="Tạo sản phẩm"
                closable={{ 'aria-label': 'Custom Close Button' }}
                isOpen={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    requiredMark={false}
                    style={{
                        width: '100%',
                        maxWidth: 700,
                        margin: '0 auto'
                    }}
                    autoComplete="off"
                    onFinish={onFinish}
                    form={form}
                >
                    <Form.Item
                        label={<span style={{ fontWeight: 600 }}>Name</span>}
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input
                            value={stateProduct.name}
                            onChange={handleOnChange}
                            name="name"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ fontWeight: 600 }}>Type</span>}
                        name="type"
                        rules={[{ required: true, message: 'Please input your type!' }]}
                    >
                        <Select
                            value={stateProduct.type}
                            onChange={handleChangeSelect}
                            options={[
                                ...(typeProducts?.map(item => ({
                                    value: item.Type || item,
                                    label: item.Type || item
                                })) || []),
                                { value: 'other', label: 'Type Khác' }
                            ]}
                        />

                        {isCustomType && (
                            <Input
                                placeholder="Nhập type mới..."
                                value={stateProduct.type}
                                onChange={(e) =>
                                    setStateProduct({
                                        ...stateProduct,
                                        type: e.target.value
                                    })
                                }
                                style={{ marginTop: '10px' }}
                            />
                        )}
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ fontWeight: 600 }}>Count inStock</span>}
                        name="countInStock"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số lượng!' },
                            {
                                validator: (_, value) => {
                                    if (isNaN(value)) {
                                        return Promise.reject('Phải nhập số!')
                                    }
                                    if (Number(value) < 0) {
                                        return Promise.reject('Không được nhỏ hơn 0!')
                                    }
                                    return Promise.resolve()
                                }
                            }
                        ]}
                    >
                        <Input
                            name="countInStock"
                            onChange={handleOnChange}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ fontWeight: 600 }}>Price</span>}
                        name="price"
                        rules={[
                            { required: true, message: 'Vui lòng nhập giá!' },
                            {
                                validator: (_, value) => {
                                    if (isNaN(value)) {
                                        return Promise.reject('Giá phải là số!')
                                    }
                                    if (Number(value) <= 0) {
                                        return Promise.reject('Giá phải lớn hơn 0!')
                                    }
                                    return Promise.resolve()
                                }
                            }
                        ]}
                    >
                        <Input
                            value={stateProduct.price}
                            onChange={handleOnChange}
                            name="price"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ fontWeight: 600 }}>Discount</span>}
                        name="discount"
                        rules={[
                            { required: true, message: 'Vui lòng nhập discount!' },
                            {
                                validator: (_, value) => {
                                    if (isNaN(value)) return Promise.reject('Phải là số!')
                                    if (value < 0) return Promise.reject('>= 0!')
                                    if (value > 100) return Promise.reject('<= 100!')
                                    return Promise.resolve()
                                }
                            }
                        ]}
                    >
                        <Input
                            type="number"
                            value={stateProduct.discount}
                            onChange={handleOnChange}
                            name="discount"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ fontWeight: 600 }}>Rating</span>}
                        name="rating"
                        rules={[
                            { required: true, message: 'Vui lòng nhập rating!' },
                            {
                                validator: (_, value) => {
                                    if (isNaN(value)) return Promise.reject('Phải là số!')
                                    if (value < 0) return Promise.reject('Số phải lớn hơn 0')
                                    if (value > 5) return Promise.reject('Số phải bé hơn 5')
                                    return Promise.resolve()
                                }
                            }
                        ]}
                    >
                        <Input
                            value={stateProduct.rating}
                            onChange={handleOnChange}
                            name="rating"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ fontWeight: 600 }}>Description</span>}
                        name="description"
                        rules={[{ required: true, message: 'Please input your description!' }]}
                    >
                        <Input
                            value={stateProduct.description}
                            onChange={handleOnChange}
                            name="description"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ fontWeight: 600 }}>Image</span>}
                        name="image"
                        rules={[{ required: true, message: 'Please input your image!' }]}
                    >
                        <div style={{ display: 'flex', gap: '50px' }}>
                            <Upload
                                showUploadList={false}
                                onChange={handleOnChangeImage}
                                maxCount={1}
                                beforeUpload={() => false}
                            >
                                <Button icon={<UploadOutlined />}>
                                    Select File
                                </Button>
                            </Upload>

                            {stateProduct.image && (
                                <img
                                    src={stateProduct.image}
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
                            style={{
                                marginTop: '24px',
                                borderRadius: '6px',
                                fontWeight: 500
                            }}
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </ModalComponent>
            <ModalComponent
                title="Chi tiết sản phẩm"
                isOpen={isOpenDrawer}
                onCancel={() => setIsOpenDrawer(false)}
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
                    onFinish={onUpdateProduct}
                    form={formUpdate}
                >
                    <Form.Item label={<b>Name</b>} name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
                        <Input onChange={handleOnChangeDetail} name="name" />
                    </Form.Item>

                    <Form.Item label={<b>Type</b>} name="type" rules={[{ required: true, message: 'Please input your type!' }]}>
                        <Input onChange={handleOnChangeDetail} name="type" />
                    </Form.Item>

                    <Form.Item label={<b>Count inStock</b>} name="countInStock" rules={[{ required: true, message: 'Please input your count inStock!' }]}>
                        <Input onChange={handleOnChangeDetail} name="countInStock" />
                    </Form.Item>

                    <Form.Item label={<b>Price</b>} name="price" rules={[{ required: true, message: 'Please input your price!' }]}>
                        <Input onChange={handleOnChangeDetail} name="price" />
                    </Form.Item>

                    <Form.Item label={<b>Discount</b>} name="discount" rules={[{ required: true, message: 'Please input your discount!' }]}>
                        <Input onChange={handleOnChangeDetail} name="discount" />
                    </Form.Item>

                    <Form.Item label={<b>Rating</b>} name="rating" rules={[{ required: true, message: 'Please input your rating!' }]}>
                        <Input onChange={handleOnChangeDetail} name="rating" />
                    </Form.Item>

                    <Form.Item label={<b>Description</b>} name="description" rules={[{ required: true, message: 'Please input your description!' }]}>
                        <Input onChange={handleOnChangeDetail} name="description" />
                    </Form.Item>

                    <Form.Item label={<b>Image</b>} name="image" rules={[{ required: true, message: 'Please input your image!' }]}>
                        <div style={{ display: 'flex', gap: '50px' }}>
                            <Upload
                                showUploadList={false}
                                onChange={handleOnChangeImageDetail}
                                maxCount={1}
                                beforeUpload={() => false}
                            >
                                <Button icon={<UploadOutlined />}>Select File</Button>
                            </Upload>

                            {stateProductDetail.image && (
                                <img
                                    src={stateProductDetail.image}
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
                            style={{
                                marginTop: '24px',
                                borderRadius: '6px',
                                fontWeight: 500
                            }}
                        >
                            Sửa
                        </Button>
                    </Form.Item>
                </Form>
            </ModalComponent>

            <ModalComponent title="Xóa sản phẩm" isOpen={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
                <div>Bạn có chắc xóa sản phẩm này không?</div>
            </ModalComponent>
        </div >
    )
}

export default AdminProduct
