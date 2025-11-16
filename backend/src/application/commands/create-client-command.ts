import { CreateClientDto } from '../dto/client-dtos';

export class CreateClientCommand {
  constructor(public readonly data: CreateClientDto) {}
}


