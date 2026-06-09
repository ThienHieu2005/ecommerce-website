import React, { useEffect, useState } from "react";

import * as S from "./style";

import { useNavigate } from "react-router-dom";

import { useMutationHooks } from "../../hooks/useMutationHook";

import * as UserService from "../../services/UserService";

import * as message from "../../components/Message/Message";

import { useSelector } from "react-redux";

const ChangePasswordPage = () => {

    const navigate = useNavigate();

    const user = useSelector((state) => state.user);

    const [showPassword, setShowPassword] = useState(false);

    const [oldPassword, setOldPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const mutation = useMutationHooks((data) => {
        const { id, access_token, ...passwordData } = data;

        return UserService.changePasswordUser(
            id,
            passwordData,
            access_token
        );
    });

    const { data, isError, isSuccess } = mutation;

    useEffect(() => {

        if (
            isSuccess &&
            data?.status === "OK"
        ) {

            message.success();

            navigate("/");

        } else if (isError) {

            message.error();

        }

    }, [
        isSuccess,
        isError,
        data,
        navigate
    ]);

    const handleChangePassword = () => {

        if (
            newPassword !== confirmNewPassword
        ) {

            message.error(
                "Mật khẩu xác nhận không khớp"
            );

            return;
        }

        mutation.mutate({
            id: user?.id,
            access_token: user?.access_token,
            oldPassword,
            newPassword,
            confirmNewPassword,
        });
    };

    return (

        <S.Container>

            <S.ModalBox>

                <S.CloseButton
                    aria-label="Close"
                    onClick={() => navigate('/')}
                >
                    &times;
                </S.CloseButton>

                <S.FormSection>

                    <S.BackButton
                        onClick={() => navigate('/')}
                    >

                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M15 18l-6-6 6-6" />
                        </svg>

                    </S.BackButton>

                    <S.Title>
                        Đổi mật khẩu
                    </S.Title>

                    <S.Subtitle>
                        Cập nhật mật khẩu tài khoản PTITTECH
                    </S.Subtitle>

                    <form
                        onSubmit={(e) =>
                            e.preventDefault()
                        }
                    >

                        <S.InputGroup>

                            <S.Input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }

                                placeholder="Mật khẩu hiện tại"

                                value={oldPassword}

                                onChange={(e) =>
                                    setOldPassword(
                                        e.target.value
                                    )
                                }
                            />

                            <S.ShowPassword
                                type="button"

                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword
                                    ? "Ẩn"
                                    : "Hiện"}
                            </S.ShowPassword>

                        </S.InputGroup>

                        <S.InputGroup>

                            <S.Input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }

                                placeholder="Mật khẩu mới"

                                value={newPassword}

                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                            />

                        </S.InputGroup>

                        <S.InputGroup>

                            <S.Input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }

                                placeholder="Xác nhận mật khẩu mới"

                                value={confirmNewPassword}

                                onChange={(e) =>
                                    setConfirmNewPassword(
                                        e.target.value
                                    )
                                }
                            />

                        </S.InputGroup>

                        {data?.status === "ERR" && (

                            <span
                                style={{
                                    color: "red"
                                }}
                            >
                                {data?.message}
                            </span>

                        )}

                        <S.SubmitButton
                            type="button"

                            onClick={
                                handleChangePassword
                            }

                            disabled={
                                !oldPassword ||
                                !newPassword ||
                                !confirmNewPassword
                            }
                        >
                            Đổi mật khẩu
                        </S.SubmitButton>

                    </form>

                    <S.Footer>

                        <p>

                            Quay lại{" "}

                            <a
                                href="#profile"

                                onClick={() =>
                                    navigate('/')
                                }

                                style={{
                                    cursor: "pointer"
                                }}
                            >
                                tài khoản của tôi
                            </a>

                        </p>

                    </S.Footer>

                </S.FormSection>

                <S.ImageSection>

                    <S.MascotImage
                        src="https://salt.tikicdn.com/ts/upload/df/48/21/b4d225f471fe06887284e1341751b36e.png"
                    />

                    <div>

                        <S.PromoTitle>
                            Bảo mật tài khoản
                        </S.PromoTitle>

                        <S.PromoText>
                            Thay đổi mật khẩu định kỳ để an toàn hơn
                        </S.PromoText>

                    </div>

                </S.ImageSection>

            </S.ModalBox>

        </S.Container>
    );
};

export default ChangePasswordPage;