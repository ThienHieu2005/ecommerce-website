import * as S from './style';
import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as message from "../../components/Message/Message";
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/UserSlice';
import { Upload } from 'antd';
import { CameraOutlined } from '@ant-design/icons';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [avatar, setAvatar] = useState('');

    const mutation = useMutationHooks(
        ({ id, data, access_token }) => UserService.updateUser(id, data, access_token)
    );

    const { isPending } = mutation;

    useEffect(() => {
        setName(user?.name || user?.Name || '');
        setEmail(user?.email || user?.Email || '');
        setPhone(user?.phone || user?.Phone || '');
        setAddress(user?.address || user?.Address || '');
        setCity(user?.city || user?.City || '');
        setAvatar(user?.avatar || user?.Avatar || '');
    }, [user]);

    const handleOnChangeName = (e) => setName(e.target.value);
    const handleOnChangeEmail = (e) => setEmail(e.target.value);
    const handleOnChangePhone = (e) => setPhone(e.target.value);
    const handleOnChangeAddress = (e) => setAddress(e.target.value);
    const handleOnChangeCity = (e) => setCity(e.target.value);

    const validateUserInfo = () => {
        const emailTrim = email.trim();
        const phoneTrim = phone.trim();
        const nameTrim = name.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(0[0-9]{9}|\+84[0-9]{9})$/;

        if (!nameTrim) {
            message.error("Vui lòng nhập họ và tên!");
            return false;
        }

        if (!emailTrim) {
            message.error("Vui lòng nhập email!");
            return false;
        }

        if (!emailRegex.test(emailTrim)) {
            message.error("Email không đúng định dạng!");
            return false;
        }

        if (!phoneTrim) {
            message.error("Vui lòng nhập số điện thoại!");
            return false;
        }

        if (!phoneRegex.test(phoneTrim)) {
            message.error("Số điện thoại không đúng định dạng!");
            return false;
        }

        return true;
    };

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0];

        if (file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }

            setAvatar(file.preview);
        }
    };

    const handleOnChangeUpdate = () => {
        if (!user?.id || !user?.access_token) {
            message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
            return;
        }

        if (!validateUserInfo()) {
            return;
        }

        mutation.mutate(
            {
                id: user.id,
                data: {
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    address: address.trim(),
                    city: city.trim(),
                    avatar
                },
                access_token: user.access_token
            },
            {
                onSuccess: (res) => {
                    if (res?.status === 'OK') {
                        message.success("Cập nhật thông tin thành công!");

                        const payloadUpdateRedux = {
                            Id: user.id,
                            Name: res?.data?.Name || name.trim(),
                            Email: res?.data?.Email || email.trim(),
                            Phone: res?.data?.Phone || phone.trim(),
                            Address: res?.data?.Address || address.trim(),
                            City: res?.data?.City || city.trim(),
                            Avatar: res?.data?.Avatar || avatar,
                            IsAdmin: res?.data?.IsAdmin ?? user.isAdmin,
                            access_token: user.access_token
                        };

                        dispatch(updateUser(payloadUpdateRedux));

                        localStorage.setItem(
                            'user',
                            JSON.stringify(payloadUpdateRedux)
                        );
                    } else {
                        message.error(res?.message || "Cập nhật thất bại!");
                    }
                },
                onError: () => {
                    message.error("Có lỗi xảy ra, vui lòng thử lại!");
                }
            }
        );
    };

    return (
        <S.Container>
            <S.Title>Cài đặt tài khoản</S.Title>

            <S.Card>
                <S.CardHeader>
                    <h3>Thông tin cá nhân</h3>
                    <p>Cập nhật thông tin chi tiết và ảnh đại diện của bạn tại đây.</p>
                </S.CardHeader>

                <S.CardBody>
                    <S.AvatarSection>
                        <Upload
                            showUploadList={false}
                            onChange={handleOnChangeAvatar}
                            maxCount={1}
                            beforeUpload={() => false}
                        >
                            <S.AvatarWrapper>
                                <S.AvatarImage
                                    src={avatar || 'https://joeschmoe.io/api/v1/random'}
                                    alt="avatar"
                                />

                                <S.AvatarHoverOverlay>
                                    <CameraOutlined style={{ fontSize: '20px', color: '#fff' }} />
                                    <span>Thay ảnh</span>
                                </S.AvatarHoverOverlay>
                            </S.AvatarWrapper>
                        </Upload>

                        <S.Label>Avatar</S.Label>
                    </S.AvatarSection>

                    <S.FormSection>
                        <S.FormGroup>
                            <S.Label>Họ và tên</S.Label>
                            <S.Input
                                value={name}
                                onChange={handleOnChangeName}
                                placeholder="Nhập họ và tên"
                            />
                        </S.FormGroup>

                        <S.FormGroup>
                            <S.Label>Email</S.Label>
                            <S.Input
                                value={email}
                                onChange={handleOnChangeEmail}
                                type="email"
                                placeholder="Nhập địa chỉ email"
                            />
                        </S.FormGroup>

                        <S.FormGridTwoColumn>
                            <S.FormGroup>
                                <S.Label>Số điện thoại</S.Label>
                                <S.Input
                                    value={phone}
                                    onChange={handleOnChangePhone}
                                    placeholder="Nhập số điện thoại"
                                />
                            </S.FormGroup>

                            <S.FormGroup>
                                <S.Label>Tỉnh/Thành phố</S.Label>
                                <S.Input
                                    value={city}
                                    onChange={handleOnChangeCity}
                                    placeholder="Nhập tỉnh/thành phố"
                                />
                            </S.FormGroup>
                        </S.FormGridTwoColumn>

                        <S.FormGroup>
                            <S.Label>Địa chỉ chi tiết</S.Label>
                            <S.Input
                                value={address}
                                onChange={handleOnChangeAddress}
                                placeholder="Nhập địa chỉ chi tiết"
                            />
                        </S.FormGroup>

                        <S.ButtonGroup>
                            <S.Button
                                type="button"
                                onClick={handleOnChangeUpdate}
                                disabled={isPending}
                            >
                                {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </S.Button>
                        </S.ButtonGroup>
                    </S.FormSection>
                </S.CardBody>
            </S.Card>
        </S.Container>
    );
};

export default ProfilePage;