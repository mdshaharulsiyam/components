import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { logEvent, Result, ErrorResult } from '../utils';
import { useAppDispatch, useAppSelector } from '../../Store/hook';
import { PaymentIntant } from '../../States/Payment/PaymentIntantSlice';
import Swal from 'sweetalert2';
const ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '18px',
            color: '#424770',
            letterSpacing: '0.025em',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#9e2146',
        },
    },
};
interface ChildProps {
    setPaymentStatus: (arg0: any) => void
    data: any
}
const CheckoutForm = ({ setPaymentStatus, data }: ChildProps): React.JSX.Element => {
    // console.log(data.price)
    const [postal, setPostal] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // @ts-ignore
    const [paymentMethod, setPaymentMethod] = useState<Stripe.PaymentMethod | null>(null);
    const { clientSecret } = useAppSelector(state => state.PaymentIntant)
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (!data.price || !data._id) return
        dispatch(PaymentIntant({ _id: data._id, price: Number(data.price) }))
    }, [data.price, data._id]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const target = event.target;
        if (!stripe || !elements || !clientSecret) {
            return;
        }

        const cardElement = elements.getElement(CardNumberElement);
        console.log(cardElement)
        if (!cardElement) {
            return;
        }

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    // @ts-ignore
                    name: target.name.value || '',
                    address: {
                        postal_code: postal,
                    },
                },
            }

        });

        if (payload.error) {
            console.log('[error]', payload.error);
            setErrorMessage(payload.error.message || null);
            setPaymentMethod(null);
        } else {
            // console.log('[PaymentMethod]', payload)
            const orderData: any = {
                transactionID: payload?.paymentIntent?.id,
                // @ts-ignore
                address: target.address.value,
                // @ts-ignore
                email: target.email.value,
                // @ts-ignore
                phone: target.number.value,
                // @ts-ignore
                name: target.name.value,
                amount: data.price,
                productId: data.id,
                quantity : data.quantity,
                status: 'paid'
            }
            setErrorMessage(null);
            setPaymentStatus(orderData)
            // @ts-ignore
            target.reset()
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "payment successful",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className='w-full'>
            <div className='md:grid md:grid-cols-2 gap-2 flex flex-col items-start justify-start md:items-center'>
                <div className='w-full'>
                    <label className=' block' htmlFor="name">Full Name</label>
                    <input
                        className='outline-none p-1'
                        style={{
                            width: "100%",

                            borderBottom: "2px solid #9494943D",
                        }}
                        required
                        placeholder="Jenny Rosen"
                        name='name'
                    />
                </div>
                <div className='w-full'>
                    <label className=' block' htmlFor="Email">Email </label>
                    <input
                        type='email'
                        className='outline-none p-1'
                        style={{
                            width: "100%",

                            borderBottom: "2px solid #9494943D",
                        }}
                        required
                        placeholder="JennyRosen@gmail.com"
                        name='email'
                    />
                </div>
            </div>
            <div className='md:grid md:grid-cols-2 gap-2 flex flex-col items-start justify-start md:items-center mt-3'>
                <div className='w-full'>
                    <label className=' block' htmlFor="Country">Address</label>
                    <input
                        className='outline-none p-1'
                        style={{
                            width: "100%",
                            borderBottom: "2px solid #9494943D",
                        }}
                        required
                        placeholder="dhaka bangladesh"
                        name='address'
                    />
                </div>
                <div className='w-full'>
                    <label className=' block' htmlFor="Number">Phone Number</label>
                    <input
                        type='number'
                        className='outline-none p-1'
                        style={{
                            width: "100%",
                            borderBottom: "2px solid #9494943D",
                        }}
                        required
                        placeholder="JennyRosen@gmail.com"
                        name='number'
                    />
                </div>
            </div>
            <label htmlFor="cardNumber">Card Number</label>
            <CardNumberElement
                className='outline-none p-1 border-b-2 border-[#9494943D]'
                id="cardNumber"
                onBlur={logEvent('blur')}
                onChange={logEvent('change')}
                onFocus={logEvent('focus')}
                onReady={logEvent('ready')}
                options={ELEMENT_OPTIONS}
            />
            <div className='md:grid md:grid-cols-2 gap-2 flex flex-col items-start justify-start md:items-center mt-3'>
                <div className='w-full'>
                    <label htmlFor="expiry">Card Expiration</label>
                    <CardExpiryElement
                        className='outline-none p-1 border-b-2 border-[#9494943D]'
                        id="expiry"
                        onBlur={logEvent('blur')}
                        onChange={logEvent('change')}
                        onFocus={logEvent('focus')}
                        onReady={logEvent('ready')}
                        options={ELEMENT_OPTIONS}
                    />
                </div>
                <div className='w-full flex justify-between items-center gap-[2%]'>
                    <div className='w-[49%]'>
                        <label htmlFor="cvc">CVC</label>
                        <CardCvcElement
                            className='outline-none p-1 border-b-2 border-[#9494943D]'
                            id="cvc"
                            onBlur={logEvent('blur')}
                            onChange={logEvent('change')}
                            onFocus={logEvent('focus')}
                            onReady={logEvent('ready')}
                            options={ELEMENT_OPTIONS}
                        />
                    </div>
                    <div className='w-[49%]'>
                        <label htmlFor="postal">Postal Code</label>
                        <input
                            className='outline-none p-[1px] border-b-2 border-[#9494943D] w-full text-lg'
                            id="postal"
                            required
                            placeholder="12345"
                            value={postal}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setPostal(event.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className='border-b-2  p-2 pt-4 flex justify-between items-center'>
                <p>Total</p> <p>${data?.price}</p>
            </div>
            {errorMessage && <ErrorResult><p className='text-red-500'>{errorMessage}</p></ErrorResult>}
            {paymentMethod && (
                <Result>Got PaymentMethod: {paymentMethod.id}</Result>
            )}
            <button className='w-full block text-white bg-[#3C3C3C] mt-6 py-3' type="submit" disabled={!stripe}>
                Confirm Pay
            </button>
        </form>
    );
};

export default CheckoutForm;
