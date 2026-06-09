import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    Id: 0,
    UserId: 0,
    ShippingFullName: '',
    ShippingAddress: '',
    ShippingCity: '',
    ShippingPhone: '',
    PaymentMethod: '',
    ItemsPrice: 0,
    ShippingPrice: 0,
    TotalPrice: 0,
    IsPaid: false,
    PaidAt: null,
    IsDelivered: false,
    DeliveredAt: null,

    orderItem: []
};

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {

        addOrderProduct: (state, action) => {
            const { orderItem } = action.payload

            const itemOrder = state?.orderItem?.find(
                (item) => item?.product === orderItem.product
            )

            if (itemOrder) {
                itemOrder.amount += orderItem?.amount
            } else {
                state.orderItem.push(orderItem)
            }
        },

        removeOrderProduct: (state, action) => {
            const { idProduct } = action.payload

            state.orderItem = state.orderItem.filter(
                (item) => item.product !== idProduct
            )
        },

        updateOrderAmount: (state, action) => {
            const { productId, amount } = action.payload

            const item = state.orderItem.find(
                (item) => item.product === productId
            )

            if (item) {
                item.amount = amount
            }
        },

        resetOrder: (state) => {
            state.orderItem = []
        }
    },
})

export const {
    addOrderProduct,
    removeOrderProduct,
    updateOrderAmount,
    resetOrder
} = orderSlice.actions

export default orderSlice.reducer