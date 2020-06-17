const api = {
  getDrawName(draw) {
    return draw.drawComment;
  },
  getTurnover(draw) {
    const turnover = parseInt(draw.turnover) * 0.65;
    const sek_formatter = new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    });
    const sv_formatter = new Intl.NumberFormat('sv-SE', {
      currency: 'SEK',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    });


    if (draw.productName === "Europatipset") {

      return `total lines: ${sv_formatter.format(parseInt(draw.turnover))}\n` +
          `turnover: ${sek_formatter.format(turnover)}\n` +
          `'13': ${sek_formatter.format(turnover * 0.39)}\n` +
          `'12': ${sek_formatter.format(turnover * 0.22)}\n` +
          `'11': ${sek_formatter.format(turnover * 0.12)}\n` +
          `'10': ${sek_formatter.format(turnover * 0.25)}\n`;
    } else {
      return `total lines: ${sv_formatter.format(parseInt(draw.turnover))}\n` +
          `turnover: ${sek_formatter.format(turnover)}\n` +
          `'13': ${sek_formatter.format(turnover * 0.4)}\n` +
          `'12': ${sek_formatter.format(turnover * 0.15)}\n` +
          `'11': ${sek_formatter.format(turnover * 0.12)}\n` +
          `'10': ${sek_formatter.format(turnover * 0.25)}\n`;
    }

  },
  getDeadline(draw) {
    return draw.closeTime;
  },

};

export default api;
