import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';

const TypeProduct = ({ name }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigatetype = (type) => {
    if (type === "Tất cả sản phẩm") return navigate("/products");
    navigate(`/product/${type.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "_")}`, { state: type });
  };

  // Kiểm tra xem tab này có đang được chọn hay không
  const isActive = name === "Tất cả sản phẩm" ? location.pathname === "/products" : location.state === name;

  return (
    <h1
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '15px',
        fontWeight: isActive ? 600 : 500,
        color: isActive ? '#0088cc' : '#333',
        padding: '0 4px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        margin: '0',
        transition: 'color 0.15s ease'
      }}
      onClick={() => handleNavigatetype(name)}
    >
      {name}
    </h1>
  );
};

export default TypeProduct;