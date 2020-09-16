import { buildMongoId } from "../../../utils";
import { generatorType } from "../../type";
import { courtDecisionType } from "../courtDecisionType";

export { courtDecisionGenerator };

const courtDecisionGenerator: generatorType<courtDecisionType> = {
  generate: ({
    date,
    footer,
    header,
    _id,
    metadata,
    oracleId,
    source,
    text,
  } = {}) => ({
    date: date ? date : new Date(),
    footer: footer ? footer : `FOOTER_${Math.random()}`,
    header: header ? header : `HEADER_${Math.random()}`,
    _id: _id ? buildMongoId(_id) : buildMongoId(),
    metadata: metadata ? metadata : `METADATA_${Math.random()}`,
    oracleId: oracleId ? oracleId : `ORACLE_ID_${Math.random()}`,
    source: source ? source : `SOURCE_${Math.random()}`,
    text: text ? text : `TEXT_${Math.random()}`,
  }),
};
