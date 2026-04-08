import Hero from "../../components/hero/Hero";
import Cart from "./Cart";

const MainCart = () => {
  return (
    <>
      <Hero title="Cart" path="/cart"/>
      <Cart />
    </>
  );
};

export default MainCart;
