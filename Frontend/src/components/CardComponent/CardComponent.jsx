import React from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import * as S from "./style";
import * as CartService from "../../services/CartService";

const formatPrice = (price) => {
  return Number(price).toLocaleString("vi-VN");
};

const CardComponent = ({ name, price, type, image, discount = 0, id }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const hasDiscount = Number(discount) > 0;

  const finalPrice = price - (price * discount) / 100;

  const handleViewDetail = () => {
    navigate(`/product-detail/${id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!user?.id) {
      navigate("/sign-in");
      return;
    }

    try {
      const cartData = {
        userId: user.id,
        productId: id,
        amount: 1,
      };
      console.log("TOKEN ADD CART:", user.access_token)
      const res = await CartService.addToCart(cartData, user.access_token);

      if (res?.status === "OK") {
        console.log("Thêm vào giỏ hàng thành công");
        window.dispatchEvent(new Event("cartUpdated"));
        return;
      }

      console.log("Thêm vào giỏ hàng thất bại:", res?.message);
    } catch (error) {
      console.log("Lỗi thêm vào giỏ hàng:", error);
    }
  };

  return (
    <S.StyledCard
      hoverable
      onClick={handleViewDetail}
      cover={
        <S.CoverWrapper>
          {hasDiscount && (
            <S.DiscountBadge>- {discount} %</S.DiscountBadge>
          )}

          <S.ProductImage alt={name} src={image} />
        </S.CoverWrapper>
      }
    >
      <S.Title>{name}</S.Title>

      <S.SubTitle>Danh mục • {type}</S.SubTitle>

      <S.Price>
        <span>
          {formatPrice(finalPrice)} <u>đ</u>
        </span>

        {hasDiscount && (
          <S.OriginalPrice>
            {formatPrice(price)} <u>đ</u>
          </S.OriginalPrice>
        )}
      </S.Price>

      <S.ActionWrapper>
        <S.DetailButton>Xem chi tiết</S.DetailButton>

        <S.CartButton
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
        />
      </S.ActionWrapper>
    </S.StyledCard>
  );
};

export default CardComponent;