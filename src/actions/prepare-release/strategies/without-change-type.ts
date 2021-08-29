import { compileTemplate } from "../../../utils/template-utils";
import { PrepareReleaseStrategy } from "./prepare-release-strategy";

export class WithoutChangeTypeStrategy extends PrepareReleaseStrategy {
  private lines: string[] = [];

  public override processLine(line: string): void {
    this.lines.push(line);
  }

  public override generate(template: string, releaseNumber: string): string {
    const handlebarsTemplate = compileTemplate(template);
    return handlebarsTemplate({
      releaseNumber,
      entries: this.lines,
    });
  }
}
