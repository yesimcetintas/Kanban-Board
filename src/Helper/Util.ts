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

  // a little function to help us with reordering the result
const reorder = (list: any, startIndex: any, endIndex:any) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default reorder;

