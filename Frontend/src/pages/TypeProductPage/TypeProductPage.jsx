import CardComponent from "../../components/CardComponent/CardComponent";
import NavBarComponent from "../../components/NarbarComponent/NarbarComponent";
import * as ProductService from "../../services/ProductService";

import { Col, Row } from "antd";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const TypeProductPage = () => {
  const { state } = useLocation();

  const [products, setProducts] = useState([]);
  const [typeProducts, setTypeProducts] = useState([]);

  const searchProduct = useSelector(
    (state) => state?.product?.search
  );

  const [filters, setFilters] = useState({
    keyword: "",
    category: "all",
    minPrice: "",
    maxPrice: "",
  });

  const fetchProductType = async (type) => {
    const res = await ProductService.getProductType(type);

    if (res?.status === "OK") {
      setProducts(res?.data);
    }
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();

    if (res.status === "OK") {
      setTypeProducts(res.data);
    }
  };

  const filteredProducts = products?.filter((pro) => {
    const reduxSearchMatch =
      !searchProduct ||
      pro?.Name?.toLowerCase().includes(
        searchProduct.toLowerCase()
      );

    const keywordMatch =
      !filters.keyword ||
      pro?.Name?.toLowerCase().includes(
        filters.keyword.toLowerCase()
      );

    const categoryMatch =
      filters.category === "all" ||
      pro?.Type === filters.category;

    const price = Number(pro?.Price);

    const min = filters.minPrice
      ? Number(filters.minPrice)
      : 0;

    const max = filters.maxPrice
      ? Number(filters.maxPrice)
      : Infinity;

    const priceMatch = price >= min && price <= max;

    return (
      reduxSearchMatch &&
      keywordMatch &&
      categoryMatch &&
      priceMatch
    );
  });

  useEffect(() => {
    if (state) {
      fetchProductType(state);
    }
  }, [state]);

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  return (
    <div>
      <div style={{ padding: "20px 120px" }}>
        <h1
          style={{
            margin: "0px 0px 15px",
            fontFamily: "Arial, sans-serif",
            fontSize: "24px",
          }}
        >
          Sản phẩm
        </h1>

        <Row gutter={0}>
          <Col
            span={4}
            style={{
              padding: "15px 15px 15px",
              border: "1px solid #e0e0e0",
              borderRadius: "10px",
              background: "#fff",
            }}
          >
            <NavBarComponent
              filters={filters}
              setFilters={setFilters}
              typeProducts={typeProducts}
            />
          </Col>

          <Col
            span={20}
            style={{
              padding: "20px 30px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            {filteredProducts?.map((data) => (
              <CardComponent
                key={data.Id}
                countInStock={data.CountInStock}
                description={data.description}
                image={data.Image}
                name={data.Name}
                price={data.Price}
                rating={data.Rating}
                type={data.Type}
                discount={data.Discount}
                id={data.Id}
              />
            ))}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TypeProductPage;