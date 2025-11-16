import { UpdateClientDto } from '../dto/client-dtos';

export class UpdateClientCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateClientDto
  ) {}
}


