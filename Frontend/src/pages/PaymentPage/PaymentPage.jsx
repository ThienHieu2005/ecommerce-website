import React from 'react';
import * as S from './style';
import { useSelector, useDispatch } from "react-redux";
import ModalComponent from "../../components/ModalComponent/ModelComponent";
import { Form, Input } from "antd";
import { useState, useEffect } from "react";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import { updateUser } from "../../redux/slices/UserSlice";
import * as OrderService from "../../services/OrderService";
import * as CartService from "../../services/CartService";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const [formUpdate] = Form.useForm();
  const navigate = useNavigate();

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("Giao tiết kiệm");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [cartItems, setCartItems] = useState([]);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const rowSelected = user?.id;

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
      if (!user?.id || !user?.access_token) return;

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
  }, [user?.id, user?.access_token]);

  const handleAddOrder = () => {
    if (
      user?.id &&
      user?.name &&
      user?.address &&
      user?.city &&
      user?.phone &&
      cartItems?.length > 0
    ) {
      const formattedItems = cartItems.map((item) => ({
        product: item.product || item.productId || item.id,
        name: item.name,
        amount: item.amount,
        image: item.image || '',
        price: item.price,
        discount: item.discount || 0
      }));

      mutationAddOrder.mutate(
        {
          access_token: user.access_token,
          userId: user.id,
          orderItems: formattedItems,
          fullName: user.name,
          address: user.address,
          city: user.city,
          phone: user.phone,
          paymentMethod,
          deliveryMethod,
          itemsPrice: totalPrice,
          shippingPrice: 0,
          totalPrice: totalPrice,
          isPaid: false
        },
        {
          onSuccess: async (data) => {
            try {
              if (paymentMethod === "VNPAY") {
                const paymentRes = await OrderService.createVnpayPayment(
                  {
                    orderId: data?.data?.Id || data?.data?.id,
                    amount: totalPrice
                  },
                  user.access_token
                );

                if (paymentRes?.status === "OK") {
                  window.location.href = paymentRes.paymentUrl;
                  return;
                }
              }

              await CartService.deleteAllCartByUser(user.id, user.access_token);
              window.dispatchEvent(new Event("cartUpdated"));
              setCartItems([]);
              message.success("Đặt hàng thành công");
              navigate("/order-success");
            } catch (error) {
              console.log("Lỗi xử lý sau đặt hàng:", error);
              message.error("Có lỗi khi xử lý đơn hàng");
            }
          },
          onError: () => {
            message.error("Đặt hàng thất bại");
          }
        }
      );
    } else {
      alert("Thiếu thông tin hoặc giỏ hàng trống!");
    }
  };

  const handleCancelUpdate = () => {
    setIsOpenModalUpdateInfo(false);
  };

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, access_token, ...rest } = data;
      return UserService.updateUser(id, rest, access_token);
    }
  );

  const mutationAddOrder = useMutationHooks(
    (data) => {
      const { access_token, ...rest } = data;
      return OrderService.createOrder(rest, access_token);
    }
  );
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
      { id: rowSelected, access_token: user.access_token, ...values },
      {
        onSuccess: () => {
          setIsOpenModalUpdateInfo(false);

          dispatch(updateUser({
            Name: values.name,
            Phone: values.phone,
            Address: values.address,
            City: values.city,
            Email: user.email,
            Avatar: user.avatar,
            Id: user.id,
            IsAdmin: user.isAdmin
          }));
        }
      }
    );
  };

  return (
    <S.Container>
      <S.Title>Thanh toán</S.Title>

      <S.MainContent>
        <S.CartList>
          <S.OptionCard>
            <S.OptionTitle>Chọn hình thức giao hàng</S.OptionTitle>

            <S.DeliveryBox
              active={deliveryMethod === 'Giao tiết kiệm'}
              onClick={() => setDeliveryMethod('Giao tiết kiệm')}
            >
              <input
                type="radio"
                checked={deliveryMethod === 'Giao tiết kiệm'}
                onChange={() => setDeliveryMethod('Giao tiết kiệm')}
              />
              <span>Giao tiết kiệm</span>
            </S.DeliveryBox>
          </S.OptionCard>

          <S.OptionCard>
            <S.OptionTitle>Chọn hình thức thanh toán</S.OptionTitle>

            <S.PaymentItem onClick={() => setPaymentMethod('COD')}>
              <input
                type="radio"
                checked={paymentMethod === 'COD'}
                onChange={() => setPaymentMethod('COD')}
              />
              <span style={{ fontSize: 24 }}>💵</span>
              <span>Thanh toán tiền mặt</span>
            </S.PaymentItem>

            <S.PaymentItem onClick={() => setPaymentMethod('VNPAY')}>
              <input
                type="radio"
                checked={paymentMethod === 'VNPAY'}
                onChange={() => setPaymentMethod('VNPAY')}
              />
              <img
                src="https://salt.tikicdn.com/ts/upload/77/6a/df/a35cb9c62b9215dbc6d334a77cda4327.png"
                alt="vnpay"
                style={{ width: 36, height: 36, objectFit: 'contain' }}
              />
              <div>
                <div>VNPAY</div>
              </div>
            </S.PaymentItem>

            <S.PaymentItem onClick={() => setPaymentMethod('Viettel Money')}>
              <input
                type="radio"
                checked={paymentMethod === 'Viettel Money'}
                onChange={() => setPaymentMethod('Viettel Money')}
              />
              <img
                src="https://salt.tikicdn.com/ts/upload/5f/f9/75/d7ac8660aae903818dd7da8e4772e145.png"
                alt="viettel"
                style={{ width: 36, height: 36, objectFit: 'contain' }}
              />
              <span>Viettel Money</span>
            </S.PaymentItem>

            <S.PaymentItem onClick={() => setPaymentMethod('Momo')}>
              <input
                type="radio"
                checked={paymentMethod === 'Momo'}
                onChange={() => setPaymentMethod('Momo')}
              />
              <img
                src="https://salt.tikicdn.com/ts/upload/ce/f6/e8/ea880ef285856f744e3ffb5d282d4b2d.jpg"
                alt="momo"
                style={{ width: 36, height: 36, objectFit: 'contain' }}
              />
              <span>Ví Momo</span>
            </S.PaymentItem>

            <S.PaymentItem onClick={() => setPaymentMethod('ZaloPay')}>
              <input
                type="radio"
                checked={paymentMethod === 'ZaloPay'}
                onChange={() => setPaymentMethod('ZaloPay')}
              />
              <img
                src="https://salt.tikicdn.com/ts/upload/2f/43/da/dd7ded6d3659036f15f95fe81ac76d93.png"
                alt="zalopay"
                style={{ width: 36, height: 36, objectFit: 'contain' }}
              />
              <span>Ví ZaloPay</span>
            </S.PaymentItem>


          </S.OptionCard>
        </S.CartList>

        <S.SummaryCard>
          <S.SummaryRow>
            <span>Địa chỉ giao hàng: {user?.address} {user?.city}</span>
            <span
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => setIsOpenModalUpdateInfo(true)}
            >
              thay đổi
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

          <S.MainButton primary onClick={handleAddOrder}>
            Đặt hàng
          </S.MainButton>

          <S.MainButton onClick={() => navigate('/products')}>
            Tiếp tục mua sắm
          </S.MainButton>
        </S.SummaryCard>
      </S.MainContent>

      <ModalComponent
        title="Cập nhật thông tin"
        open={isOpenModalUpdateInfo}
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
            rules={[{ required: true, message: 'Please input your phone!' }]}
          >
            <Input onChange={handleOnChangeDetail} name="phone" />
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