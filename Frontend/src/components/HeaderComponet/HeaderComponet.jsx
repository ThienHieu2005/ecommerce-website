import React, { useState, useEffect } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import * as S from "./style";
import {
  UserOutlined,
  ShoppingCartOutlined
} from "@ant-design/icons";
import logo from '../../assets/Logo.png'
import TopBar from '../../assets/TopBar.png'
import {
  Button,
  Input,
  Badge,
  Popover,
  AutoComplete
} from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import * as UserService from "../../services/UserService";
import * as CartService from "../../services/CartService";
import * as ProductService from "../../services/ProductService";

import { resetUser } from "../../redux/slices/UserSlice";
import { searchProduct } from "../../redux/slices/ProductSlice";

const HeaderComponent = () => {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userAvatar, setUserAvatar] = useState("");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const [products, setProducts] = useState([]);
  const [options, setOptions] = useState([]);

  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };

  const handleLogout = async () => {
    await UserService.logoutUser();

    dispatch(resetUser());

    localStorage.removeItem("user");
  };

  useEffect(() => {
    setUserAvatar(user?.avatar);
  }, [user?.avatar]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await ProductService.getAllProduct();

        if (res?.data) {
          setProducts(res.data);
        }
      } catch (error) {
        console.log("Lỗi lấy danh sách sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);


  const [typeProducts, setTypeProducts] = useState([]);

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();

    if (res.status === "OK") {
      setTypeProducts(res.data);
    }
  };

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  const content = (
    <div>
      <S.ContentPopup onClick={() => navigate("/profile")}>
        Thông tin người dùng
      </S.ContentPopup>

      <S.ContentPopup onClick={() => navigate("/my-order")}>
        Đơn hàng của tôi
      </S.ContentPopup>

      {user?.isAdmin && (
        <S.ContentPopup onClick={() => navigate("/system/admin")}>
          Quản lý hệ thống
        </S.ContentPopup>
      )}

      <S.ContentPopup onClick={() => navigate("/change-password")}>
        Đổi mật khẩu
      </S.ContentPopup>

      <S.ContentPopup onClick={handleLogout}>
        Đăng xuất
      </S.ContentPopup>
    </div>
  );

  const handleSearch = (value) => {
    setSearch(value);

    if (!value.trim()) {
      setOptions([]);
      return;
    }

    const keyword = value.toLowerCase();

    const filteredProducts = products
      .filter((product) =>
        product.Name?.toLowerCase().includes(keyword)
      )
      .slice(0, 8);

    const newOptions = filteredProducts.map((product) => ({
      value: product.Name,
      label: product.Name
    }));

    setOptions(newOptions);
  };

  const fetchCartCount = async () => {
    try {
      if (!user?.id || !user?.access_token) {
        setCartCount(0);
        return;
      }

      const res = await CartService.getCartByUser(
        user.id,
        user.access_token
      );

      if (res?.status === "OK") {
        setCartCount(res?.orderItem?.length || 0);
      }
    } catch (error) {
      console.log("Lỗi lấy số lượng giỏ hàng:", error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [user?.id, user?.access_token]);

  useEffect(() => {
    const handleCartUpdated = () => {
      fetchCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdated
      );
    };
  }, [user?.id]);

  return (
    <>
      <S.TopBar>
        <img
          src={TopBar}
          alt="topbar"
        />
      </S.TopBar>
      <S.Header>
        <S.Logo onClick={() => navigate("/")}>
          <img
            src={logo}
            alt="logo"
          />
          <S.TextHeader>PTITTech</S.TextHeader>
        </S.Logo>

        <S.Search>
          <AutoComplete
            style={{ width: "100%" }}
            options={options}
            value={search}
            onSearch={handleSearch}
            onSelect={(value) => {
              setSearch(value);
              dispatch(searchProduct(value));
            }}
          >
            <Input.Search
              placeholder="Tìm kiếm sản phẩm"
              size="large"
              enterButton
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={(value) => {
                dispatch(searchProduct(value));
              }}
            />
          </AutoComplete>
        </S.Search>

        <S.Action>
          <Badge count={cartCount} size="small">
            <S.CartIcon onClick={() => navigate("/order")}>
              <ShoppingCartOutlined />
            </S.CartIcon>
          </Badge>

          {user?.email ? (
            <Popover content={content} trigger="click">
              <S.UserInfo>
                {user?.avatar ? (
                  <S.UserAvatar
                    src={userAvatar}
                    alt="avatar"
                  />
                ) : (
                  <S.UserIcon>
                    <UserOutlined />
                  </S.UserIcon>
                )}

                <S.UserName>
                  {user.name || user.email}
                </S.UserName>
              </S.UserInfo>
            </Popover>
          ) : (
            <S.Login onClick={handleNavigateLogin}>
              <Button type="default">
                <S.LoginButtonContent>
                  <UserOutlined />
                  <span>Tài khoản</span>
                </S.LoginButtonContent>
              </Button>
            </S.Login>
          )}
        </S.Action>
      </S.Header>
      <S.WrapperTypeProduct>

        <TypeProduct
          key="all"
          name="Tất cả sản phẩm"
        />

        {typeProducts.map((item) => (
          <TypeProduct
            key={item.Type}
            name={item.Type}
          />
        ))}

      </S.WrapperTypeProduct>
    </>
  );
};

export default HeaderComponent;