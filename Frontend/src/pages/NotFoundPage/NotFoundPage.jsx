import React from "react";
import { useNavigate } from "react-router-dom";

import { WrapperContainer, WrapperCard, WrapperIcon, Title404, Title, Description, WrapperButton, PrimaryButton, SecondaryButton } from "./style";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <WrapperContainer>
      <WrapperCard>

        <WrapperIcon>
          ⚠️
        </WrapperIcon>

        <Title404>404</Title404>

        <Title>
          Không tìm thấy trang
        </Title>

        <Description>
          Trang bạn đang truy cập không tồn tại.
          Vui lòng quay lại trang chủ để tiếp tục mua sắm.
        </Description>

        <WrapperButton>

          <PrimaryButton onClick={() => navigate("/")}>
            Về trang chủ
          </PrimaryButton>

          <SecondaryButton onClick={() => navigate("/products")}>
            Xem sản phẩm
          </SecondaryButton>

        </WrapperButton>

      </WrapperCard>
    </WrapperContainer>
  );
};

export default HomePage;