import styled from 'styled-components';

export const WrapperFooter = styled.footer`
    background-color: #1a1a1a;
    color: #ffffff;
    padding: 60px 5% 30px 5%;
    font-family: Arial, sans-serif;
    box-sizing: border-box;
`;

export const WrapperContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 40px;
    margin-bottom: 40px;
`;

export const WrapperColumn = styled.div`
    flex: 1 1 200px;
`;

export const WrapperBrandColumn = styled.div`
    flex: 1 1 300px;
`;

export const WrapperLogoSection = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    
`;

export const WrapperLogoIcon = styled.div`
    background-color: #0066ff;
    color: white;

    width: 60px;
    height: 60px;

    border-radius: 8px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-weight: bold;
    font-size: 24px;
    img {
    width: 70px;
    height: auto;
    object-fit: contain;
    display: block;
  }
`;

export const WrapperLogoText = styled.span`
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
`;

export const WrapperDescription = styled.p`
    color: #cccccc;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 25px;
    max-width: 300px;
`;

export const WrapperSocialGroup = styled.div`
    display: flex;
    gap: 10px;
`;

export const WrapperSocialIcon = styled.div`
    width: 36px;
    height: 36px;

    background-color: #333333;
    border-radius: 8px;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
    transition: 0.3s;

    &:hover {
        background-color: #0066ff;
    }
`;

export const WrapperColumnTitle = styled.h3`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #ffffff;
`;

export const WrapperLinkList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

export const WrapperLinkItem = styled.li`
    margin-bottom: 12px;
`;

export const WrapperLink = styled.span`
    color: #cccccc;
    text-decoration: none;
    font-size: 14px;
    transition: 0.3s;
    cursor: pointer;

    &:hover {
        color: #0066ff;
    }
`;

export const WrapperQuickLink = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const WrapperContactItem = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    color: #cccccc;
    font-size: 14px;

    margin-bottom: 15px;
`;

export const WrapperDivider = styled.div`
    border-top: 1px solid #333333;
    padding-top: 20px;

    text-align: center;

    color: #888888;
    font-size: 13px;
`;