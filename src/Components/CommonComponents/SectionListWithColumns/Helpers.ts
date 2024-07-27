export function makeArrayOfRows<T>(array: Array<T>, columns: number): T[][] {
  const newArray = [];
  const newArrayLength = Math.ceil(array.length / columns);
  for (let i = 0; i < newArrayLength; i++) {
    newArray.push(array.slice(i * columns, i * columns + columns));
  }
  return newArray;
}
