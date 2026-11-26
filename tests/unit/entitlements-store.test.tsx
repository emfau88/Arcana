// @vitest-environment jsdom
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { AppProvider, useApp } from '../../src/app/store.tsx';
import { TestProvider } from '../../src/domain/entitlements.ts';
import { IndexedDbRepository } from '../../src/platform/storage/indexeddb.ts';

function wrapper(entitlements?: Parameters<typeof AppProvider>[0]['entitlements']) {
  const repo = new IndexedDbRepository({ factory: new IDBFactory(), name: 'rights' });
  return ({ children }: { children: ReactNode }) => (
    <AppProvider repo={repo} entitlements={entitlements}>
      {children}
    </AppProvider>
  );
}

describe('the store answers has(right) from its provider (V03.4)', () => {
  it('default: free core yes, edition no', async () => {
    const { result } = renderHook(() => useApp(), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.state.status).toBe('ready'));
    expect(result.current.has('core.daily')).toBe(true);
    expect(result.current.has('edition.spreads')).toBe(false);
  });

  it('with a TestProvider the edition rights are granted', async () => {
    const { result } = renderHook(() => useApp(), { wrapper: wrapper(TestProvider(['edition.spreads'])) });
    await waitFor(() => expect(result.current.state.status).toBe('ready'));
    expect(result.current.has('edition.spreads')).toBe(true);
    expect(result.current.has('edition.numbers')).toBe(false);
  });
});
