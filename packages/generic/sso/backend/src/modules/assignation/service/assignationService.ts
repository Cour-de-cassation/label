import { assertDocumentIsAssignatedToUser } from './assertDocumentIsAssignatedToUser';
import { createAssignation } from './createAssignation';
import { deleteAssignationsByDocumentId } from './deleteAssignationsByDocumentId';
import { deleteAssignation } from './deleteAssignation';
import {
  fetchAllAssignationsById,
  fetchAssignation,
  fetchAssignationId,
  fetchAssignationsByDocumentIds,
  fetchAssignationsOfDocumentId,
  fetchDocumentIdsAssignatedToUserId,
} from './fetch';
import { findOrCreateByDocumentIdAndUserId } from './findOrCreateByDocumentIdAndUserId';
import { updateAssignationDocumentStatus } from './updateAssignationDocumentStatus';

export { assignationService };

const assignationService = {
  assertDocumentIsAssignatedToUser,
  createAssignation,
  deleteAssignation,
  deleteAssignationsByDocumentId,
  fetchAllAssignationsById,
  fetchAssignation,
  fetchAssignationId,
  fetchAssignationsByDocumentIds,
  fetchAssignationsOfDocumentId,
  fetchDocumentIdsAssignatedToUserId,
  findOrCreateByDocumentIdAndUserId,
  updateAssignationDocumentStatus,
};
