export const userTimeZone = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezone;
};


