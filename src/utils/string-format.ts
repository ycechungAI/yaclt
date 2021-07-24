import { compile } from "../utils/template-utils";

export const StringFormatParams = {
  changeType: "changeType",
  changeTypes: "changeTypes",
  message: "message",
  issueId: "issueId",
};

export const formatToChangeTypeRegex = (format: string) => {
  const changeTypeTemplatePattern = /\{\{\s*changeType\s*\}\}/;
  const hasChangeType = changeTypeTemplatePattern.test(format);
  const indexOfChangeType = format.search(changeTypeTemplatePattern);
  const changeTypeHandlebars = hasChangeType
    ? format.substring(
        Math.max(0, indexOfChangeType - 2),
        Math.min(
          format.length,
          indexOfChangeType +
            StringFormatParams.changeType.length +
            Math.max(
              format
                .slice(indexOfChangeType + StringFormatParams.changeType.length)
                .indexOf("}}") + 3,
              0
            )
        )
      )
    : "UNCATEGORIZED";
  const changeTypeCompiledTemplate = compile(changeTypeHandlebars);
  return changeTypeCompiledTemplate;
};
