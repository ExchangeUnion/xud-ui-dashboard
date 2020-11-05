export type SortingOrder = "asc" | "desc";

export const getComparator = <Key extends keyof any>(
  order: SortingOrder,
  orderBy: Key,
  groupBy?: Key
): ((
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy, groupBy)
    : (a, b) => -descendingComparator(a, b, orderBy, groupBy);
};

export const stableSort = <T>(
  array: T[],
  comparator: (a: T, b: T) => number
): T[] => {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const descendingComparator = <T>(
  a: T,
  b: T,
  orderBy: keyof T,
  groupBy?: keyof T
): number => {
  if (groupBy) {
    return (
      descendingComparator(a, b, groupBy) || descendingComparator(a, b, orderBy)
    );
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};
