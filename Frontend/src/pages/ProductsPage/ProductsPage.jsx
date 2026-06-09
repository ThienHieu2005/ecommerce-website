import React, { useEffect, useMemo, useState } from "react";

import {
  WrapperContainer,
  WrapperTitle,
  WrapperFilter,
  WrapperProductList,
  WrapperLoadMore,
  WrapperButtonMore
} from "./style";

import CardComponent from "../../components/CardComponent/CardComponent";
import NavBarComponent from "../../components/NarbarComponent/NarbarComponent";

import { Col, Row } from "antd";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import { useSelector } from "react-redux";

const HomePage = () => {
  const searchProduct = useSelector(
    (state) => state?.product?.search
  );

  const [visibleCount, setVisibleCount] = useState(6);
  const [typeProducts, setTypeProducts] = useState([]);
  const [stateProducts, setStateProducts] = useState([]);

  const [filters, setFilters] = useState({
    keyword: "",
    category: "all",
    minPrice: "",
    maxPrice: "",
  });

  const { data: products } = useQuery({
    queryKey: ["products", searchProduct],
    queryFn: () => ProductService.getAllProduct(searchProduct),
    retry: 3,
    retryDelay: 1000,
  });

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();

    if (res.status === "OK") {
      setTypeProducts(res.data);
    }
  };

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  useEffect(() => {
    if (products?.data) {
      setStateProducts(products.data);
    }
  }, [products]);

  useEffect(() => {
    setVisibleCount(6);
  }, [filters, searchProduct]);

  const filteredProducts = useMemo(() => {
    return stateProducts.filter((product) => {
      const keywordMatch =
        product.Name?.toLowerCase().includes(
          filters.keyword.toLowerCase()
        );

      const categoryMatch =
        filters.category === "all" ||
        product.Type === filters.category;

      const price = Number(product.Price);

      const min = filters.minPrice
        ? Number(filters.minPrice)
        : 0;

      const max = filters.maxPrice
        ? Number(filters.maxPrice)
        : Infinity;

      const priceMatch = price >= min && price <= max;

      return keywordMatch && categoryMatch && priceMatch;
    });
  }, [stateProducts, filters]);

  return (
    <div>
      <WrapperContainer>
        <WrapperTitle>Sản phẩm</WrapperTitle>

        <Row gutter={0}>
          <Col span={4}>
            <WrapperFilter>
              <NavBarComponent
                filters={filters}
                setFilters={setFilters}
                typeProducts={typeProducts}
              />
            </WrapperFilter>
          </Col>

          <Col span={20}>
            <WrapperProductList>
              {filteredProducts
                .slice(0, visibleCount)
                .map((product) => (
                  <CardComponent
                    key={product.Id}
                    countInStock={product.CountInStock}
                    description={product.description}
                    image={product.Image}
                    name={product.Name}
                    price={product.Price}
                    rating={product.Rating}
                    type={product.Type}
                    discount={product.Discount}
                    id={product.Id}
                  />
                ))}
            </WrapperProductList>
          </Col>
        </Row>
      </WrapperContainer>

      <WrapperLoadMore>
        {visibleCount < filteredProducts.length && (
          <WrapperButtonMore
            onClick={() =>
              setVisibleCount((prev) => prev + 6)
            }
          >
            Xem thêm
          </WrapperButtonMore>
        )}
      </WrapperLoadMore>
    </div>
  );
};

export default HomePage;