const credit_rate = 50

export default function creditGenerator(amount: number) {
    return credit_rate * amount
}