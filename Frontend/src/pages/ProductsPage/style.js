import styled from "styled-components";

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 30px;
    justify-content: flex-start;

    background: #fafafa;

    border-bottom: 1px solid #dcdddf;

    font-family: 'Inter', sans-serif;

    padding: 0 120px;
`;

export const WrapperContainer = styled.div`
    padding: 20px 120px;
`;

export const WrapperTitle = styled.h1`
    margin: 0 0 15px;

    font-family: Arial, sans-serif;
    font-size: 24px;
`;

export const WrapperFilter = styled.div`
    padding: 15px;

    border: 1px solid #e0e0e0;
    border-radius: 10px;

    background: #fff;
`;

export const WrapperProductList = styled.div`
    padding: 20px 30px;

    display: flex;
    align-items: center;
    gap: 20px;

    flex-wrap: wrap;
`;

export const WrapperLoadMore = styled.div`
    width: 100%;

    display: flex;
    justify-content: center;

    margin-top: 20px;
`;

export const WrapperButtonMore = styled.button`
    padding: 10px 28px;
    margin-bottom: 20px;

    border-radius: 10px;
    border: none;

    background: #0066ff;
    color: #fff;

    font-weight: 600;

    cursor: pointer;

    box-shadow: 0 4px 12px rgba(22, 119, 255, 0.3);

    transition: 0.3s;

    &:hover {
        opacity: 0.9;
        transform: translateY(-2px);
    }
`;