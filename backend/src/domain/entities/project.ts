import { ProjectId } from '../value-objects/project-id';
import { ProjectName } from '../value-objects/project-name';
import { ProjectStatus } from '../value-objects/project-status';
import { ProjectPriority } from '../value-objects/project-priority';

export interface ProjectProps {
  id: ProjectId;
  name: ProjectName;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  createdAt: Date;
}

/**
 * Domain entity representing a Project.
 * Business logic related to Projects should live here.
 */
export class Project {
  private props: ProjectProps;

  private constructor(props: ProjectProps) {
    this.props = props;
  }

  static create(props: ProjectProps): Project {
    return new Project(props);
  }

  get id(): ProjectId {
    return this.props.id;
  }

  get name(): ProjectName {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get status(): ProjectStatus {
    return this.props.status;
  }

  get priority(): ProjectPriority {
    return this.props.priority;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Change the status of the project.
   * Here we could enforce business rules (e.g. cannot move from DONE to IN_PROGRESS).
   */
  changeStatus(newStatus: ProjectStatus): void {
    this.props.status = newStatus;
  }

  /**
   * Change the priority of the project.
   */
  changePriority(newPriority: ProjectPriority): void {
    this.props.priority = newPriority;
  }

  /**
   * Update description.
   */
  updateDescription(description: string): void {
    this.props.description = description.trim();
  }
}


