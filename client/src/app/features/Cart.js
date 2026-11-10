import { createSlice } from "@reduxjs/toolkit";
import safeJsonParse from "../../helpers/safeJsonParse";

const cartInfo = safeJsonParse(localStorage.getItem("cart"), {});

const initialState = {
  productsAddedToCart: cartInfo.productsAddedToCart || 0,
  totalPrice: cartInfo.totalPrice || 0,
  deliveryPrice: cartInfo.deliveryPrice || 0,
  discount: cartInfo.discount || 0,
  subTotal: cartInfo.subTotal || 0,
  couponCode: cartInfo.couponCode || null,
  cartItems: cartInfo.cartItems || [],
  shippingAdress: cartInfo.shippingAdress || null,
  minimumPurchase: cartInfo.minimumPurchase || null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProductToCart: (state, action) => {
      // product info
      const product = action.payload;

      // change cart info
      state.productsAddedToCart += 1;
      state.cartItems.push(product);
      state.totalPrice +=
        (product.newPrice || product.price) * product.userQuantity;
      state.subTotal = state.totalPrice + state.deliveryPrice - state.discount;

      // update local storage
      localStorage.setItem("cart", JSON.stringify(state));
    },
    removeProductFromCart: (state, action) => {
      // Product Id
      const productId = action.payload;

      // Check if product exist
      const deletedProduct = state.cartItems.find(
        (cartItem) => cartItem._id === productId
      );

      // Remove product
      if (deletedProduct) {
        state.productsAddedToCart -= 1;
        state.totalPrice -=
          (deletedProduct.newPrice || deletedProduct.price) *
          deletedProduct.userQuantity;
        state.subTotal =
          state.totalPrice + state.deliveryPrice - state.discount;
        state.cartItems = state.cartItems.filter(
          (cartItem) => cartItem._id !== productId
        );

        // update coupon code
        if (state.totalPrice < state.minimumPurchase) {
          state.couponCode = null;
          state.discount = 0;
        }

        // Update Local Storage
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
    clearCart: (state) => {
      state.productsAddedToCart = 0;
      state.totalPrice = 0;
      state.discount = 0;
      state.subTotal = 0;
      state.couponCode = null;
      state.cartItems = [];
      localStorage.removeItem("cart");
    },
    quantityCounter: (state, action) => {
      const { _id, type } = action.payload;
      const selectedProduct = state.cartItems.find(
        (cartItem) => cartItem._id === _id
      );
      if (selectedProduct) {
        if (type === "INCREASE") {
          selectedProduct.userQuantity += 1;
          state.totalPrice += selectedProduct.newPrice || selectedProduct.price;
        } else if (type === "DECREASE" && selectedProduct.userQuantity > 1) {
          selectedProduct.userQuantity -= 1;
          state.totalPrice -= selectedProduct.newPrice || selectedProduct.price;

          // update coupon code
          if (state.totalPrice < state.minimumPurchase) {
            state.couponCode = null;
            state.discount = 0;
          }
        } else if (type === "DECREASE" && selectedProduct.userQuantity === 1) {
          state.cartItems = state.cartItems.filter(
            (cartItem) => cartItem._id !== _id
          );

          state.productsAddedToCart -= 1;
          state.totalPrice -=
            (selectedProduct.newPrice || selectedProduct.price) *
            selectedProduct.userQuantity;

          // update coupon code
          if (state.totalPrice < state.minimumPurchase) {
            state.couponCode = null;
            state.discount = 0;
          }
        }
        state.subTotal =
          state.totalPrice + state.deliveryPrice - state.discount;
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
    applyCouponCode: (state, action) => {
      const { discountValue, minimumPurchase, maxDiscount, code } =
        action.payload;
      const discount = state.totalPrice * (discountValue / 100);
      state.discount = discount > maxDiscount ? maxDiscount : discount;
      state.subTotal = state.totalPrice + state.deliveryPrice - state.discount;
      state.couponCode = code;
      state.minimumPurchase = minimumPurchase;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    disapplyCouponCode: (state) => {
      state.discount = 0;
      state.couponCode = null;
      state.subTotal = state.totalPrice + state.deliveryPrice - state.discount;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    changeShippingAdress: (state, action) => {
      state.shippingAdress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
