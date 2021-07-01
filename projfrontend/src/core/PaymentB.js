import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cartEmpty, loadCart } from "./helper/CartHelper";
import { getMeToken, processPayment } from "./helper/paymentBHelper";
import { createOrder } from "./helper/OrderHelper";
import { isAuthenticated } from "../auth/helper";
import DropIn from "braintree-web-drop-in-react";

const PaymentB = ({ products, setReload = (f) => f, reload = undefined }) => {
  const [infor, setInfor] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
  });

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const showbtDropIn = () => {
    return (
      <div>
        {infor.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: infor.clientToken }}
              onInstance={(instance) => (infor.instance = instance)}
            />
            <button
              className="btn btn-block btn-success rounded"
              onClick={onPurchase}
            >
              Buy
            </button>
          </div>
        ) : (
          <h3>Please Login or add something to your cart</h3>
        )}
      </div>
    );
  };

  const onPurchase = () => {
    setInfor({ loading: true });
    let nonce;
    console.log(infor);
    let getNonce = infor.instance.requestPaymentMethod().then((data) => {
      nonce = data.nonce;

      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getAmount(products),
      };

      processPayment(userId, token, paymentData)
        .then((response) => {
          setInfor({ ...infor, loading: false, success: response.success });
          console.log("PAYMENT SUCCESS");

          const orderData = {
            products: products,
            transaction_id: response.transaction.id,
            amount: response.transaction.amount,
          };
          createOrder(userId, token, orderData);

          cartEmpty(() => {
            console.log("Cart Emptied !!");
          });
          setReload(!reload);
        })
        .catch((error) => {
          setInfor({ ...infor, loading: false, success: false, error: error });
          console.log("PAYMENT FAILED");
        });
    });
  };

  const getToken = (userId, token) => {
    getMeToken(userId, token).then((info) => {
      if (infor.error) {
        setInfor({ ...infor, error: info.error });
      } else {
        const clientToken = info.clientToken;
        setInfor({ ...infor, clientToken });
      }
    });
  };

  const getAmount = (products) => {
    let amount = 0;
    products.map((product) => {
      amount = amount + product.price;
    });
    return amount;
  };

  return (
    <div>
      <h3 className="text-white">Your Bill is {getAmount(products)} $</h3>
      {showbtDropIn()}
    </div>
  );
};

export default PaymentB;
