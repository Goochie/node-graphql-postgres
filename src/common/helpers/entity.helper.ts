export const dateApplyTimeZone = {
  from: (val) => new Date(val.getTime() - (new Date()).getTimezoneOffset() * 60 * 1000),
  to: (val) => val,
}
