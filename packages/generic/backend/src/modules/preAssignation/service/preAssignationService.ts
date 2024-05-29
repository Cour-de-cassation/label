import {
  fetchAllPreAssignation,
  fetchPreAssignationBySourceAndNumber,
} from './fetch';
import { createPreAssignation } from './createPreAssignation';
import { deletePreAssignation } from './deletePreAssignation';

export { preAssignationService };

const preAssignationService = {
  createPreAssignation,
  deletePreAssignation,
  fetchAllPreAssignation,
  fetchPreAssignationBySourceAndNumber,
};
