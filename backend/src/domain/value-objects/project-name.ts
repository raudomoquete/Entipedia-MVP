/**
 * Value Object representing a Project Name.
 * Encapsulates basic invariants like non-empty trimming.
 */
export class ProjectName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(raw: string): ProjectName {
    const trimmed = raw.trim();
    if (!trimmed) {
      throw new Error('Project name cannot be empty');
    }
    return new ProjectName(trimmed);
  }

  public getValue(): string {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}


