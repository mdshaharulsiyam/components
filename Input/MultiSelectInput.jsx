
import Select from 'react-select';
const MultiSelectInput = ({ data, setSelectedOption, defaultValue, lebel }) => {
    const handleChange = (value) => {
        if (!setSelectedOption) return false
        setSelectedOption(value);
    };

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            padding: '3px', 
            border: state.isFocused ? '1px solid #2684FF' : '1px solid #ced4da',
            boxShadow: 'none', 
            '&:hover': {
                border: '1px solid #2684FF'
            },
            outline: 'none' // remove outline
        }),
        input: (provided) => ({
            ...provided,
            padding: '0',
            outline: 'none'
        }),
        placeholder: (provided) => ({
            ...provided,
            padding: '0',
            outline: 'none'
        }),
        singleValue: (provided) => ({
            ...provided,
            padding: '0',
            outline: 'none'
        }),
    };
    return (
        <>
            <div className="w-full relative">
                {lebel && <p className="pb-2">{lebel}</p>}
                <Select
                    defaultValue={[defaultValue]}
                    isMulti
                    name="colors"
                    options={data}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleChange}
                    styles={customStyles}
                />
            </div>

        </>
    )
}

export default MultiSelectInput
