/**
 * Local image paths shared by the UI and the share renderer (no network, no CDN).
 * Archetype portraits (B2, A07–A14): 240 × 360 thumbnail, 720 × 1080 for screens, and the
 * 1024 × 1536 master used only for share images (loaded lazily, never upscaled: S-08).
 */
import type { ArchetypeId } from '../domain/types.ts';

const base = import.meta.env.BASE_URL;

export type PortraitSize = 240 | 720 | 1024;

export const portraitSrc = (id: ArchetypeId, size: PortraitSize = 720) => `${base}archetypes/archetype-${id}${size === 720 ? '' : `-${size}`}.webp`;
