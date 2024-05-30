import React, { useState } from 'react'
import UpdateInput from './UpdateInput';
import Input from './Input';
import { FaPlus, FaXmark } from 'react-icons/fa6';
import { addNewFields, removeNewFields } from '../../Utils/InputPlusActions';
import { useForm } from 'react-hook-form';
// function generateRandomNumber() {
//     const randomNumber = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
//     return randomNumber;
// }
// export const addNewFields = (field, setField) => {
//     setField([...field, { _id: generateRandomNumber() }])
// }
// export const removeNewFields = (field, setField, id) => {
//     const newfields = field.filter((filterItem) => filterItem?._id !== id)
//     setField(newfields)
// }
const InputPlus = ({ Fields, setFields, lebel, type, placeholder, classNames, status, handler, valueName, fieldFor, actions, actionStyles, inputFor }) => {
    const { register } = useForm();
    return (
        <>
            {
                Fields?.map((item) => {
                    if (fieldFor == 'update') {
                        return <div key={item?._id} className='flex justify-end items-end gap-2'>
                            <UpdateInput key={item?._id} lebel={lebel ? lebel : null} type={type ? type : 'text'} placeholder={placeholder ? placeholder : 'Enter your text here'} defaultValue={item[valueName] ? item[valueName] : ''} classNames={classNames ? classNames : ''} rules={{ ...register(`${inputFor}-${item?._id}`, { required: true }) }} status={status && status} handler={handler && handler} />
                            <div className='flex items-center justify-end w-fit gap-2'>
                                {
                                    actions?.plus && <button type='button' className={`bg-red-600 p-2 text-xl rounded-full text-white ${actionStyles}`}>
                                        <FaXmark />
                                    </button>
                                }
                                {
                                    actions?.cross && <button type='button' className={`bg-green-600 p-2 rounded-full text-white text-xl`} >
                                        <FaPlus />
                                    </button>
                                }
                            </div>
                        </div>
                    } else {
                        return <div key={item?._id} className='flex justify-end items-end gap-2'>
                            <Input key={item?._id} lebel={lebel ? lebel : null} type={type ? type : 'text'} placeholder={placeholder ? placeholder : 'Enter your text here'} defaultValue={item[valueName] ? item[valueName] : ''} classNames={classNames ? classNames : ''} rules={{ ...register(`${inputFor}-${item?._id}`, { required: true }) }} status={status && status} />
                            <div className='flex items-center justify-end w-fit gap-2'>
                                {
                                    actions?.cross && <button onClick={() => {
                                        removeNewFields(Fields, setFields, item?._id)
                                    }} type='button' className={`bg-red-600 p-2 text-xl rounded-full text-white ${actionStyles}`}>
                                        <FaXmark />
                                    </button>
                                }
                                {
                                    actions?.plus && <button onClick={() => {
                                        addNewFields(Fields, setFields)
                                    }} type='button' className={`bg-green-600 p-2 rounded-full text-white text-xl`} >
                                        <FaPlus />
                                    </button>
                                }
                            </div>
                        </div>
                    }

                }

                )
            }
        </>
    )
}

export default InputPlus
