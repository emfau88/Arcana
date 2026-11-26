/**
 * Replaceable entitlement contract for a possible later, owner-approved purchase.
 * P0 is completely free: every core right is granted locally, there is no shop UI,
 * no billing SDK and no purchase flow. A client-side flag is NOT a secure purchase
 * check; a future paid feature needs real Play Billing verification (see DECISIONS D-12).
 */
export type Entitlement = 'core.daily' | 'core.reading' | 'core.grimoire' | 'core.profile';

export const CORE_ENTITLEMENTS: readonly Entitlement[] = ['core.daily', 'core.reading', 'core.grimoire', 'core.profile'];

export interface EntitlementProvider {
  has(entitlement: Entitlement): boolean;
  list(): readonly Entitlement[];
}

export const freeCoreEntitlements: EntitlementProvider = {
  has: (e) => CORE_ENTITLEMENTS.includes(e),
  list: () => CORE_ENTITLEMENTS,
};
