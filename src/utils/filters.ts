export default {
  phoneFormat(value: string) {
    if (!value) {
      return
    }
    return value.replace(/(\d{4})(\d{3})(\d{3,5})/, '$1 $2 $3')
  },

  priceFormat(value: string) {
    if (!value) {
      return value
    }
    value = Math.round(+value).toString()
    return this.numberFormat(value)
  },

  numberFormat(value: string) {
    if (!value) {
      return value
    }
    return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  },
}
