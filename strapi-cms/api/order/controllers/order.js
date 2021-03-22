"use strict";
const stripe = require("stripe")(
  "sk_test_51IIti8D4sdWxJpjKuwFJUvIMOAeGpzCTXsG5hAUxUEJUI7Dm7KFEMSHvDZNSR8qlvquL3mIiyaRhB9LqjjW4KnLO00fDV4q9Ls"
);
const axios = require("axios");

const sendToAppCssCases = async (order) => {
  return axios.post(
    "https://app.ccscases.com/onboarding3.webapi",
    {
      order_date: `${new Date()}`,
      order_number: order.id,
      product_id: order.products[0].id,
      order_quantity: 1,
      customer_taxes: null,
      quantity: 1,
      price: order.products[0].price, 
      payment_method:"Mastercard",
      first_name: order.buyerName, 
      last_name: order.buyerLastname, 
      address_1: order.address,
      address_2: order.address2,
      city: order.city,
      state: order.state,
      postcode: order.postalCode,
      country: order.buyerCountry,
      email: order.buyerEmail, 
      phone: order.buyerPhone,
      customer_ip_address: "194.55.6.7",
    },

    {
      headers: {
        "webhook-secret": "Mtx6A8nkaBKoU4EWvvbhWxsHnoSCt",
      },
    }
  
  
    )
      
};
 


const sendToStripe = async (body) => {
  console.log(body)
  await stripe.charges.create({
    amount: body.products.map((x) => x.price).reduce((a, b) => a + b, 0) * 100,
    currency: "usd",
    description: `Order created ${new Date()}`,
    source: body.token,
  });
};

const saveInStrapi = async (body) => {
  const order = await strapi.services.order.create(
    {
      //   user: ctx.state.user.id,

      address: body.address,
      address2: body.address2,
      amount: body.price,
      products: body.products,
      postalCode: body.postalCode,
      city: body.city,
      state:body.state,
      buyerCountry: body.buyerCountry,
      buyerName: body.buyerName,
      buyerLastname: body.buyerLastname,
      buyerEmail: body.buyerEmail,
      buyerPhone: body.buyerPhone,
    }
  );

  return order;
};
const updateStrapi = async (body, orderId) => {
  return strapi.services.order.update({ id: orderId }, { apiResponse:body });
  };

module.exports = {
  create: async (ctx) => {
    try {

      if(ctx.request.body.paymentProvider === 'stripe')
        await sendToStripe(ctx.request.body);

      const order = await saveInStrapi(ctx.request.body);

      const apiResponse = await sendToAppCssCases(order);
      
      await updateStrapi(apiResponse.data,order.id)

      return order;
    } catch (error) {
      console.error(error);
    }
  },
};
