import styled from 'styled-components'
import { Form } from 'antd'

export const WrapperHeader = styled.h1`

  font-family: Arial, sans-serif;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
`;


export const WrapperButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 40px;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
  font-size: 18px;

  &:hover {
    background-color: #0056b3;
  }
`;
export const WrapperDrawerForm = styled(Form)`
  .ant-form-item-label > label {
    font-size: 18px;
    font-weight: 400;
  }
`;