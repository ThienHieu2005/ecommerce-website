import HomePage from "../pages/HomePage/HomePage"
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage"
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage"
import SignInPage from "../pages/SignInPage/SignInPage"
import SignUpPage from "../pages/SignUpPage/SignUpPage"
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage"
import ProfilePage from "../pages/ProfilePage/ProfilePage"
import AdminPage from "../pages/AdminPage/AdminPage"
import PaymentPage from "../pages/PaymentPage/PaymentPage"
import MyOrderPage from "../pages/MyOrderPage/MyOrderPage"
import OrderSuccessPage from "../pages/OrderSuccessPage/OrderSuccessPage"
import ChangePasswordPage from "../pages/ChangePasswordPage/ChangePasswordPage";


export const routes = [
    {
        path: '/products',
        page: ProductsPage,
        isShowHeader: true
    },

    {
        path: '/',
        page: HomePage,
        isShowHeader: true
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true
    },
    {
        path: '/order-success',
        page: OrderSuccessPage,
        isShowHeader: true
    },
    {
        path: '/my-order',
        page: MyOrderPage,
        isShowHeader: true
    },
    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true
    },
    {
        path: 'product/:type',
        page: TypeProductPage,
        isShowHeader: true
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false
    },
    {
        path: '/change-password',
        page: ChangePasswordPage,
        isShowHeader: false
    },
    {
        path: '/product-detail/:id',
        page: ProductDetailPage,
        isShowHeader: true
    },
    {
        path: '/profile',
        page: ProfilePage,
        isShowHeader: true
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: true,
        isPrivate: true
    },
    {
        path: '*',
        page: NotFoundPage,
        isShowHeader: false
    }
]