// import axios from 'axios';

// const Stripe = require('stripe');

// const stripe = Stripe(
//   'pk_test_51ULj0iADEzNwyD0L7J6uw1Vv1xgdBFJjHkA5KWnACjea8OcfRzvzbWeL38xl02yZqAgKQUmEPaayRTO0kgZg1swh00c0niHtCr',
// );

// export const bookTour = async (tourId) => {
//   const session = await axios(
//     `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
//   );

// };
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51ULj0iADEzNwyD0L7J6uw1Vv1xgdBFJjHkA5KWnACjea8OcfRzvzbWeL38xl02yZqAgKQUmEPaayRTO0kgZg1swh00c0niHtCr',
);

export const bookTour = async (tourId) => {
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
