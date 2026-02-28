
const prefix = `rk-or-v1`

const ApikeyGenerator = (length:number) => {
    let suffix = "";
    const AlphabetSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for(let x = 0; x < length; x++) {
        suffix += AlphabetSet[Math.floor(Math.random() * AlphabetSet.length)]
    }
    let key = `${prefix}-${suffix}`;
    return key;
}

export default ApikeyGenerator;