import React, { useEffect, useState } from 'react';
import * as ProductService from '../../services/ProductService';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faFacebookF,
    faInstagram,
    faYoutube
} from '@fortawesome/free-brands-svg-icons';

import {
    faLocationDot,
    faPhone,
    faEnvelope
} from '@fortawesome/free-solid-svg-icons';

import * as S from './style';

const FooterComponent = () => {

    const [typeProducts, setTypeProducts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllTypeProduct = async () => {
            const res = await ProductService.getAllTypeProduct();

            if (res.status === 'OK') {
                setTypeProducts(res.data);
            }
        };

        fetchAllTypeProduct();
    }, []);

    const handleNavigateType = (type) => {
        navigate(
            `/product/${type
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/ /g, "_")}`,
            { state: type }
        );
    };

    return (
        <S.WrapperFooter>

            <S.WrapperContainer>

                {/* BRAND */}
                <S.WrapperBrandColumn>

                    <S.WrapperLogoSection>
                        <S.WrapperLogoIcon>
                            <img
                                src={logo}
                                alt="logo"
                            />
                        </S.WrapperLogoIcon>

                        <S.WrapperLogoText>
                            PTITTech
                        </S.WrapperLogoText>
                    </S.WrapperLogoSection>

                    <S.WrapperDescription>
                        Chuyên cung cấp thiết bị công nghệ và linh kiện máy tính
                        chính hãng, uy tín hàng đầu Việt Nam.
                    </S.WrapperDescription>

                    <S.WrapperSocialGroup>

                        <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <S.WrapperSocialIcon>
                                <FontAwesomeIcon
                                    icon={faFacebookF}
                                    style={{
                                        fontSize: '18px',
                                        color: '#fff'
                                    }}
                                />
                            </S.WrapperSocialIcon>
                        </a>

                        <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <S.WrapperSocialIcon>
                                <FontAwesomeIcon
                                    icon={faInstagram}
                                    style={{
                                        fontSize: '18px',
                                        color: '#fff'
                                    }}
                                />
                            </S.WrapperSocialIcon>
                        </a>

                        <a
                            href="https://www.youtube.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <S.WrapperSocialIcon>
                                <FontAwesomeIcon
                                    icon={faYoutube}
                                    style={{
                                        fontSize: '18px',
                                        color: '#fff'
                                    }}
                                />
                            </S.WrapperSocialIcon>
                        </a>

                    </S.WrapperSocialGroup>

                </S.WrapperBrandColumn>

                {/* QUICK LINK */}
                <S.WrapperColumn>

                    <S.WrapperColumnTitle>
                        Liên kết nhanh
                    </S.WrapperColumnTitle>

                    <S.WrapperQuickLink>

                        <S.WrapperLink
                            onClick={() => navigate('/products')}
                        >
                            Sản phẩm
                        </S.WrapperLink>

                        <S.WrapperLink
                            onClick={() => navigate('/profile')}
                        >
                            Tài khoản
                        </S.WrapperLink>

                        <S.WrapperLink
                            onClick={() => navigate('/my-order')}
                        >
                            Đơn hàng
                        </S.WrapperLink>

                        <S.WrapperLink
                            as="a"
                            href="tel:18006868"
                        >
                            Liên hệ
                        </S.WrapperLink>

                    </S.WrapperQuickLink>

                </S.WrapperColumn>

                {/* CATEGORY */}
                <S.WrapperColumn>

                    <S.WrapperColumnTitle>
                        Danh mục
                    </S.WrapperColumnTitle>

                    <S.WrapperLinkList>
                        {typeProducts.map((item) => (
                            <S.WrapperLinkItem key={item.Type}>
                                <S.WrapperLink
                                    onClick={() => handleNavigateType(item.Type)}
                                >
                                    {item.Type}
                                </S.WrapperLink>
                            </S.WrapperLinkItem>
                        ))}
                    </S.WrapperLinkList>

                </S.WrapperColumn>

                {/* CONTACT */}
                <S.WrapperColumn>

                    <S.WrapperColumnTitle>
                        Liên hệ
                    </S.WrapperColumnTitle>

                    <S.WrapperContactItem>
                        <FontAwesomeIcon
                            icon={faLocationDot}
                            style={{ color: '#0066ff' }}
                        />
                        97 Man Thiện, TP. Thủ Đức
                    </S.WrapperContactItem>

                    <S.WrapperContactItem>
                        <FontAwesomeIcon
                            icon={faPhone}
                            style={{ color: '#0066ff' }}
                        />
                        18006868
                    </S.WrapperContactItem>

                    <S.WrapperContactItem>
                        <FontAwesomeIcon
                            icon={faEnvelope}
                            style={{ color: '#0066ff' }}
                        />
                        n23dccn020@student.ptithcm.edu.vn
                    </S.WrapperContactItem>

                </S.WrapperColumn>

            </S.WrapperContainer>

            <S.WrapperDivider>
                © 2026 - Bản quyền thuộc về PTITTech
            </S.WrapperDivider>

        </S.WrapperFooter>
    );
};

export default FooterComponent;