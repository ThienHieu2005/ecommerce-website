import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  padding: 20px;
  font-family: 'Inter', sans-serif, Arial;
  background-color: #fff;
`;

export const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 30px;
`;

export const MainContent = styled.div`
  display: flex;
  gap: 30px;
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

export const CartList = styled.div`
  flex: 2;
`;

export const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
`;

export const ProductImg = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  background: #f8f8f8;
`;

export const ProductInfo = styled.div`
  flex: 1;
  padding: 0 20px;
`;

export const ProductName = styled.h3`
  margin: 0 0 5px 0;
  font-size: 18px;
`;

export const Brand = styled.p`
  color: #888;
  font-size: 14px;
  margin: 0 0 15px 0;
`;

export const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: fit-content;
  
  button {
    background: none;
    border: none;
    padding: 5px 12px;
    cursor: pointer;
    font-size: 18px;
  }
  
  span {
    padding: 0 15px;
  }
`;

export const RemoveBtn = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #ff4d4f;
  cursor: pointer;
  margin-left: 20px;
  font-size: 14px;
  gap: 5px;
`;

export const PriceContainer = styled.div`
  text-align: right;
`;

export const CurrentPrice = styled.div`
  color: #0066ff;
  font-weight: bold;
  font-size: 18px;
  text-decoration: underline;
`;

export const OldPrice = styled.div`
  color: #999;
  font-size: 14px;
  text-decoration: line-through;
`;

export const SummaryCard = styled.div`
  flex: 1;
  padding: 25px;
  border: 1px solid #eee;
  border-radius: 8px;
  height: fit-content;
  background-color: #fafafa;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: ${props => props.bold ? '#000' : '#666'};
  font-weight: ${props => props.bold ? '700' : '400'};
  font-size: ${props => props.large ? '20px' : '15px'};
  
  .total-price {
    color: #0066ff;
  }
`;

export const MainButton = styled.button`
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  background-color: ${props => props.primary ? '#0066ff' : '#fff'};
  color: ${props => props.primary ? '#fff' : '#333'};
  border: ${props => props.primary ? 'none' : '1px solid #ddd'};
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

export const OptionCard = styled.div`
  background: #fff;
  border-radius: 4px;
  padding: 20px 16px 26px;
  margin-bottom: 16px;
`;

export const OptionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 22px 0;
`;

export const DeliveryBox = styled.label`
  width: 100%;
  max-width: 475px;
  min-height: 60px;
  border: 1px solid ${({ active }) => (active ? '#91caff' : '#d9d9d9')};
  background: ${({ active }) => (active ? '#eaf5ff' : '#fff')};
  border-radius: 8px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  cursor: pointer;

  ${({ active }) =>
    active &&
    `
      &::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: -10px;
        transform: translateX(-50%) rotate(45deg);
        width: 18px;
        height: 18px;
        background: #eaf5ff;
        border-right: 1px solid #91caff;
        border-bottom: 1px solid #91caff;
      }
    `}

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #1677ff;
  }

  span {
    font-size: 14px;
    color: #1f2937;
  }
`;

export const PaymentItem = styled.label`
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 62px;
  cursor: pointer;
  font-size: 14px;
  color: #1f2937;

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #1677ff;
  }
`;

export const PaymentIcon = styled.div`
  width: 28px;
  height: 28px;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PaymentLogo = styled.div`
  width: 28px;
  height: 28px;
  border-radius: ${({ border }) => (border ? '4px' : '50%')};
  background: ${({ bg }) => bg || '#eee'};
  color: ${({ color }) => color || '#fff'};
  border: ${({ border }) => (border ? '1px solid #8bb6e8' : 'none')};
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const PaymentDesc = styled.div`
  margin-top: 4px;
  color: #6b7280;
  font-size: 13px;
`;