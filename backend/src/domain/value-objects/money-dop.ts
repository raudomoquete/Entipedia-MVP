/**
 * Value Object para representar montos en pesos dominicanos (DOP).
 * Almacena el valor como número (monto) y fija la moneda a 'DOP'.
 */
export class MoneyDOP {
  private readonly amount: number;
  private readonly currency: 'DOP' = 'DOP';

  private constructor(amount: number) {
    this.amount = amount;
  }

  public static create(rawAmount: number): MoneyDOP {
    if (!Number.isFinite(rawAmount)) {
      throw new Error('Amount must be a finite number');
    }

    const rounded = Math.round(rawAmount * 100) / 100;
    if (rounded < 0) {
      throw new Error('Amount cannot be negative');
    }

    return new MoneyDOP(rounded);
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): 'DOP' {
    return this.currency;
  }

  public toString(): string {
    return `${this.amount.toFixed(2)} ${this.currency}`;
  }
}


