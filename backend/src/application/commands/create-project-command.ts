import { CreateProjectDto } from '../dto/project-dtos';

export class CreateProjectCommand {
  constructor(public readonly data: CreateProjectDto) {}
}


