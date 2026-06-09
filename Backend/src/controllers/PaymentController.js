const crypto = require("crypto");
const qs = require("qs");
const OrderService = require("../services/OrderService");

const sortObject = (obj) => {
    let sorted = {};
    let str = [];

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }

    str.sort();

    for (let i = 0; i < str.length; i++) {
        sorted[str[i]] = encodeURIComponent(obj[str[i]])
            .replace(/%20/g, "+");
    }

    return sorted;
};

const createVnpayPayment = async (req, res) => {
    try {
        process.env.TZ = "Asia/Ho_Chi_Minh";

        const { orderId, amount } = req.body;

        const tmnCode = process.env.VNP_TMNCODE;
        const secretKey = process.env.VNP_HASHSECRET;
        let vnpUrl = process.env.VNP_URL;
        const returnUrl = process.env.VNP_RETURN_URL;

        const date = new Date();

        const createDate =
            date.getFullYear().toString() +
            String(date.getMonth() + 1).padStart(2, "0") +
            String(date.getDate()).padStart(2, "0") +
            String(date.getHours()).padStart(2, "0") +
            String(date.getMinutes()).padStart(2, "0") +
            String(date.getSeconds()).padStart(2, "0");

        let ipAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            "127.0.0.1";

        if (
            ipAddr === "::1" ||
            ipAddr === "::ffff:127.0.0.1"
        ) {
            ipAddr = "127.0.0.1";
        }

        let vnp_Params = {};

        vnp_Params["vnp_Version"] = "2.1.0";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = tmnCode;
        vnp_Params["vnp_Locale"] = "vn";
        vnp_Params["vnp_CurrCode"] = "VND";
        vnp_Params["vnp_TxnRef"] = String(orderId);

        vnp_Params["vnp_OrderInfo"] =
            "Thanh toan don hang " + orderId;

        vnp_Params["vnp_OrderType"] = "other";
        vnp_Params["vnp_Amount"] = Number(amount) * 100;
        vnp_Params["vnp_ReturnUrl"] = returnUrl;
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_CreateDate"] = createDate;

        vnp_Params = sortObject(vnp_Params);

        const signData = qs.stringify(vnp_Params, {
            encode: false,
        });

        const hmac = crypto.createHmac(
            "sha512",
            secretKey
        );

        const signed = hmac
            .update(Buffer.from(signData, "utf-8"))
            .digest("hex");

        vnp_Params["vnp_SecureHash"] = signed;

        vnpUrl +=
            "?" +
            qs.stringify(vnp_Params, {
                encode: false,
            });

        console.log("===== VNPAY DEBUG =====");
        console.log("SIGN DATA:", signData);
        console.log("SECURE HASH:", signed);
        console.log("PAYMENT URL:", vnpUrl);
        console.log("=======================");

        return res.status(200).json({
            status: "OK",
            paymentUrl: vnpUrl,
        });
    } catch (e) {
        console.log("VNPAY ERROR:", e);

        return res.status(500).json({
            status: "ERR",
            message: e.message,
        });
    }
};

const vnpayReturn = async (req, res) => {
    try {

        const responseCode =
            req.query.vnp_ResponseCode;

        const transactionStatus =
            req.query.vnp_TransactionStatus;

        const orderId =
            req.query.vnp_TxnRef;

        if (
            responseCode === "00" &&
            transactionStatus === "00"
        ) {

            await OrderService.updatePaidOrder(orderId);

            return res.redirect(
                "http://localhost:3000/order-success"
            );
        }

        return res.redirect(
            "http://localhost:3000/paymentFailed"
        );

    } catch (e) {

        console.log("VNPAY RETURN ERROR:", e);

        return res.redirect(
            "http://localhost:3000/paymentFailed"
        );
    }
};

module.exports = {
    createVnpayPayment,
    vnpayReturn,
};