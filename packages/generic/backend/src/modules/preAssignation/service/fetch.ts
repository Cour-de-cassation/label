import { preAssignationType } from '@label/core';
import { buildPreAssignationRepository } from '..';

export { fetchAllPreAssignation, fetchPreAssignationBySourceAndDocumentNumber };

async function fetchAllPreAssignation(): Promise<preAssignationType[]> {
  const preAssignationRepository = buildPreAssignationRepository();
  return preAssignationRepository.findAll();
}

async function fetchPreAssignationBySourceAndDocumentNumber(
  documentNumber: number,
  source: string,
): Promise<preAssignationType | undefined> {
  const preAssignationRepository = buildPreAssignationRepository();
  return preAssignationRepository.findOneByDocumentNumberAndSource({
    documentNumber,
    source,
  });
}
