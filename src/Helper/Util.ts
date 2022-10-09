export const formatDate = (value: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (!date) return "";
  
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  
    const day = date.getDate();
    const month = months[date.getMonth()];
    return day + " " + month;
  }