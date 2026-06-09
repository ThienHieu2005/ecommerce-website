import styled from "styled-components";

// --- Hero Section ---
export const HeroContainer = styled.section`
  width: 100%;
  background: linear-gradient(90deg, #0264d6 0%, #19b5fe 100%);
  color: #ffffff;
  padding: 100px 10%;
  text-align: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
`;

export const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: bold;
  line-height: 1.2;
  margin: 0 auto 20px auto;
  max-width: 800px;
`;

export const HeroSubtitle = styled.p`
  font-size: 18px;
  color: #e0f2fe;
  line-height: 1.6;
  margin: 0 auto 40px auto;
  max-width: 700px;
`;

export const HeroButton = styled.a`
  background-color: #ffffff;
  color: #1d4ed8;
  border: none;
  padding: 15px 35px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

// --- Service Section ---
export const ServicesContainer = styled.section`
  width: 100%;
  background-color: #ffffff;
  padding: 60px 10%;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 30px;
  border-bottom: 1px solid #f0f0f0;
  font-family: Arial, sans-serif;
`;

export const ServiceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1 1 200px;
`;

export const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f0f9ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ServiceTitle = styled.span`
  font-size: 15px;
  font-weight: bold;
  color: #1a1a1a;
  display: block;
`;

export const ServiceDescription = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0;
`;

// --- Products Section ---
export const ProductsSection = styled.section`
  padding: 60px 10%;
  background-color: #ffffff;
  font-family: Arial, sans-serif;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
`;

export const ViewAllBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fff;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
  }
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  /* Responsive bổ sung để không bị vỡ trên mobile */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

// --- Consultation Section ---
export const ConsultSection = styled.section`
  width: 100%;
  background: linear-gradient(90deg, #0066ff 0%, #00d4ff 100%);
  padding: 80px 10%;
  text-align: center;
  color: #ffffff;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
`;

export const ConsultTitle = styled.h2`
  font-size: 36px;
  font-weight: bold;
  margin: 0 0 15px 0;
`;

export const ConsultSubtitle = styled.p`
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 30px;
`;

export const ContactBtn = styled.a`
  background-color: #ffffff;
  color: #1a1a1a;
  padding: 15px 30px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;