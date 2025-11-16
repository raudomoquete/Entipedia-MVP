export class GetAllClientsQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 10
  ) {}
}


