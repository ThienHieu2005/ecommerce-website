import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: rgba(0, 0, 0, 0.05);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

export const ModalBox = styled.div`
  display: flex;
  width: 100%;
  max-width: 800px;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    max-width: 95%;
    flex-direction: column;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  border: none;
  background: none;
  font-size: 28px;
  color: #bebebe;
  cursor: pointer;
  z-index: 10;
  &:hover { color: #888; }
`;

export const FormSection = styled.div`
  flex: 1.5;
  padding: 40px 50px;
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  margin-bottom: 25px;
  width: fit-content;
  padding: 0;
  display: flex;
  align-items: center;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: 500;
  margin: 0 0 10px 0;
  color: #333;
`;

export const Subtitle = styled.p`
  color: #555;
  font-size: 15px;
  margin-bottom: 35px;
`;

export const InputGroup = styled.div`
  margin-bottom: 25px;
  border-bottom: 1px solid #efefef;
  display: flex;
  align-items: center;
  
  &:focus-within {
    border-bottom: 1px solid #0d5cb6;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 0;
  border: none;
  outline: none;
  font-size: 16px;
  background: transparent;
  &::placeholder { color: #ccc; }
`;

export const ShowPassword = styled.button`
  background: none;
  border: none;
  color: #0d5cb6;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #ff424e;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.2s ease;

  &:hover { background-color: #d93944; }
  &:active { transform: scale(0.98); }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const Footer = styled.div`
  margin-top: 25px;
  font-size: 14px;
  
  a {
    color: #0d5cb6;
    text-decoration: none;
    margin-bottom: 8px;
    display: inline-block;
  }

  p {
    color: #787878;
    margin: 5px 0;
  }
`;

export const ImageSection = styled.div`
  flex: 1;
  background-color: #f0f8ff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  text-align: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const MascotImage = styled.img`
  width: 200px;
  height: auto;
  margin-bottom: 25px;
`;

export const PromoTitle = styled.h3`
  color: #0b53ad;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

export const PromoText = styled.p`
  color: #0b53ad;
  font-size: 14px;
  margin-top: 8px;
`;