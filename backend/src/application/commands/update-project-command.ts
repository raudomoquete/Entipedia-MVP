import { UpdateProjectDto } from '../dto/project-dtos';

export class UpdateProjectCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateProjectDto
  ) {}
}


