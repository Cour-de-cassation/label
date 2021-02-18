import { generatorType } from '@label/core';
import { sderCourtDecisionType } from '../../sderApi';

export { sderCourtDecisionGenerator };

const sderCourtDecisionGenerator: generatorType<sderCourtDecisionType> = {
  generate: ({
    chamberId,
    chamberName,
    dateDecision,
    dateCreation,
    jurisdictionId,
    jurisdictionCode,
    jurisdictionName,
    originalText,
    registerNumber,
    sourceId,
    sourceName,
  } = {}) => ({
    chamberId: chamberId ? chamberId : `CHAMBER_ID_${Math.random()}`,
    chamberName: chamberName ? chamberName : `CHAMBER_NAME_${Math.random()}`,
    dateDecision: dateDecision ? dateDecision : new Date().toString(),
    dateCreation: dateCreation ? dateCreation : new Date().toString(),
    jurisdictionId: jurisdictionId
      ? jurisdictionId
      : `JURISDICTION_ID_${Math.random()}`,
    jurisdictionCode: jurisdictionCode
      ? jurisdictionCode
      : `JURISDICTION_CODE_${Math.random()}`,
    jurisdictionName: jurisdictionName
      ? jurisdictionName
      : `JURISDICTION_NAME_${Math.random()}`,
    originalText: originalText ? originalText : `TEXT_${Math.random()}`,
    registerNumber: registerNumber
      ? registerNumber
      : `REGISTER_NUMBER_${Math.random()}`,
    sourceId: sourceId ? sourceId : 0,
    sourceName: sourceName ? sourceName : `SOURCE_NAME_${Math.random()}`,
  }),
};
