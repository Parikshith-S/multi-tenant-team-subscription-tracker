export type BillingCycle = 'monthly' | 'annual';
export type ServiceStatus = 'active' | 'canceled' | 'paused';

export interface Service {
    id: string;
    org_id: string;
    name: string;
    category: string;
    cost: number;
    billing_cycle: BillingCycle;
    renewal_date: string; // ISO date string YYYY-MM-DD
    status: ServiceStatus;
    created_at: string;
    updated_at: string;
}
