import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import * as OrderService from '../../services/OrderService'
import { useSelector } from 'react-redux'
import * as S from './style'

const MyOrderPage = () => {
  const user = useSelector((state) => state.user)

  const [page, setPage] = useState(1)
  const limit = 5

  const queryOrder = useQuery({
    queryKey: ['orders', user?.id, page],

    queryFn: () =>
      OrderService.getOrderByUserId(
        user?.id,
        user?.access_token,
        page,
        limit
      ),

    enabled: !!user?.id && !!user?.access_token
  })

  const { data, isLoading, isError } = queryOrder

  const orders = data?.data || []
  const totalPage = data?.totalPage || 1

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString('vi-VN') + '₫'
  }

  const formatDate = (date) => {
    if (!date) return ''

    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCancelOrder = async (orderId) => {
    const isConfirm = window.confirm('Bạn có chắc muốn hủy đơn hàng này không?')

    if (!isConfirm) return

    try {
      const res = await OrderService.cancelOrder(orderId, user.access_token)

      if (res.status === 'OK') {
        alert('Hủy đơn hàng thành công')
        queryOrder.refetch()
      } else {
        alert(res.message || 'Hủy đơn hàng thất bại')
      }
    } catch (error) {
      console.log('Cancel order error:', error)
      alert('Có lỗi xảy ra khi hủy đơn hàng')
    }
  }

  if (isLoading) {
    return (
      <S.LoadingWrapper>
        Đang tải lịch sử mua hàng...
      </S.LoadingWrapper>
    )
  }

  if (isError) {
    return (
      <S.ErrorWrapper>
        Không thể tải lịch sử mua hàng
      </S.ErrorWrapper>
    )
  }

  return (
    <S.Container>
      <S.Title>Lịch sử mua hàng</S.Title>

      {orders.length === 0 ? (
        <S.EmptyOrder>
          Bạn chưa có đơn hàng nào.
        </S.EmptyOrder>
      ) : (
        <>
          {orders.map((order) => (
            <S.OrderCard key={order.Id}>
              <S.OrderHeader>
                <div>
                  <S.OrderId>
                    Đơn hàng #{order.Id}
                  </S.OrderId>

                  <S.OrderDate>
                    Ngày đặt: {formatDate(order.CreatedAt)}
                  </S.OrderDate>
                </div>

                <S.StatusWrapper>
                  <S.DeliveryStatus delivered={order.IsDelivered}>
                    {order.IsDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}
                  </S.DeliveryStatus>

                  <S.PaymentStatus paid={order.IsPaid}>
                    {order.IsPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </S.PaymentStatus>
                </S.StatusWrapper>
              </S.OrderHeader>

              {order.orderItems?.map((item) => (
                <S.OrderItem key={item.Id}>
                  <S.ProductImg
                    src={item.Image}
                    alt={item.Name}
                  />

                  <S.ProductInfo>
                    <S.ProductName>
                      {item.Name}
                    </S.ProductName>

                    <S.ProductQuantity>
                      Số lượng: {item.Amount}
                    </S.ProductQuantity>
                  </S.ProductInfo>

                  <S.ProductPrice>
                    {formatPrice(item.Price)}
                  </S.ProductPrice>
                </S.OrderItem>
              ))}

              <S.OrderFooter>
                <S.ShippingInfo>
                  <div>
                    Người nhận: <strong>{order.ShippingFullName}</strong>
                  </div>

                  <div>
                    SĐT: {order.ShippingPhone}
                  </div>

                  <div>
                    Địa chỉ: {order.ShippingAddress}, {order.ShippingCity}
                  </div>

                  <div>
                    Phương thức thanh toán: {order.PaymentMethod}
                  </div>
                </S.ShippingInfo>

                <S.TotalWrapper>
                  <S.TotalLabel>
                    Tổng tiền
                  </S.TotalLabel>

                  <S.TotalPrice>
                    {formatPrice(order.TotalPrice)}
                  </S.TotalPrice>

                  {!order.IsDelivered && (
                    <S.CancelButton
                      onClick={() => handleCancelOrder(order.Id)}
                    >
                      Hủy đơn hàng
                    </S.CancelButton>
                  )}
                </S.TotalWrapper>
              </S.OrderFooter>
            </S.OrderCard>
          ))}

          <S.Pagination>
            <S.PageButton
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              ‹
            </S.PageButton>

            {Array.from({ length: totalPage }, (_, index) => {
              const pageNumber = index + 1

              return (
                <S.PageNumber
                  key={pageNumber}
                  active={page === pageNumber}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </S.PageNumber>
              )
            })}

            <S.PageButton
              disabled={page === totalPage}
              onClick={() => setPage(page + 1)}
            >
              ›
            </S.PageButton>
          </S.Pagination>
        </>
      )}
    </S.Container>
  )
}

export default MyOrderPage