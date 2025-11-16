import { ClientId } from '../value-objects/client-id';
import { ClientType } from '../value-objects/client-type';
import { MoneyDOP } from '../value-objects/money-dop';

export interface ClientProps {
  id: ClientId;
  name: string;
  type: ClientType;
  email?: string;
  phone?: string;
  // Valor aproximado del cliente en DOP (por ejemplo, facturación estimada)
  lifetimeValue?: MoneyDOP;
  createdAt: Date;
}

/**
 * Entidad de dominio que representa un Cliente.
 * Aquí es donde debería vivir la lógica de negocio relacionada con clientes.
 */
export class Client {
  private props: ClientProps;

  private constructor(props: ClientProps) {
    this.props = props;
  }

  static create(props: ClientProps): Client {
    return new Client(props);
  }

  get id(): ClientId {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get type(): ClientType {
    return this.props.type;
  }

  get email(): string | undefined {
    return this.props.email;
  }

  get phone(): string | undefined {
    return this.props.phone;
  }

  get lifetimeValue(): MoneyDOP | undefined {
    return this.props.lifetimeValue;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  updateContactInfo(params: { email?: string; phone?: string }): void {
    if (params.email !== undefined) {
      this.props.email = params.email.trim();
    }
    if (params.phone !== undefined) {
      this.props.phone = params.phone.trim();
    }
  }

  updateLifetimeValue(amount: MoneyDOP): void {
    this.props.lifetimeValue = amount;
  }
}


