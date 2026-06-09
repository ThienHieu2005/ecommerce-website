import React, { useEffect, useState } from "react";
import * as s from "./style";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import * as message from "../../components/Message/Message";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleOnChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleOnChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleOnChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const mutation = useMutationHooks((data) => UserService.signUpUser(data));

  const { data, isError, isSuccess } = mutation;

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      navigate("/sign-in")
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const handleSignUp = () => {
    mutation.mutate({
      email,
      password,
      confirmPassword,
    });
  };

  return (
    <s.Container>
      <s.ModalBox>
        <s.FormSection>
          <s.BackButton >
            <FontAwesomeIcon onClick={() => navigate("/sign-in")} icon={faChevronLeft} />
          </s.BackButton>

          <s.Title>Tạo tài khoản</s.Title>
          <s.Subtitle>Đăng ký tài khoản PTITTECH</s.Subtitle>

          <form onSubmit={(e) => e.preventDefault()}>
            <s.InputGroup>
              <s.Input
                type="email"
                placeholder="abc@email.com"
                value={email}
                onChange={handleOnChangeEmail}
              />
            </s.InputGroup>

            <s.InputGroup>
              <s.Input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={handleOnChangePassword}
              />

              <s.ShowPassword
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </s.ShowPassword>
            </s.InputGroup>

            <s.InputGroup>
              <s.Input
                type={showPassword ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={handleOnChangeConfirmPassword}
              />
            </s.InputGroup>

            {data?.status === "ERR" && (
              <span style={{ color: "red" }}>{data?.message}</span>
            )}

            <s.SubmitButton
              type="button"
              onClick={handleSignUp}
              disabled={!email || !password || !confirmPassword}
            >
              Tạo tài khoản
            </s.SubmitButton>
          </form>

          <s.Footer>
            <p>
              Đã có tài khoản?{" "}
              <a
                href="#sign-in"
                onClick={() => navigate("/sign-in")}
                style={{ cursor: "pointer" }}
              >
                Đăng nhập
              </a>
            </p>
          </s.Footer>
        </s.FormSection>

        <s.ImageSection>
          <s.MascotImage src="https://salt.tikicdn.com/ts/upload/df/48/21/b4d225f471fe06887284e1341751b36e.png" />

          <div>
            <s.PromoTitle>Mua sắm tại PTITTECH</s.PromoTitle>
            <s.PromoText>Siêu ưu đãi mỗi ngày</s.PromoText>
          </div>
        </s.ImageSection>
      </s.ModalBox>
    </s.Container>
  );
};

export default SignUpPage;