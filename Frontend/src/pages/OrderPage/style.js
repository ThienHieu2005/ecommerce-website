import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 30px auto;
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
export const EmptyCart = styled.div`
  width: 100%;
  min-height: 300px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  text-align: center;
  padding: 40px 20px;

  img {
    width: 140px;
    height: 140px;
    object-fit: contain;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #222;
    margin: 0 0 8px;
  }

  p {
    font-size: 14px;
    color: #333;
    margin: 0;
  }
`;