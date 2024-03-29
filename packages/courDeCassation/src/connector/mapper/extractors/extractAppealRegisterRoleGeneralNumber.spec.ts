import { extractAppealRegisterRoleGeneralNumber } from './extractAppealRegisterRoleGeneralNumber';

describe('extractAppealRegisterRoleGeneralNumber', () => {
  const text = 'Pourvoi n° K 08-16.486 de telle décision';
  it('should extract appeal number from text', () => {
    const appealNumber = extractAppealRegisterRoleGeneralNumber(text, '');
    expect(appealNumber).toBe('08-16.486');
  });

  it('should extract registerNumber if source jurica', () => {
    const regsiterNumber = extractAppealRegisterRoleGeneralNumber(
      text,
      'jurica',
      "Cour d'appel de...",
      'appeal',
      '22/3455',
      'numeroRoleGenaral',
    );

    expect(regsiterNumber).toBe('22/3455');
  });

  it('should extract numeroRoleGeneral if source juritj', () => {
    const regsiterNumber = extractAppealRegisterRoleGeneralNumber(
      text,
      'juritj',
      'Tribunal de justice de...',
      '',
      '',
      '23/456',
    );

    expect(regsiterNumber).toBe('23/456');
  });

  it('should extract appeal and cour de cassation (return formatedAppeal) if source jurinet', () => {
    const regsiterNumber = extractAppealRegisterRoleGeneralNumber(
      text,
      'jurinet',
      'Cour de cassation de...',
      's1122333',
      '',
      'numeroRoleGeneral',
    );

    expect(regsiterNumber).toBe('11-22.333');
  });

  it('should extract appeal but with other cour (it is register number format : 19/000101 in this case) if source jurinet', () => {
    const regsiterNumber = extractAppealRegisterRoleGeneralNumber(
      text,
      'jurinet',
      "Cour d'appel de Rennes",
      '19/000101',
      'registerNumber',
      'numeroRoleGeneral',
    );

    expect(regsiterNumber).toBe('19/000101');
  });

  it('should extract no appeal number', () => {
    const text = 'Pas de pourvoi';

    const appealNumber = extractAppealRegisterRoleGeneralNumber(text, '');

    expect(appealNumber).toBe(undefined);
  });
});
