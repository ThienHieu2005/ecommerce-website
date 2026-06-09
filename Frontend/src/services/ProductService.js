import axios from "axios"

export const getAllProduct = async (search, limit = 100) => {
    let res = {}

    if (search && search.length > 0) {
        res = await axios.get(
            `${import.meta.env.VITE_API_URL}/product/get-all?filter=name&filter=${search}&limit=${limit}`
        )
    } else {
        res = await axios.get(
            `${import.meta.env.VITE_API_URL}/product/get-all?limit=${limit}`
        )
    }

    return res.data
}

export const getProductType = async (type, search) => {
    if (type) {
        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/product/get-all?filter=type&filter=${type}`
        )

        return res.data
    }
}

export const createProduct = async (data, access_token) => {
    const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/product/create`,
        data,
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        }
    )

    return res.data
}

export const getDetailProduct = async (id) => {
    const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/product/get-details/${id}`
    )

    return res.data
}

export const updateProduct = async (id, data, access_token) => {
    const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/product/update/${id}`,
        data,
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        }
    )

    return res.data
}

export const deleteProduct = async (id, access_token) => {
    const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/product/delete/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        }
    )

    return res.data
}

export const getAllTypeProduct = async () => {
    const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/product/get-all-type`
    )

    return res.data
}