// @vitest-environment jsdom
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { act, cleanup, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { AppProvider, useApp } from '../../src/app/store.tsx';
import { CONTENT } from '../../src/content/index.ts';
import { QUESTIONNAIRE_VERSION } from '../../src/domain/archetypes.ts';
import type { Profile as ProfileRecord } from '../../src/domain/types.ts';
import { OFFER_V2_KEY, Profile } from '../../src/features/profile/Profile.tsx';
import { de } from '../../src/i18n/de.ts';
import { IndexedDbRepository } from '../../src/platform/storage/indexeddb.ts';
import { normalizeProfile } from '../../src/platform/storage/validate.ts';
import { ToastProvider } from '../../src/ui/feedback.tsx';

let n = 0;
function setup() {
  const repo = new IndexedDbRepository({ factory: new IDBFactory(), name: `q2-${++n}` });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AppProvider repo={repo}>
      <ToastProvider>{children}</ToastProvider>
    </AppProvider>
  );
  return { repo, wrapper };
}

/** A profile as 0.1–0.3 wrote it: four answers, no V04 fields. */
const V1_PROFILE: ProfileRecord = {
  answers: { 'q-calling': 'a-question', 'q-decision': 'a-image', 'q-place': 'a-road', 'q-invite': 'a-direction' },
  themeId: 'self',
  archetypeId: 'seeker',
  archetypeSource: 'questions',
  profileVersion: 1,
  updatedAt: '2026-11-20T10:00:00.000Z',
};

async function withProfile(profile: ProfileRecord) {
  const s = setup();
  await s.repo.open();
  await s.repo.putProfile(profile);
  await s.repo.putSettings({ locale: 'de', motion: 'system', onboardingDone: true });
  s.repo.close();
  return s;
}

afterEach(() => cleanup());

describe('questionnaire v2 in the store (V04.1)', () => {
  it('completing the questionnaire stores main, complement, scores and questionnaire version', async () => {
    const { repo, wrapper } = setup();
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.state.status).toBe('ready'));
    // visionary 1 + 2 + 2 = 5, creator 2 + 2 = 4 (one point behind, four answers): creator is the complement.
    const answers = { 'q-calling': 'a-create', 'q-decision': 'a-image', 'q-place': 'a-workshop', 'q-invite': 'a-intuition' };
    let saved: ProfileRecord | null = null;
    await act(async () => {
      saved = await result.current.actions.completeOnboarding(answers, 'self');
    });
    expect(saved!.archetypeId).toBe('visionary');
    expect(saved!.secondaryArchetypeId).toBe('creator');
    expect(saved!.questionnaireVersion).toBe(QUESTIONNAIRE_VERSION);
    expect(saved!.scores).toMatchObject({ visionary: 5, creator: 4 });
    expect(Object.keys(saved!.scores!)).toHaveLength(8);
    const snap = await repo.loadAll();
    expect(snap.profile).toEqual(saved);
  });

  it('a v1 profile loads unchanged: no field is added or rewritten', async () => {
    const { wrapper } = await withProfile(V1_PROFILE);
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.state.status).toBe('ready'));
    expect(result.current.state.profile).toEqual(V1_PROFILE);
  });

  it('a manual choice keeps the complement unless it becomes the main archetype or the profile is left open', async () => {
    const { wrapper } = await withProfile({ ...V1_PROFILE, secondaryArchetypeId: 'sage', questionnaireVersion: 2 });
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.state.status).toBe('ready'));
    await act(() => result.current.actions.setArchetype('creator'));
    expect(result.current.state.profile?.secondaryArchetypeId).toBe('sage');
    await act(() => result.current.actions.setArchetype('sage'));
    expect(result.current.state.profile?.secondaryArchetypeId).toBeNull();
    await act(() => result.current.actions.setArchetype(null));
    expect(result.current.state.profile?.secondaryArchetypeId).toBeNull();
  });

  it('a manual choice on a v1 profile adds no complement field', async () => {
    const { wrapper } = await withProfile(V1_PROFILE);
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.state.status).toBe('ready'));
    await act(() => result.current.actions.setArchetype('sage'));
    expect(result.current.state.profile && 'secondaryArchetypeId' in result.current.state.profile).toBe(false);
  });

  it('markSeen is stored, survives a restart and keeps the first time', async () => {
    const { repo, wrapper } = setup();
    const { result, unmount } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.state.status).toBe('ready'));
    await act(() => result.current.actions.markSeen('offer:test'));
    const first = result.current.state.seen.find((s) => s.key === 'offer:test');
    expect(first).toBeDefined();
    await act(() => result.current.actions.markSeen('offer:test'));
    expect(result.current.state.seen.filter((s) => s.key === 'offer:test')).toEqual([first]);
    unmount();
    repo.close();
    const again = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(again.result.current.state.status).toBe('ready'));
    expect(again.result.current.state.seen).toEqual([first]);
  });
});

describe('optional V04 profile fields are checked one by one', () => {
  it('drops a broken optional field and keeps the profile', () => {
    const broken = { ...V1_PROFILE, secondaryArchetypeId: 'dragon', scores: { seeker: 'x' }, questionnaireVersion: 0 };
    expect(normalizeProfile(broken)).toEqual(V1_PROFILE);
  });

  it('keeps valid optional fields', () => {
    const scores = Object.fromEntries(CONTENT.archetypes.map((a) => [a.id, 1])) as ProfileRecord['scores'];
    const ok = { ...V1_PROFILE, secondaryArchetypeId: null, scores, questionnaireVersion: 2 };
    expect(normalizeProfile(ok)).toEqual(ok);
  });

  it('a broken base is still rejected', () => {
    expect(normalizeProfile({ ...V1_PROFILE, archetypeId: 'dragon' })).toBeNull();
  });
});

describe('offer of the new questions to existing profiles (E9)', () => {
  it('shows the offer to a v1 profile; "Nicht jetzt" hides it for good, the profile stays', async () => {
    const { wrapper, repo } = await withProfile(V1_PROFILE);
    const view = render(<Profile />, { wrapper });
    expect(await screen.findByText(de.profile.offerTitle)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: de.profile.offerLater }));
    await waitFor(() => expect(screen.queryByText(de.profile.offerTitle)).toBeNull());
    view.unmount();
    const snap = await repo.loadAll();
    expect(snap.seen.map((s) => s.key)).toContain(OFFER_V2_KEY);
    expect(snap.profile).toEqual(V1_PROFILE);
  });

  it('"Neue Fragen beantworten" opens the first new question with the old answers filled in', async () => {
    const { wrapper } = await withProfile(V1_PROFILE);
    let pending: Record<string, string> = {};
    function Probe() {
      pending = { ...useApp().state.pendingAnswers };
      return null;
    }
    render(
      <>
        <Profile />
        <Probe />
      </>,
      { wrapper },
    );
    fireEvent.click(await screen.findByRole('button', { name: de.profile.offerStart }));
    await waitFor(() => expect(window.location.hash).toBe('#/onboarding/5'));
    expect(pending).toEqual(V1_PROFILE.answers);
  });

  it('is not shown after the v2 questionnaire or without earlier answers', async () => {
    for (const profile of [
      { ...V1_PROFILE, questionnaireVersion: 2 },
      { ...V1_PROFILE, answers: {} },
    ]) {
      const { wrapper } = await withProfile(profile);
      const view = render(<Profile />, { wrapper });
      await screen.findByText(de.profile.title);
      expect(screen.queryByText(de.profile.offerTitle)).toBeNull();
      view.unmount();
    }
  });
});
