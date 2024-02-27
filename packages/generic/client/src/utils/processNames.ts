export { processNames };
function processNames(firstName: string, lastName: string): string {
  if (firstName != '' || lastName != '') {
    return `${lastName.toUpperCase()} ${firstName.charAt(0).toUpperCase() + firstName.slice(1)}`;
  } else {
    return `${lastName} ${firstName}`;
  }
}
