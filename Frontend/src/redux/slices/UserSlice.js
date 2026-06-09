import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    id: '',
    isAdmin: false,
    city: '',
    access_token: '',
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const {
                Name = '',
                Email = '',
                Phone = '',
                Address = '',
                Avatar = '',
                Id = '',
                IsAdmin = false,
                City = '',
                access_token = ''
            } = action.payload

            state.name = Name
            state.email = Email
            state.phone = Phone
            state.address = Address
            state.avatar = Avatar
            state.id = Id
            state.isAdmin = IsAdmin
            state.city = City
            state.access_token = access_token
        },

        resetUser: (state) => {
            state.name = ''
            state.email = ''
            state.phone = ''
            state.address = ''
            state.avatar = ''
            state.id = ''
            state.isAdmin = false
            state.city = ''
            state.access_token = ''
        },
    },
})

export const { updateUser, resetUser } = userSlice.actions

export default userSlice.reducer