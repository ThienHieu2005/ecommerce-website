import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  padding: 10px;
  padding-bottom: 60px;
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
export const LoadingWrapper = styled.div`
  padding: 40px;
  text-align: center;
`

export const ErrorWrapper = styled.div`
  padding: 40px;
  text-align: center;
  color: red;
`

export const EmptyOrder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 30px;
  margin: 20px 0;

  border: 1px dashed #ddd;
  border-radius: 10px;

  color: #888;
  font-size: 15px;
`;

export const OrderCard = styled.div`
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`

export const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
  margin-bottom: 12px;
`

export const OrderId = styled.strong`
  font-size: 20px;
`

export const OrderDate = styled.div`
  color: #666;
  font-size: 14px;
  margin-top: 4px;
`

export const StatusWrapper = styled.div`
  text-align: right;
`

export const DeliveryStatus = styled.div`
  color: ${(props) => (props.delivered ? 'green' : '#ff9800')};
  font-weight: 600;
`

export const PaymentStatus = styled.div`
  color: ${(props) => (props.paid ? 'green' : '#d32f2f')};
  font-size: 14px;
  margin-top: 4px;
`

export const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f2f2f2;
`

export const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 16px;
`

export const ShippingInfo = styled.div`
  color: #666;
  font-size: 14px;
`

export const TotalWrapper = styled.div`
  text-align: right;
`

export const TotalLabel = styled.div`
  color: #666;
  font-size: 15px;
`

export const TotalPrice = styled.div`
  font-weight: 700;
  font-size: 25px;
  color: #0066ff;
  margin-top: 15px;
`

export const CancelButton = styled.button`
  margin-top: 14px;
  padding: 9px 16px;
  border: 1px solid #ff4d4f;
  background: #fff;
  color: #ff4d4f;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #fff1f0;
  }
`
export const ProductPrice = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #333;
`
export const ProductQuantity = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
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


export const ProductName = styled.h3`
  margin: 0 0 5px 0;
  font-size: 18px;
`;

export const Brand = styled.p`
  color: #888;
  font-size: 14px;
  margin: 0 0 15px 0;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  margin: 30px 0;
`

export const PageButton = styled.button`
  border: none;
  background: transparent;
  font-size: 28px;
  color: #555;
  cursor: pointer;

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`

export const PageNumber = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 8px;
  border: ${({ active }) => active ? '1px solid #1677ff' : '1px solid transparent'};
  background: #fff;
  color: ${({ active }) => active ? '#1677ff' : '#000'};
  font-size: 16px;
  cursor: pointer;
`