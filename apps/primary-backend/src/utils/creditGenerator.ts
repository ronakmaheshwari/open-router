const credit_rate = 25

export default function creditGenerator(amount: number) {
    return credit_rate * amount
}