import React, { useState, useEffect } from "react";
import "../styles.css";
import Base from "./Base";
import Card from "./Card";
import { loadCart } from "./helper/CartHelper";
import PaymentB from "./PaymentB";

export default function Cart() {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const loadAllProducts = (products) => {
    return (
      <div>
        <h2>This section is to Load Products</h2>
        {products.map((product, index) => (
          <Card
            key={index}
            product={product}
            addtoCart={false}
            removeFromCart={true}
            setReload={setReload}
          />
        ))}
      </div>
    );
  };

  return (
    <Base title="Cart Page" description="Ready to Checkout ...">
      <div className="row text-center">
        <div className="col-6">
          {products.length > 0 ? (
            loadAllProducts(products)
          ) : (
            <h3>NO Products in Cart</h3>
          )}
        </div>
        <div className="col-6">
          <PaymentB products={products} setReload={setReload} />
        </div>
      </div>
    </Base>
  );
}
