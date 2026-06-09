import styled from "styled-components";
import { Card, Button } from "antd";

export const StyledCard = styled(Card)`
  width: 300px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: none;

  .ant-card-body {
    padding: 20px;
  }
`;

export const CoverWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 350px;
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const DiscountBadge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;

  padding: 6px 14px;
  border-radius: 100px;
  border: 1px solid #fecaca;

  background-color: #fee2e2;
  color: #991b1b;

  font-size: 14px;
  font-weight: 700;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
`;

export const SubTitle = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 16px;
  color: #8c8c8c;
`;

export const Price = styled.span`
  display: flex;
  align-items: baseline;

  margin: 12px 0 20px 0;

  color: #0066ff;
  font-size: 24px;
  font-weight: 700;
`;

export const OriginalPrice = styled.span`
  margin-left: 12px;
  color: #777;
  font-size: 13px;
  text-decoration: line-through;
`;

export const ActionWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

export const DetailButton = styled(Button)`
  flex: 1;
  height: 48px;
  border-radius: 12px;
  border: 1px solid #d9d9d9;

  font-size: 15px;
  font-weight: 600;
`;

export const CartButton = styled(Button)`
  width: 48px;
  height: 48px;
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #0066ff !important;

  .anticon {
    font-size: 20px;
    color: white;
  }
`;