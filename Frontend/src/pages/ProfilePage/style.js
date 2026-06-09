import styled from 'styled-components';

export const Container = styled.div`
  font-family: 'Inter', -apple-system, sans-serif;
  padding:  0px;
  background-color: #f8fafc; /* Màu nền xám nhạt cao cấp giúp nổi bật Card trắng */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #0f172a;
  width: 100%;
  max-width: 960px;
  text-align: left;
`;

export const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px; 
  width: 100%;
  max-width: 900px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  overflow: hidden;
`;

export const CardHeader = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid #f1f5f9;
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #0f172a;
  }
  
  p {
    margin: 4px 0 0 0;
    font-size: 14px;
    color: #64748b;
  }
`;

export const CardBody = styled.div`
  padding: 32px;
  display: grid;
  grid-template-columns: 240px 1fr; /* Chia làm 2 cột: Cột trái avatar, cột phải form */
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Trên mobile sẽ tự xếp chồng thành 1 hàng */
    gap: 24px;
  }
`;

/* Phân vùng Avatar */
export const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
`;

export const AvatarHoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(15, 23, 42, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

export const AvatarWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 4px solid #fff;
  box-shadow: 0 0 0 2px #e2e8f0;

  &:hover ${AvatarHoverOverlay} {
    opacity: 1;
  }
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const AvatarTip = styled.span`
  margin-top: 12px;
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
`;

/* Phân vùng Form điền thông tin */
export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormGridTwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: 6px;
  font-size: 14px;
  color: #334155;
  font-weight: 600;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

export const Button = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: #1d4ed8;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;