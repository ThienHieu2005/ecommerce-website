import axios from "axios"

export const loginUser = async (data) => {
    const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/sign-in`,
        data
    )

    return res.data
}

export const signUpUser = async (data) => {
    const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/sign-up`,
        data
    )

    return res.data
}

export const changePasswordUser = async (id, data, access_token) => {
    const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/change-password/${id}`,
        data,
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        }
    )

    return res.data
}

export const logoutUser = async () => {
    const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/log-out`
    )

    return res.data
}

export const updateUser = async (id, data, access_token) => {
    const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/update-user/${id}`,
        data,
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        }
    )

    return res.data
}

export const deleteUser = async (id, access_token) => {
    const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/user/delete-user/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        }
    )

    return res.data
}

export const getAllUser = async (access_token) => {
    const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/getAll`,
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        }
    )

    return res.data
}

export const getDetailUser = async (id, access_token) => {
    const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/get-details/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        }
    )

    return res.data
}