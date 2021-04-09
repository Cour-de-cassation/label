export { getBooleanItem, getDateItem, setBooleanItem, setDateItem };

function getBooleanItem(key: string) {
  const item = localStorage.getItem(key) as 'true' | 'false' | null;
  if (item === null) {
    return null;
  }
  switch (item) {
    case 'true':
      return true;
    case 'false':
      return false;
  }
}

function setBooleanItem(key: string, value: boolean) {
  const stringValue = value ? 'true' : 'false';
  localStorage.setItem(key, stringValue);
}

function getDateItem(key: string) {
  const item = localStorage.getItem(key);
  if (item === null) {
    return null;
  }
  return new Date(item);
}

function setDateItem(key: string, value: Date) {
  const stringValue = value.toISOString();
  localStorage.setItem(key, stringValue);
}
