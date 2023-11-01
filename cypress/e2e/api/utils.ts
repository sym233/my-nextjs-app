export function modStr(str: string): string {
  const l = str.length;
  const i = Math.floor(Math.random() * l);
  if (str[i] === '-') {
    return modStr(str);
  }
  const toChange = str[i] === '1' ? '2' : '1';

  return `${str.slice(0, i)}${toChange}${str.slice(i + 1)}`;
}
