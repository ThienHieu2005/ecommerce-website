import React from 'react';
import * as S from './style';
import { useSelector, useDispatch } from "react-redux";
import ModalComponent from "../../components/ModalComponent/ModelComponent";
import { Form, Input, InputNumber } from "antd";
import { useState, useEffect } from "react";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import * as CartService from "../../services/CartService";
import { updateUser } from "../../redux/slices/UserSlice";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined } from '@ant-design/icons';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [formUpdate] = Form.useForm();
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const rowSelected = user?.id;

  const [cartItems, setCartItems] = useState([]);

  const [stateUserDetail, setStateUserDetail] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  });

  const totalPrice = cartItems?.reduce((total, item) => {
    return total + Number(item.price || 0) * Number(item.amount || 0);
  }, 0);

  const fetchCart = async () => {
    try {
      if (!user?.id) return;

      const res = await CartService.getCartByUser(user.id, user.access_token);

      if (res?.status === "OK") {
        setCartItems(res?.orderItem || []);
      }
    } catch (error) {
      console.log("Lỗi lấy giỏ hàng:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user?.id]);

  const handleChangeAmount = async (productId, amount) => {
    try {
      if (!user?.id || !productId || !amount) return;

      const res = await CartService.updateCartAmount(
        {
          userId: user.id,
          productId,
          amount
        },
        user.access_token
      );

      if (res?.status === "OK") {
        setCartItems((prev) =>
          prev.map((item) =>
            item.product === productId
              ? { ...item, amount }
              : item
          )
        );
      } else {
        console.log("Cập nhật số lượng thất bại:", res?.message);
      }
    } catch (error) {
      console.log("Lỗi cập nhật số lượng:", error);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      if (!user?.id || !productId) return;

      const res = await CartService.removeCartItem(
        {
          userId: user.id,
          productId
        },
        user.access_token
      )

      if (res?.status === "OK") {
        setCartItems((prev) =>
          prev.filter((item) => item.product !== productId)
        );

        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        console.log("Xóa sản phẩm thất bại:", res?.message);
      }
    } catch (error) {
      console.log("Lỗi xóa sản phẩm khỏi giỏ:", error);
    }
  };

  const handleAddCard = () => {
    if (!user?.phone || !user?.address || !user?.name || !user?.city) {
      setIsOpenModalUpdateInfo(true);
    } else {
      navigate('/payment');
    }
  };

  const handleCancelUpdate = () => {
    setIsOpenModalUpdateInfo(false);
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, ...rest } = data;
    return UserService.updateUser(id, rest, user.access_token);
  });

  const handleOnChangeDetail = (e) => {
    setStateUserDetail({
      ...stateUserDetail,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      const data = {
        name: user?.name,
        phone: user?.phone,
        address: user?.address,
        city: user?.city
      };

      setStateUserDetail(data);
      formUpdate.setFieldsValue(data);
    }
  }, [isOpenModalUpdateInfo, user, formUpdate]);

  const onUpdateUser = (values) => {
    mutationUpdate.mutate(
      { id: rowSelected, ...values },
      {
        onSuccess: (res) => {
          setIsOpenModalUpdateInfo(false);

          const payloadUpdateRedux = {
            Id: user.id,
            Name: values.name,
            Email: user.email,
            Phone: values.phone,
            Address: values.address,
            City: values.city,
            Avatar: user.avatar,
            IsAdmin: user.isAdmin,
            access_token: user.access_token
          };

          dispatch(updateUser(payloadUpdateRedux));

          localStorage.setItem(
            'user',
            JSON.stringify(payloadUpdateRedux)
          );
        }
      }
    );
  };
  return (
    <S.Container>
      <S.Title>Giỏ hàng</S.Title>

      <S.MainContent>
        <S.CartList>
          {cartItems?.length > 0 ? (
            cartItems.map((item) => (
              <S.CartItem key={item?.product}>
                <S.ProductImg src={item?.image} alt="image" />

                <S.ProductInfo>
                  <S.ProductName>{item?.name}</S.ProductName>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <InputNumber
                      min={1}
                      max={item?.countInStock || 100}
                      value={item?.amount}
                      onChange={(value) => handleChangeAmount(item?.product, value)}
                    />

                    <S.RemoveBtn
                      onClick={() => handleRemoveProduct(item?.product)}
                    >
                      <span><DeleteOutlined /></span> Xóa
                    </S.RemoveBtn>
                  </div>
                </S.ProductInfo>

                <S.ProductInfo>
                  <S.PriceContainer>
                    <span style={{ fontSize: '18px', marginBottom: '6px', display: 'block' }}>
                      Đơn giá
                    </span>

                    <S.CurrentPrice>
                      {Number(item?.price || 0).toLocaleString()} đ
                    </S.CurrentPrice>
                  </S.PriceContainer>
                </S.ProductInfo>

                <S.ProductInfo>
                  <S.PriceContainer>
                    <span style={{ fontSize: '18px', marginBottom: '6px', display: 'block' }}>
                      Thành tiền
                    </span>

                    <S.CurrentPrice>
                      {(Number(item?.price || 0) * Number(item?.amount || 0)).toLocaleString()} đ
                    </S.CurrentPrice>
                  </S.PriceContainer>
                </S.ProductInfo>
              </S.CartItem>
            ))
          ) : (
            <S.EmptyCart>
              <img
                src="https://png.pngtree.com/png-clipart/20250203/original/pngtree-cart-empty-vector-png-image_20275977.png"
                alt="empty-cart"
              />

              <h3>Giỏ hàng trống</h3>

              <p>Bạn tham khảo thêm các sản phẩm được gợi ý bên dưới nhé!</p>
            </S.EmptyCart>
          )}
        </S.CartList>

        <S.SummaryCard>
          <S.SummaryRow>
            <span>Địa chỉ giao hàng: {user?.address} {user?.city}</span>
            <span
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => setIsOpenModalUpdateInfo(true)}
            >
              Thay đổi
            </span>
          </S.SummaryRow>

          <S.SummaryRow>
            <span>Tạm tính</span>
            <span>{Number(totalPrice || 0).toLocaleString()} đ</span>
          </S.SummaryRow>

          <S.SummaryRow>
            <span>Phí vận chuyển</span>
            <span>Miễn phí</span>
          </S.SummaryRow>

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />

          <S.SummaryRow bold large>
            <span>Tổng cộng</span>
            <span className="total-price">{Number(totalPrice || 0).toLocaleString()} đ</span>
          </S.SummaryRow>

          <S.MainButton primary onClick={() => handleAddCard()}>
            Tiến hành thanh toán
          </S.MainButton>

          <S.MainButton style={{ cursor: "pointer" }} onClick={() => navigate('/products')}>
            Tiếp tục mua sắm
          </S.MainButton>
        </S.SummaryCard>
      </S.MainContent>

      <ModalComponent
        title="Cập nhật thông tin"
        isOpen={isOpenModalUpdateInfo}
        onCancel={handleCancelUpdate}
        onOk={() => formUpdate.submit()}
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ width: '100%', maxWidth: 700, fontSize: '200px' }}
          autoComplete="off"
          onFinish={onUpdateUser}
          form={formUpdate}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input onChange={handleOnChangeDetail} name="name" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              {
                pattern: /^0\d{9}$/,
                message: 'Số điện thoại phải có 10 số và bắt đầu bằng số 0!'
              }
            ]}
            getValueFromEvent={(e) => e.target.value.replace(/\D/g, '').slice(0, 10)}
          >
            <Input
              name="phone"
              maxLength={10}
              placeholder="Nhập số điện thoại"
              onChange={handleOnChangeDetail}
            />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <Input onChange={handleOnChangeDetail} name="address" />
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: 'Please input your city!' }]}
          >
            <Input onChange={handleOnChangeDetail} name="city" />
          </Form.Item>
        </Form>
      </ModalComponent>
    </S.Container>
  );
};

export default PaymentPage;