export function currencyFormat(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "NZD",
  })
}
