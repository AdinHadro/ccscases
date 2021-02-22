"use strict";
const stripe = require("stripe")("sk_test_51IIti8D4sdWxJpjKuwFJUvIMOAeGpzCTXsG5hAUxUEJUI7Dm7KFEMSHvDZNSR8qlvquL3mIiyaRhB9LqjjW4KnLO00fDV4q9Ls");

module.exports = {
  create: async (ctx) => {
    const {
      address,
      price,
      products,
      postalCode,
      token,
      city,
      state,
      buyerName,
      buyerLastname,
      buyerEmail
    } = ctx.request.body;
    console.log(ctx.request.body)
    try {
      await stripe.charges.create({
        amount: products.map(x => x.price).reduce((a, b) => a + b, 0) * 100,
        currency: "usd",
        description: `Order created ${new Date()}`,
        source: token,
      });

      try {
        const order = await strapi.services.order.create({
        //   user: ctx.state.user.id,

          address,
          amount: price,
          products,
          postalCode,
          city,
          state,
          buyerName,
          buyerLastname,
          buyerEmail,
        });

        return order;
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  },
  
};
