import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved, faTruckFast, faTags, faHeadset } from "@fortawesome/free-solid-svg-icons";

import CardComponent from "../../components/CardComponent/CardComponent";
import * as ProductService from "../../services/ProductService";
import * as S from "./style";

const ICON_COLOR = "#0066ff";

const PRODUCT_QUERY_CONFIG = {
    queryKey: ["featured-products"],
    queryFn: () => ProductService.getAllProduct(),
    retry: 3,
    retryDelay: 1000,
};

const sectionTitleStyle = {
    fontSize: "28px",
    margin: "0 0 10px 0",
};

const sectionDescriptionStyle = {
    color: "#666",
    margin: 0,
    fontSize: "18px",
};

const getProductCreatedTime = (product) => {
    const createdAt = product.CreatedAt || product.createdAt;
    return new Date(createdAt || 0).getTime();
};

const mapProductToCardProps = (product) => ({
    countInStock: product.CountInStock,
    description: product.description,
    image: product.Image,
    name: product.Name,
    price: product.Price,
    rating: product.Rating,
    type: product.Type,
    discount: product.Discount,
    id: product.Id,
});

const ServicesBar = () => (
    <S.ServicesContainer>
        <S.ServiceItem>
            <S.IconWrapper>
                <FontAwesomeIcon
                    icon={faShieldHalved}
                    color={ICON_COLOR}
                    fontSize="22px"
                />
            </S.IconWrapper>

            <div>
                <S.ServiceTitle>Chính hãng 100%</S.ServiceTitle>
                <S.ServiceDescription>Bảo hành toàn quốc</S.ServiceDescription>
            </div>
        </S.ServiceItem>

        <S.ServiceItem>
            <S.IconWrapper>
                <FontAwesomeIcon
                    icon={faTruckFast}
                    color={ICON_COLOR}
                    fontSize="22px"
                />
            </S.IconWrapper>

            <div>
                <S.ServiceTitle>Giao hàng nhanh</S.ServiceTitle>
                <S.ServiceDescription>Miễn phí từ 5 triệu</S.ServiceDescription>
            </div>
        </S.ServiceItem>

        <S.ServiceItem>
            <S.IconWrapper>
                <FontAwesomeIcon icon={faTags} color={ICON_COLOR} fontSize="22px" />
            </S.IconWrapper>

            <div>
                <S.ServiceTitle>Giá tốt nhất</S.ServiceTitle>
                <S.ServiceDescription>Hoàn tiền nếu rẻ hơn</S.ServiceDescription>
            </div>
        </S.ServiceItem>

        <S.ServiceItem>
            <S.IconWrapper>
                <FontAwesomeIcon icon={faHeadset} color={ICON_COLOR} fontSize="22px" />
            </S.IconWrapper>

            <div>
                <S.ServiceTitle>Hỗ trợ 24/7</S.ServiceTitle>
                <S.ServiceDescription>Tư vấn nhiệt tình</S.ServiceDescription>
            </div>
        </S.ServiceItem>
    </S.ServicesContainer>
);

const ProductSection = ({ title, description, products = [], onViewAll }) => (
    <S.ProductsSection>
        <S.SectionHeader>
            <div>
                <h2 style={sectionTitleStyle}>{title}</h2>
                <p style={sectionDescriptionStyle}>{description}</p>
            </div>

            <S.ViewAllBtn onClick={onViewAll}>
                Xem tất cả ➜
            </S.ViewAllBtn>
        </S.SectionHeader>

        <S.ProductGrid>
            {products.map((product) => (
                <CardComponent key={product.Id} {...mapProductToCardProps(product)} />
            ))}
        </S.ProductGrid>
    </S.ProductsSection>
);

const HomePage = () => {
    const navigate = useNavigate();

    const { data: products } = useQuery(PRODUCT_QUERY_CONFIG);

    const allProducts = useMemo(() => {
        return products?.data || [];
    }, [products]);

    const featuredProducts = useMemo(() => {
        return allProducts
            .filter((product) => Number(product.Discount) > 0)
            .slice(0, 4);
    }, [allProducts]);

    const newProducts = useMemo(() => {
        return [...allProducts]
            .sort((a, b) => getProductCreatedTime(b) - getProductCreatedTime(a))
            .slice(0, 6);
    }, [allProducts]);

    const goToProductsPage = () => {
        navigate("/products");
    };

    return (
        <div>
            <S.HeroContainer>
                <S.HeroTitle>Thiết bị công nghệ chính hãng, giá tốt nhất</S.HeroTitle>

                <S.HeroSubtitle>
                    Chuyên cung cấp PC, Laptop, Linh kiện máy tính và phụ kiện gaming chất
                    lượng cao
                </S.HeroSubtitle>

                <S.HeroButton as="button" onClick={goToProductsPage}>
                    Khám phá ngay ➜
                </S.HeroButton>
            </S.HeroContainer>

            <ServicesBar />

            <ProductSection
                title="Sản phẩm nổi bật"
                description="Những sản phẩm được lựa chọn kỹ càng cho bạn"
                products={featuredProducts}
                onViewAll={goToProductsPage}
            />

            <ProductSection
                title="Sản phẩm mới"
                description="Cập nhật những công nghệ mới nhất"
                products={newProducts}
                onViewAll={goToProductsPage}
            />

            <S.ConsultSection>
                <S.ConsultTitle>Bạn cần tư vấn?</S.ConsultTitle>

                <S.ConsultSubtitle>
                    Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn 24/7
                </S.ConsultSubtitle>

                <S.ContactBtn href="tel:18006868">
                    Liên hệ ngay: 1800 6868
                </S.ContactBtn>
            </S.ConsultSection>
        </div>
    );
};

export default HomePage;