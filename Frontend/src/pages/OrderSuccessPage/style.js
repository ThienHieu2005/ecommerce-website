import styled from 'styled-components'

const primaryColor = '#0066ff'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 20px;
  background-color: #ffffff;
  font-family: Arial, sans-serif;
  text-align: center;
`

export const IconWrapper = styled.div`
  position: relative;
  margin-bottom: 30px;
  display: inline-block;
`

export const CartIcon = styled.div`
  width: 100px;
  height: 100px;
  color: #e2e8f0;
  font-size: 100px;

  display: flex;
  align-items: center;
  justify-content: center;
`

export const CheckBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #2ecc71;
  border-radius: 50%;
  width: 45px;
  height: 45px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 4px solid #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  color: #fff;
  font-size: 18px;
`

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  margin: 0 0 15px 0;
  text-transform: uppercase;
`

export const Description = styled.p`
  font-size: 16px;
  color: #666666;
  max-width: 450px;
  line-height: 1.6;
  margin: 0 auto 40px auto;
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
`

export const ViewOrderButton = styled.button`
  padding: 12px 35px;
  border-radius: 30px;
  border: 1px solid ${primaryColor};
  background-color: transparent;
  color: ${primaryColor};
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 14px;
  transition: 0.3s;

  &:hover {
    background: #f5f9ff;
  }
`

export const HomeButton = styled.button`
  padding: 12px 35px;
  border-radius: 30px;
  border: none;
  background-color: ${primaryColor};
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 14px;
  transition: 0.3s;

  &:hover {
    opacity: 0.9;
  }
`