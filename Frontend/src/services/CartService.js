import axios from "axios"

export const getCartByUser = async (userId, access_token) => {
    const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/cart/${userId}`,
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        }
    )
    return res.data
}

export const addToCart = async (data, access_token) => {
    const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/add`,
        data,
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        }
    )
    return res.data
}

export const updateCartAmount = async (data, access_token) => {
    const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/cart/update-amount`,
        data,
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        }
    )
    return res.data
}

export const removeCartItem = async (data, access_token) => {
    const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/cart/remove`,
        {
            headers: {
                token: `Bearer ${access_token}`
            },
            data
        }
    )
    return res.data
}

export const deleteAllCartByUser = async (userId, access_token) => {
    const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/cart/delete-all/${userId}`,
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        }
    )
    return res.data
}