import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import * as S from './style'

import * as CartService from '../../services/CartService'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCartShopping,
    faCheck
} from '@fortawesome/free-solid-svg-icons'

const OrderSuccess = () => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
        const clearCart = async () => {
            try {
                if (user?.id && user?.access_token) {
                    await CartService.deleteAllCartByUser(
                        user.id,
                        user.access_token
                    )

                    window.dispatchEvent(new Event("cartUpdated"))

                }
            } catch (error) {
                console.log("Lỗi xóa giỏ hàng:", error)
            }
        }

        clearCart()
    }, [user?.id, user?.access_token, dispatch])

    return (
        <S.Wrapper>
            <S.IconWrapper>
                <S.CartIcon>
                    <FontAwesomeIcon icon={faCartShopping} />
                </S.CartIcon>

                <S.CheckBadge>
                    <FontAwesomeIcon icon={faCheck} />
                </S.CheckBadge>
            </S.IconWrapper>

            <S.Title>
                Mua hàng thành công
            </S.Title>

            <S.Description>
                Đơn hàng của bạn sẽ được xử lí và vận chuyển đến bạn trong thời gian sớm nhất.
            </S.Description>

            <S.ButtonGroup>
                <S.ViewOrderButton onClick={() => navigate('/my-order')}>
                    Xem đơn hàng
                </S.ViewOrderButton>

                <S.HomeButton onClick={() => navigate('/products')}>
                    Trang chủ
                </S.HomeButton>
            </S.ButtonGroup>
        </S.Wrapper>
    )
}

export default OrderSuccess