import axios from "axios"

export const getOrderByUserId = async (id, access_token, page = 1, limit = 5) => {
    const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/order/get-order-details/${id}?page=${page}&limit=${limit}`,
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        }
    )

    console.log('API RESPONSE:', res)

    return res.data
}

export const createOrder = async (data, access_token) => {
    const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/order/create`,
        data,
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        }
    )

    return res.data
}

export const cancelOrder = async (id, access_token) => {
    const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/order/cancel-order/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        }
    )

    return res.data
}

export const getAllOrder = async (access_token) => {
    const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/order/get-all-order`,
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        }
    )

    return res.data
}
export const updateOrder = async (id, data, access_token) => {
    const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/order/update-order/${id}`,
        data,
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        }
    )

    return res.data
}

export const createVnpayPayment = async (data, access_token) => {
    const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment/create-vnpay-payment`,
        data,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        }
    );

    return res.data;
};