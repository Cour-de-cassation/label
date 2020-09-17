import { moduleType } from "../../types";
import { nlpReportGenerator } from "./generator";
import { nlpReportType } from "./nlpReportType";

export { nlpReportModule, nlpReportType };

const nlpReportModule: moduleType<nlpReportType> = {
  generator: nlpReportGenerator,
  lib: undefined,
};
