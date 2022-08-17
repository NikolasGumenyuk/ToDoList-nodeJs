const getToday = () => {
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();

  return [todayDay, todayMonth, todayYear];
}

module.exports = {
  getToday,
};
