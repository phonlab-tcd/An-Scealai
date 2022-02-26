
function oneWeekFromNowMs() {
  const now = new Date();
  now.setDate(now.getDate() + 7);
  return now.getTime();
}

module.exports.oneWeekFromNowMs = oneWeekFromNowMs;
