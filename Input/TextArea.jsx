import React from 'react'

const TextArea = ({ lebel, type, placeholder, defaultValue, classNames, rules, status, handler }) => {
    return (
        <div className="w-full relative">
            {lebel && <p className="pb-2">{lebel}</p>}
            <textarea onInput={(e) => {
                handler && handler(e, rules?.name)
            }} {...rules} type={type ? type : 'text'} value={defaultValue ? defaultValue : ""} placeholder={placeholder ? placeholder : ''} className={`w-full resize-none p-2 outline-none rounded-md ${classNames}`} />
            {
                status?.[rules?.name] && <p className="absolute -bottom-4 text-red-600">{rules?.name} is requerd</p>
            }
        </div>
    )
}

export default TextArea
