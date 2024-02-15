import { extractAppealRegisterRoleGeneralNumber } from './extractAppealRegisterRoleGeneralNumber';

describe('extractAppealRegisterRoleGeneralNumber', () => {
  const text = 'Pourvoi n° K 08-16.486 de telle décision';
  it('should extract appeal number from text', () => {
    const appealNumber = extractAppealRegisterRoleGeneralNumber(text);
    expect(appealNumber).toBe('08-16.486');
  });

  it('should extract RG number from regsiterNumber if source jurica', () => {
    const regsiterNumber = extractAppealRegisterRoleGeneralNumber(
      text,
      'jurica',
      "Cour d'appel de...",
      'appeals',
      '22/3455',
      'numeroRoleGeneral',
    );

    expect(regsiterNumber).toBe('22/3455');
  });

  it('should extract RG number from numeroRoleGeneral if source juritj', () => {
    const regsiterNumber = extractAppealRegisterRoleGeneralNumber(
      text,
      'juritj',
      'Tribunal de justice de...',
      'appeals',
      'registreNumber',
      '23/456',
    );

    expect(regsiterNumber).toBe('23/456');
  });

  it('should extract RG number from regsiterNumber if source jurinet', () => {
    const regsiterNumber = extractAppealRegisterRoleGeneralNumber(
      text,
      'jurinet',
      'Cour de cassation de...',
      's1122333',
      'registreNumber',
      'numeroRoleGeneral',
    );

    expect(regsiterNumber).toBe('11-22.333');
  });

  it('should extract no appeal number', () => {
    const text = 'Pas de pourvoi';

    const appealNumber = extractAppealRegisterRoleGeneralNumber(text);

    expect(appealNumber).toBe(undefined);
  });
});
