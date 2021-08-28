import fs from "fs";
import { isFilepath, pathIsFile } from "../../utils/file-utils";
import { nameof } from "../../utils/nameof";
import { PrepareReleaseCommandOptions } from "../commands/prepare-release";
import { GlobalArgv } from "../options";
import { MiddlewareHandler } from "./middleware-handler";

type TemplateOptions = Pick<GlobalArgv, "format"> &
  Pick<
    PrepareReleaseCommandOptions,
    "changelogTemplate" | "releaseBranchPattern"
  > &
  Record<string, unknown>;
const templateOptionKeys = new Set([
  nameof<TemplateOptions>("format"),
  nameof<TemplateOptions>("changelogTemplate"),
  nameof<TemplateOptions>("releaseBranchPattern"),
]);

export const TemplatesFromFilesMiddleware: MiddlewareHandler = {
  handler: (argv: Record<string, unknown>): Record<string, unknown> => {
    for (const key of Object.keys(argv)) {
      // ensure we're only manipulating options which are for handlebars templates
      if (!templateOptionKeys.has(key)) {
        continue;
      }

      const option = argv[key];
      if (
        !option ||
        typeof option !== "string" ||
        !isFilepath(option) ||
        !pathIsFile(option)
      ) {
        continue;
      }

      const fileContents = fs.readFileSync(option).toString();
      argv[key] = fileContents;
    }

    return argv;
  },
  preValidation: true,
};
