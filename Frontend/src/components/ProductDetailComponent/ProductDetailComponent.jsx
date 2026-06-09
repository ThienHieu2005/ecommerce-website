import React, { useState } from "react";
import { Row, Col, Typography, Tag, InputNumber, Button, Space } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { styles as s } from './style';
import * as ProductService from '../../services/ProductService'
import * as CartService from "../../services/CartService";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const { Title, Text, Paragraph } = Typography;

const fetchGetDetailsProduct = async ({ queryKey }) => {
  const [, id] = queryKey

  try {
    const res = await ProductService.getDetailProduct(id)
    return res.data || res
  } catch (error) {
    console.error('API ERROR:', error)
    throw error
  }
}

const ProductDetailComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1)
  const user = useSelector((state) => state.user)
  const navigate = useNavigate();

  const { data: productDetails, isLoading } = useQuery({
    queryKey: ['product-details', idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct
  })

  const handleAddOrderProduct = async () => {
    if (!user?.id) {
      navigate('/sign-in')
      return
    }

    try {
      const res = await CartService.addToCart(
        {
          userId: user.id,
          productId: productDetails?.Id,
          amount: numProduct
        },
        user.access_token
      )

      if (res?.status === "OK") {
        window.dispatchEvent(new Event("cartUpdated"))
        console.log("Thêm vào giỏ hàng thành công")
      } else {
        console.log("Thêm vào giỏ hàng thất bại:", res?.message)
      }
    } catch (error) {
      console.log("Lỗi thêm vào giỏ hàng:", error)
    }
  }

  const handleOrderProduct = async () => {
    if (!user?.id) {
      navigate('/sign-in')
      return
    }

    try {
      const res = await CartService.addToCart(
        {
          userId: user.id,
          productId: productDetails?.Id,
          amount: numProduct
        },
        user.access_token
      )

      if (res?.status === "OK") {
        window.dispatchEvent(new Event("cartUpdated"))
        navigate('/order')
      } else {
        console.log("Mua ngay thất bại:", res?.message)
      }
    } catch (error) {
      console.log("Lỗi mua ngay:", error)
    }
  }

  return (
    <div style={s.container}>
      <div style={s.backLink} onClick={() => navigate('/')}>
        <ArrowLeftOutlined style={{ marginRight: 8 }} />
        <Text color="primary">Quay lại danh sách</Text>
      </div>

      <Row gutter={[40, 32]}>
        <Col xs={24} md={12}>
          <img
            src={productDetails?.Image}
            alt="Image"
            style={{ width: "500px", height: "500px", objectFit: "cover", borderRadius: "10px" }}
          />
        </Col>

        <Col xs={24} md={12}>
          {productDetails?.Discount > 0 && (
            <Space size={8}>
              <Tag style={s.tagDiscount}>{productDetails?.Discount} %</Tag>
            </Space>
          )}

          <Title level={2} style={{ marginTop: 12, marginBottom: 8 }}>
            {productDetails?.Name}
          </Title>

          <Paragraph type="secondary">
            •  Danh mục: <Text strong>{productDetails?.Type}</Text>
          </Paragraph>

          <div style={{ marginBottom: 16 }}>
            {productDetails?.Price && (
              <>
                <Text style={s.mainPrice}>
                  {(productDetails.Price - productDetails.Price * (productDetails?.Discount || 0) / 100).toLocaleString('vi-VN')} <u>đ</u>
                </Text>

                <Text
                  style={{
                    marginLeft: 12,
                    color: '#777',
                    fontSize: 20,
                    textDecoration: 'line-through'
                  }}
                >
                  {Number(productDetails.Price).toLocaleString('vi-VN')} <u>đ</u>
                </Text>
              </>
            )}
          </div>

          <div style={s.quantitySection}>
            <Text block style={{ marginBottom: 8 }}>Số lượng</Text>
            <Space size={12}>
              <InputNumber
                min={1}
                max={productDetails?.CountInStock}
                value={numProduct}
                onChange={(value) => setNumProduct(value || 1)}
                size="large"
              />
              <Text type="secondary">{productDetails?.CountInStock} sản phẩm có sẵn</Text>
            </Space>
          </div>

          <div style={s.actionButtons}>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              style={s.btnAddCart}
              onClick={handleAddOrderProduct}
            >
              Thêm vào giỏ
            </Button>

            <Button style={s.btnBuyNow} onClick={handleOrderProduct}>
              Mua ngay
            </Button>
          </div>

          <div style={s.specTable}>
            <Title level={5}>Mô tả sản phẩm</Title>
            <Paragraph style={s.description}>
              {productDetails?.Description}
            </Paragraph>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetailComponent;