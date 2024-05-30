import React from 'react'

const SelectInput = ({ lebel, defaultValue, classNames, rules, status, handler, options }) => {
    return (
        <div className="w-full relative">
            {lebel && <p className="pb-2">{lebel}</p>}
            <select onInput={(e) => {
                handler && handler(e, rules?.name)
            }} defaultValue={defaultValue ? defaultValue : "please select"} {...rules} className={`w-full p-2 outline-none rounded-md ${classNames}`}>
                {
                    options?.map(item => <option value={item} key={item}>{item}</option>)
                }
            </select>
            {
                status?.[rules?.name] && <p className="absolute -bottom-4 text-red-600">{rules?.name} is requerd</p>
            }
        </div>
    )
}

export default SelectInput
