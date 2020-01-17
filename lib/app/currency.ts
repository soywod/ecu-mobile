import isNil from "lodash/fp/isNil"

const intl = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
})

function toEuro(value: number | null | undefined) {
  if (isNil(value)) return ""
  return intl.format(Number(value)).replace(/\u202F/g, " ")
}

export {toEuro}
export default {toEuro}
