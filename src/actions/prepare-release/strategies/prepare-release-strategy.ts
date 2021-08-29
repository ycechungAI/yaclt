export abstract class PrepareReleaseStrategy {
  abstract processLine(line: string): void;
  abstract generate(template: string, releaseNumber: string): string;
}
