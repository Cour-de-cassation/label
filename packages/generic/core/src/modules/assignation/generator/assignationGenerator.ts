import { generatorType } from "../../../types";
import { idModule } from "../../id";
import { assignationType } from "../assignationType";

export { assignationGenerator };

const assignationGenerator: generatorType<assignationType> = {
  generate: ({ documentId, _id, userId } = {}) => ({
    documentId: documentId
      ? idModule.lib.buildId(documentId)
      : idModule.lib.buildId(),
    _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
    userId: userId ? idModule.lib.buildId(userId) : idModule.lib.buildId(),
  }),
};
