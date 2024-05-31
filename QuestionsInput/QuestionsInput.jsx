import React from 'react'

const QuestionsInput = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);
    const initialQuestions = [
        { _id: '437834' },
    ]
    const [totalQuestions, setTotalQuestions] = useState(initialQuestions)
    const [correctAnswers, setCorrectAnswer] = useState([{ 437834: 'answer1-437834' }])
    const handelCorrectAnswers = (ans, questionId) => {
        const newAnswers = correctAnswers.filter(item => !(item.hasOwnProperty(questionId)))
        setCorrectAnswer([...newAnswers, { [questionId]: ans }])
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='p-6 bg-white rounded-md my-3'>
                {
                    totalQuestions.map((item, index) => <div className='my-5' key={item?._id}>
                        <div className='flex justify-start items-start gap-2'>
                            <div className='w-full'>
                                <Input status={errors} lebel={`${index + 1} . Question`} classNames={`border`} placeholder={`Introduction to Dart & Dart Cheatsheet`} rules={{ ...register(`Question-${item?._id}`, { required: true }) }} />
                                {[...Array(4).keys()].map(item2 => <div key={item2}>
                                    <p className='py-1'>answer {item2 + 1}</p>
                                    <div className='flex justify-start items-end gap-2'>
                                        <div style={{
                                            transition: '1s'
                                        }} onClick={() => {
                                            handelCorrectAnswers(`answer${item2 + 1}-${item?._id}`, item._id)
                                        }} className={`w-10 h-10 border rounded ml-auto  ${(correctAnswers.find(activeItem => activeItem[item._id] == `answer${item2 + 1}-${item?._id}`)) ? 'border-green-500' : 'border-red-500'} cursor-pointer`}>
                                            {
                                                (correctAnswers.find(activeItem => activeItem[item._id] == `answer${item2 + 1}-${item?._id}`)) && <img className='w-10 h-10 animate-pulse' src='https://i.ibb.co/4Zff45B/check-mark-1-1.png' alt="" />
                                            }
                                            {/* */}
                                        </div>
                                        <Input status={errors} classNames={`border`} placeholder={`N/A`} rules={{ ...register(`answer${item2 + 1}-${item?._id}`, { required: true }) }} />
                                    </div>
                                </div>)}

                            </div>
                            <button type='button' onClick={() => {
                                removeNewFields(totalQuestions, setTotalQuestions, item?._id)
                            }} className="border border-[red] text-[red] text-xl p-[10px] mt-8 px-3 rounded-md hover:scale-105 active:scale-95 transition-all">
                                <RiDeleteBin5Line />
                            </button>
                        </div>
                    </div>)
                }
                <div className='flex justify-end items-center gap-3'>
                    <button onClick={() => {
                        addNewFields(totalQuestions, setTotalQuestions)
                    }} className='btn-primary max-w-[95%] mx-auto mt-6 ' type='button'>Add Another Field</button>
                </div>
                <div className=' text-center'>
                    <Link to={-1} className='max-w-44 mt-6 mx-4 bg-[#F7D4D8] border border-[#FA1131] text-[#FA1131] py-2 px-10 rounded-md hover:scale-105 active:scale-95'>Cancel</Link>
                    <button className=' max-w-44 mt-6 mx-4 bg-[var(--primary-bg)] text-white py-2 px-10 rounded-md hover:scale-105 active:scale-95'>Submit</button>
                </div>

            </form>
    )
}

export default QuestionsInput
