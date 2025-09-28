let d = "2025-09-28T11:11:02.235Z"
 const createdDate = new Date(d);
  const currentDate = new Date();
  const diff = currentDate.getTime() - createdDate.getTime();
  const diffImDays = Math.round(diff / (1000 * 60 * 60 * 24)) + 1;

  console.log(diffImDays);
  