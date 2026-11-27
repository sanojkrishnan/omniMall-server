// OM_ + country(2) + state(2) + pin(4) + YYMMDD(6) + timestamp(13)
function generateOrderId(country, state, pincode) {
  const date = new Date();
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const time = String(date.getTime());

  const letters = (str) =>
    String(str)
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 2)
      .toUpperCase()
      .padEnd(2, "X");

  const pin = String(pincode).slice(-4);

  return `OM_${letters(country)}${letters(state)}${pin}${year}${month}${day}${time}`;
}

module.exports = generateOrderId;
