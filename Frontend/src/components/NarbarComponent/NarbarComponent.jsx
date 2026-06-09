import React from "react";
import { Input, Select, Typography, Space } from "antd";
import { WrapperNarbar, WrapperLabel } from "./style";

const { Title, Text } = Typography;
const { Option } = Select;

const NavBarComponent = ({ filters, setFilters, typeProducts }) => {
    const handleChange = (name, value) => {
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleReset = () => {
        setFilters({
            keyword: "",
            category: "all",
            minPrice: "",
            maxPrice: "",
        });
    };

    return (
        <WrapperNarbar>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <Title level={4} style={{ margin: 0 }}>
                    Bộ lọc
                </Title>

                <Text
                    onClick={handleReset}
                    style={{ color: "#0066ff", cursor: "pointer" }}
                >
                    Xóa
                </Text>
            </div>

            <Space orientation="vertical" size="large" style={{ display: "flex" }}>
                <div>
                    <WrapperLabel>Tìm kiếm</WrapperLabel>
                    <Input
                        placeholder="Nhập tên sản phẩm..."
                        size="large"
                        value={filters.keyword}
                        onChange={(e) => handleChange("keyword", e.target.value)}
                    />
                </div>

                <div>
                    <WrapperLabel>Danh mục</WrapperLabel>
                    <Select
                        value={filters.category}
                        style={{ width: "100%" }}
                        onChange={(value) => handleChange("category", value)}
                        size="large"
                    >
                        <Option value="all">Tất cả</Option>

                        {typeProducts.map((item) => (
                            <Option key={item.Type} value={item.Type}>
                                {item.Type}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div>
                    <WrapperLabel>Khoảng giá</WrapperLabel>

                    <Select
                        value={filters.priceRange || "all"}
                        style={{ width: "100%" }}
                        size="large"
                        onChange={(value) => {
                            if (value === "all") {
                                setFilters((prev) => ({
                                    ...prev,
                                    minPrice: "",
                                    maxPrice: "",
                                    priceRange: "all",
                                }));
                                return;
                            }

                            const [min, max] = value.split("-");

                            setFilters((prev) => ({
                                ...prev,
                                minPrice: min,
                                maxPrice: max,
                                priceRange: value,
                            }));
                        }}
                    >
                        <Option value="all">Tất cả giá</Option>

                        <Option value="0-2000000">
                            Dưới 2 triệu
                        </Option>

                        <Option value="2000000-4000000">
                            Từ 2 - 4 triệu
                        </Option>

                        <Option value="4000000-7000000">
                            Từ 4 - 7 triệu
                        </Option>

                        <Option value="7000000-13000000">
                            Từ 7 - 13 triệu
                        </Option>

                        <Option value="13000000-20000000">
                            Từ 13 - 20 triệu
                        </Option>

                        <Option value="20000000-999999999">
                            Trên 20 triệu
                        </Option>
                    </Select>
                </div>
            </Space>
        </WrapperNarbar>
    );
};

export default NavBarComponent;