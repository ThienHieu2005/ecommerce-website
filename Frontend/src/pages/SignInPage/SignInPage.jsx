import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import * as S from "./style";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slices/UserSlice";

const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const { data, isSuccess } = mutation;

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();

      const userData = {
        ...data?.data,
        access_token: data?.access_token,
      };

      dispatch(updateUser(userData));
      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/");
    }
  }, [isSuccess, data, navigate, dispatch]);

  const handleSignIn = () => {
    mutation.mutate({ email, password });
  };

  return (
    <S.Container>
      <S.ModalBox>
        <S.CloseButton onClick={() => navigate("/")} >&times;</S.CloseButton> {/*HTML entity */}
        <S.FormSection>
          <S.BackButton>
            <FontAwesomeIcon onClick={() => navigate("/")} icon={faChevronLeft} />
          </S.BackButton>

          <S.Title>Đăng nhập bằng email</S.Title>
          <S.Subtitle>Nhập email và mật khẩu tài khoản Tiki</S.Subtitle>

          <form onSubmit={(e) => e.preventDefault()}>
            <S.InputGroup>
              <S.Input
                type="email"
                placeholder="abc@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </S.InputGroup>

            <S.InputGroup>
              <S.Input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <S.ShowPassword
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                Hiện
              </S.ShowPassword>
            </S.InputGroup>

            {data?.status === "ERR" && (
              <span style={{ color: "red" }}>{data?.message}</span>
            )}

            <S.SubmitButton
              type="button"
              onClick={handleSignIn}
              disabled={!email || !password}
            >
              Đăng nhập
            </S.SubmitButton>
          </form>

          <S.Footer>
            <p>
              Chưa có tài khoản?{" "}
              <a
                href="#create"
                onClick={() => navigate("/sign-up")}
                style={{ cursor: "pointer" }}
              >
                Tạo tài khoản
              </a>
            </p>
          </S.Footer>
        </S.FormSection>

        <S.ImageSection>
          <S.MascotImage src="https://salt.tikicdn.com/ts/upload/df/48/21/b4d225f471fe06887284e1341751b36e.png" />

          <div>
            <S.PromoTitle>Mua sắm tại PTITTECH</S.PromoTitle>
            <S.PromoText>Siêu ưu đãi mỗi ngày</S.PromoText>
          </div>
        </S.ImageSection>
      </S.ModalBox>
    </S.Container>
  );
};

export default SignInPage;