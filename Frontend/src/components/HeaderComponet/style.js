import { Row } from "antd";
import styled from "styled-components";

export const Header = styled(Row)`
  padding: 10px 120px;
  background-color: #06f;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TextHeader = styled.span`
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
`;

export const ContentPopup = styled.p`
  margin: 0;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.2s ease;
  border-radius: 6px;

  &:hover {
    background-color: #f5f5f5;
    color: #1890ff;
  }

  &:active {
    background-color: #e6f7ff;
  }
`;

export const Logo = styled.div`
  width: 25%;

  display: flex;
  align-items: center;


  img {
    width: 70px;
    height: auto;
    object-fit: contain;
    display: block;
  }
`;

export const Search = styled.div`
  flex: 1;

  display: flex;
  justify-content: center;

  min-width: 250px;

  .ant-input-search {
    width: 100%;
  }

  .ant-btn {
    color: #040404;
    background-color: #ffffff;
  }
`;

export const Action = styled.div`
  width: 25%;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  gap: 40px;
`;

export const CartIcon = styled.div`
  color: #fff;
  font-size: 33px;
  cursor: pointer;

  display: flex;
  align-items: center;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  cursor: pointer;
`;

export const UserAvatar = styled.img`
  height: 35px;
  width: 35px;

  border-radius: 50%;
  object-fit: cover;

  border: 2px solid #ccc;
`;

export const UserIcon = styled.div`
  font-size: 20px;
  color: #fff;

  display: flex;
  align-items: center;
`;

export const UserName = styled.span`
  color: #fff;
  white-space: nowrap;
`;

export const Login = styled.div`
  cursor: pointer;
`;

export const LoginButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const WrapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  justify-content: flex-start;

  overflow-x: auto;
  white-space: nowrap;

  background: #fafafa;
  border-bottom: 1px solid #dcdddf;

  font-family: 'Inter', sans-serif;

  padding: 0 120px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TopBar = styled.div`
  width: 100%;
  height: 50px;

  overflow: hidden;

  img {
    width: 100%;
    height: 100%;

    object-fit: cover;
    display: block;
  }
`;