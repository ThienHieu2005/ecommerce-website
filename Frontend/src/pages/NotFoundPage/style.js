import styled from "styled-components";

export const WrapperContainer = styled.div`
    min-height: 100vh;
    background: linear-gradient(
        135deg,
        #e0f2fe 0%,
        #ffffff 50%,
        #dbeafe 100%
    );

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 24px;
    font-family: Arial, sans-serif;
`;

export const WrapperCard = styled.div`
    max-width: 520px;
    width: 100%;

    background: #ffffff;
    border-radius: 24px;

    padding: 48px 36px;

    text-align: center;

    box-shadow: 0 20px 60px rgba(0, 102, 255, 0.15);
    border: 1px solid #e5e7eb;
`;

export const WrapperIcon = styled.div`
    width: 96px;
    height: 96px;

    border-radius: 50%;
    background: #eff6ff;

    display: flex;
    align-items: center;
    justify-content: center;

    margin: 0 auto 24px;

    font-size: 44px;
`;

export const Title404 = styled.h1`
    font-size: 60px;
    line-height: 1;

    margin: 0 0 12px;

    color: #0066ff;
    font-weight: 800;
`;

export const Title = styled.h2`
    font-size: 28px;

    margin: 0 0 12px;

    color: #111827;
`;

export const Description = styled.p`
    font-size: 16px;
    line-height: 1.6;

    color: #6b7280;

    margin: 0 0 32px;
`;

export const WrapperButton = styled.div`
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
`;

export const PrimaryButton = styled.button`
    padding: 13px 26px;

    border-radius: 999px;
    border: none;

    background: #0066ff;
    color: #ffffff;

    font-size: 15px;
    font-weight: 600;

    cursor: pointer;

    box-shadow: 0 8px 18px rgba(0, 102, 255, 0.25);
`;

export const SecondaryButton = styled.button`
    padding: 13px 26px;

    border-radius: 999px;
    border: 1px solid #d1d5db;

    background: #ffffff;
    color: #111827;

    font-size: 15px;
    font-weight: 600;

    cursor: pointer;
`;