export {extractReadableChamberName}

function extractReadableChamberName({chamberName, chamberId}: {chamberName?: string, chamberId?: string}) {
  if (!!chamberName) {
    return chamberName.trim();
  }
  if(!chamberId) {
    return '';
  }
  const civileChamberNumber = chamberId.match(/CIV\.([1-3])/)
  if (!!civileChamberNumber) {
    return `Chambre civile ${convertToLatinCiphers(civileChamberNumber[1])}`.trim();
  } else if (chamberId === 'SOC') {
    return 'Chambre sociale';
  } else if (chamberId === 'COMM'){
    return 'Chambre commerciale'
  } else if (chamberId === 'CR') {
    return 'Chambre criminelle'
  }
  return '';
}

function convertToLatinCiphers(value: string) {
  switch(value) {
    case "1":
      return "I";
      case "2":
        return "II";
        case "3":
          return "III";
          default:
            return ''
  }
}
