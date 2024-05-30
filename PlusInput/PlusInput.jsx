import React, { useMemo, useState } from 'react'
function generateRandomNumber() {
    const randomNumber = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
    return randomNumber;
}

const PlusInput = () => {
    const totalNumbers = [
        { id: 'bjasu1' },
        { id: 'bjasu2' },
    ]
    const [callingNumers, setCallingNumbers] = useState(totalNumbers)
    return (
        <div>
            {
                callingNumers?.map((item) => <span key={item?.id} className='relative w-full'>
                    <input className='w-[90%] bg-[#FEFEFE] border py-3 px-2' type="text" name="" id="" defaultValue={'please insert a number'} />
                    <FaXmark onClick={() => {
                        const newNumbers = callingNumers.filter((filterItem) => filterItem?.id !== item?.id)
                        setCallingNumbers(newNumbers)
                    }} className='absolute right-3 top-[50%] translate-y-[-50%] text-2xl cursor-pointer ' />
                </span>)
            }
            <div className='w-full relative py-3'>
                <button onClick={() => {
                    setCallingNumbers([...callingNumers, { id: generateRandomNumber() }])
                }} className='p-2 bg-[#B47000] rounded-full absolute right-[4px]'>
                    <FaPlus className='text-2xl text-white' />
                </button>
            </div>
        </div>
    )
}

export default PlusInput
