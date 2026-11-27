// @vitest-environment jsdom
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { AppProvider, factsOf, useApp } from '../../src/app/store.tsx';
import { CONTENT } from '../../src/content/index.ts';
import { journalItems } from '../../src/domain/journal.ts';
import { journeyDays } from '../../src/domain/progress.ts';
import { seededRng } from '../../src/domain/random.ts';
import { IndexedDbRepository } from '../../src/platform/storage/indexeddb.ts';

const STAR = CONTENT.cards.find((c) => c.order === 17)!.id;

let lastFactory: IDBFactory | null = null;

async function setup() {
  lastFactory = new IDBFactory();
  const repo = new IndexedDbRepository({ factory: lastFactory, name: 'journal' });
  await repo.open();
  await repo.putProfile({ answers: {}, themeId: 'self', archetypeId: 'seeker', profileVersion: 1, updatedAt: '2026-11-26T10:00:00.000Z' });
  await repo.putSettings({ locale: 'de', motion: 'system', onboardingDone: true });
  repo.close();
  let now = new Date(2026, 10, 27, 9, 0, 0);
  const clock = { now: () => now };
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AppProvider repo={repo} clock={clock} rng={seededRng(5)}>
      {children}
    </AppProvider>
  );
  const mount = async () => {
    const hook = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(hook.result.current.state.status).toBe('ready'));
    return hook;
  };
  return { mount, setNow: (d: Date) => (now = d) };
}

describe('journal in the store (V05.4)', () => {
  it('writes, edits and deletes own words; the day and the deleted entry survive a restart', async () => {
    const { mount, setNow } = await setup();
    const { result, unmount } = await mount();
    const actions = () => result.current.actions;

    await act(async () => void (await actions().revealToday()));
    const today = result.current.state.dailies[0]!;
    await act(() => actions().updateDailyNote(today.dateKey, 'Eine Notiz'));
    expect(result.current.state.dailies[0]!.notedAt).toBeDefined();

    setNow(new Date(2026, 10, 28, 21, 0, 0)); // a day with nothing but an entry
    let entryId = '';
    await act(async () => void (entryId = (await actions().writeJournalEntry('free', '  Mein Abend  ')).id));
    await act(() => actions().editJournalEntry(entryId, 'Mein ruhiger Abend'));
    await act(() => actions().studyCard(STAR, 1, 'Was mich trägt'));
    expect(result.current.state.events).toHaveLength(1);

    let items = journalItems(factsOf(result.current.state));
    expect(items.filter((i) => i.text).map((i) => i.text)).toEqual(['Was mich trägt', 'Mein ruhiger Abend', 'Eine Notiz']);
    expect(journeyDays(factsOf(result.current.state))).toBe(2);

    await act(() => actions().deleteJournalItem({ source: 'entry', id: entryId }));
    await act(() => actions().deleteJournalItem({ source: 'daily', id: today.dateKey }));
    items = journalItems(factsOf(result.current.state));
    expect(items.filter((i) => i.text).map((i) => i.text)).toEqual(['Was mich trägt']);
    expect(items.some((i) => i.key === `daily:${today.dateKey}`)).toBe(true); // the card of the day stays
    unmount();

    const again = await mount();
    const s = again.result.current.state;
    expect(s.journal.find((j) => j.id === entryId)).toMatchObject({ text: '' });
    expect(s.journal.find((j) => j.id === entryId)?.deletedAt).toBeDefined();
    expect(s.dailies[0]).toMatchObject({ note: '' });
    expect(s.dailies[0]!.notedAt).toBeDefined();
    expect(journeyDays(factsOf(s))).toBe(2);
    expect(journalItems(factsOf(s)).filter((i) => i.text)).toHaveLength(1);

    await act(() => again.result.current.actions.clearAllData());
    expect(again.result.current.state.journal).toEqual([]);
    expect(again.result.current.state.events).toEqual([]);
  });

  it('a note from before 0.5 keeps counting when it is deleted in 0.5', async () => {
    const { mount } = await setup();
    const first = await mount();
    await act(async () => void (await first.result.current.actions.revealToday()));
    const dateKey = first.result.current.state.dailies[0]!.dateKey;
    first.unmount();
    // Written like 0.4 did: the note without a time.
    const repo = new IndexedDbRepository({ factory: lastFactory!, name: 'journal' });
    await repo.open();
    expect((await repo.updateDailyNote(dateKey, 'Alte Notiz')).notedAt).toBeUndefined();
    repo.close();
    const { result } = await mount();
    await act(() => result.current.actions.deleteJournalItem({ source: 'daily', id: dateKey }));
    expect(result.current.state.dailies[0]).toMatchObject({ note: '' });
    expect(result.current.state.dailies[0]!.notedAt).toBeDefined();
  });

  it('an entry without text is refused and nothing is stored', async () => {
    const { mount } = await setup();
    const { result } = await mount();
    await expect(result.current.actions.writeJournalEntry('free', '   ')).rejects.toThrow();
    expect(result.current.state.journal).toEqual([]);
  });
});
