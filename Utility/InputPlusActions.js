function generateRandomNumber() {
    const randomNumber = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
    return randomNumber;
}
export const addNewFields = (field, setField) => {
    setField([...field, { _id: generateRandomNumber() }])
}
export const removeNewFields = (field, setField, id) => {
    const newfields = field.filter((filterItem) => filterItem?._id !== id)
    setField(newfields)
}