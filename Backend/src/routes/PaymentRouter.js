const express = require("express");
const router = express.Router();

const PaymentController = require("../controllers/PaymentController");

router.post(
    "/create-vnpay-payment",
    PaymentController.createVnpayPayment
);

router.get(
    "/vnpay-return",
    PaymentController.vnpayReturn
);

module.exports = router;