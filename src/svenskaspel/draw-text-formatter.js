const api = {
  getDrawName(draw) {
    return draw.drawComment;
  },
  getTurnover(draw) {
    const turnover = parseInt(draw.turnover);
    return `turnover: ${new Intl.NumberFormat().format(turnover)} SEK\n` +
        `'13': ${new Intl.NumberFormat().format(turnover * 0.4)} SEK\n` +
        `'12': ${new Intl.NumberFormat().format(turnover * 0.15)} SEK\n` +
        `'11': ${new Intl.NumberFormat().format(turnover * 0.12)} SEK\n` +
        `'10': ${new Intl.NumberFormat().format(turnover * 0.25)} SEK\n`
  },
  getDeadline(draw) {
    return draw.closeTime;
  },

};

export default api;
