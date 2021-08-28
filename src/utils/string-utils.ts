import { compileTemplate } from "../utils/template-utils";

export const StringFormatParams = {
  changeType: "changeType",
  changeTypes: "changeTypes",
  message: "message",
  issueId: "issueId",
};

export const formatToChangeTypeTemplate = (
  format: string
): HandlebarsTemplateDelegate<Record<string, unknown>> => {
  const changeTypeTemplatePattern = /{{\s*changeType\s*}}/;
  const hasChangeType = changeTypeTemplatePattern.test(format);
  const indexOfChangeType = format.search(changeTypeTemplatePattern);
  const changeTypeHandlebars = hasChangeType
    ? format.slice(
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
  const changeTypeCompiledTemplate = compileTemplate(changeTypeHandlebars);
  return changeTypeCompiledTemplate;
};

export const camelToKebabCase = (str: string): string =>
  str
    .split("")
    .map((letter, idx) =>
      letter.toUpperCase() === letter
        ? `${idx !== 0 ? "-" : ""}${letter.toLowerCase()}`
        : letter
    )
    .join("");
