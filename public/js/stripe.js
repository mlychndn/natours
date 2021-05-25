import axios from "axios";
import { showAlert } from "./alert";




const stripe = Stripe('pk_test_51IVgVMK5BvXFrm8bK9zpKkjVAD8j5ke0ykhhJqCv38kUYFQQaXJpca3pONNgHmHF9i99ZsPTPkltkTcHgU2dS6Gh003vzQbnuI');

export const bookTour =async tourId => {
    try{
       //1) Get checkout session from api
    const session = await axios(`/api/v1/checkout/${tourId}`)

    console.log(session);

    //2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
        sessionId: session.data.session.id
    });

    }catch(err){
        console.log(err)
        showAlert('error', err);
    }
    
}