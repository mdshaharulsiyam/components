

import { Stripe, loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './Form/CheckOutForm';
const stripePromise = loadStripe('pk_test_51JwnGrLiLwVG3jO00U7B3YmokwdPnB6FKd1uresJgkbsL4f5xUfCmbFdBaGO42KvLmLfVzsgo1oIQToXABSTyypS00xQsEgKZ6');
interface ChildProps {
    setPaymentStatus: (arg0:any) => void
    data: any
}
const Payment = ({  setPaymentStatus, data }: ChildProps) => {
    return (
        <div className="px-14 py-4 payment">
            <h3 className="text-2xl md:text-3xl lg:text-4xl text-[#555555]">Payment</h3>
            <div className="flex justify-center items-center mx-auto w-[200px] h-[120px] my-5 rounded-lg overflow-hidden">
                <img className="h-full w-full object-cover" src="https://i.ibb.co/ymTdpBF/et-instant-access-to-your-money-with-the-paypal-cash-paypal-cash-card-mastercard-11563434343fm9cu4v8.png" alt="" />
            </div>
            <p className='text-center text-2xl pb-4'>Personal Information</p>
            <Elements stripe={stripePromise}>
                <CheckoutForm  setPaymentStatus={setPaymentStatus} data={data} />
            </Elements>
        </div>
    )
}

export default Payment
