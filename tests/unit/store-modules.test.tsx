// @vitest-environment jsdom
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { AppProvider, useApp } from '../../src/app/store.tsx';
import { IndexedDbRepository } from '../../src/platform/storage/indexeddb.ts';

function setup() {
  const repo = new IndexedDbRepository({ factory: new IDBFactory(), name: 'modules' });
  const wrapper = ({ children }: { children: ReactNode }) => <AppProvider repo={repo}>{children}</AppProvider>;
  return { repo, wrapper };
}

describe('startup content modules (V03.3, B-08)', () => {
  it('a first start waits for the questionnaire texts', async () => {
    const { wrapper } = setup();
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.state.status).toBe('ready'));
    expect(result.current.state.modules.identity).toBeDefined();
    expect(result.current.tx('identity', 'question.q-calling.prompt')).not.toBe('');
  });

  it('a returning person gets "Heute" at once; the texts follow in the background', async () => {
    const { repo, wrapper } = setup();
    await repo.open();
    await repo.putProfile({ answers: {}, themeId: 'self', archetypeId: 'seeker', profileVersion: 1, updatedAt: '2026-11-26T10:00:00.000Z' });
    repo.close();
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.state.status).toBe('ready'));
    expect(result.current.state.profile?.archetypeId).toBe('seeker');
    await waitFor(() => expect(result.current.state.modules.identity).toBeDefined());
  });

  it('ensureModules loads missing texts on demand', async () => {
    const { wrapper } = setup();
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.state.status).toBe('ready'));
    await result.current.actions.ensureModules();
    expect(result.current.state.modules.identity).toBeDefined();
  });
});
