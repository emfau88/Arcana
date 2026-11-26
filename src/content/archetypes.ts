import type { ArchetypeContent } from './schema.ts';

/**
 * Eight symbolic archetypes. Working names, not clinical personality categories.
 * German names use gender-inclusive participle forms without article (see DECISIONS D-08).
 * Shadows are open questions, never verdicts.
 */
export const ARCHETYPES: readonly ArchetypeContent[] = [
  {
    id: 'seeker',
    name: { de: 'Suchende', en: 'The Seeker' },
    essence: {
      de: 'Du folgst Fragen, bevor du Antworten festhältst. Neugier ist dein Kompass.',
      en: 'You follow questions before you hold on to answers. Curiosity is your compass.',
    },
    strength: {
      de: 'Offenheit für das Unbekannte und der Mut, weiter nachzufragen.',
      en: 'Openness to the unknown and the courage to keep asking.',
    },
    shadow: {
      de: 'Wann wird das Suchen zu einem Weg, dem Ankommen auszuweichen?',
      en: 'When does searching become a way of avoiding arrival?',
    },
    growth: {
      de: 'Vertrauen, dass eine vorläufige Antwort genügen darf.',
      en: 'Trusting that a provisional answer can be enough.',
    },
    reflection: {
      de: 'Welche Frage begleitet mich gerade wirklich?',
      en: 'Which question is truly walking with me right now?',
    },
    lens: {
      de: 'Deine suchende Seite darf heute einer Frage folgen, ohne sie sofort beantworten zu müssen.',
      en: 'Your seeking side may follow a question today without needing to answer it at once.',
    },
  },
  {
    id: 'guardian',
    name: { de: 'Hütende', en: 'The Guardian' },
    essence: {
      de: 'Du schaffst Räume, in denen andere aufatmen können. Verlässlichkeit ist deine leise Magie.',
      en: 'You create spaces where others can breathe. Steadiness is your quiet magic.',
    },
    strength: {
      de: 'Fürsorge, Beständigkeit und ein feines Gespür für Grenzen.',
      en: 'Care, constancy and a fine sense for boundaries.',
    },
    shadow: {
      de: 'Wen schützt du, wenn du dich selbst zuletzt einplanst?',
      en: 'Whom are you protecting when you put yourself last?',
    },
    growth: {
      de: 'Die eigenen Grenzen so ernst nehmen wie die der anderen.',
      en: 'Taking your own boundaries as seriously as other people’s.',
    },
    reflection: {
      de: 'Was gibt mir selbst gerade Halt?',
      en: 'What is giving me steadiness right now?',
    },
    lens: {
      de: 'Deine hütende Seite darf heute auch für dich selbst einen geschützten Moment schaffen.',
      en: 'Your guarding side may create a sheltered moment for yourself today, too.',
    },
  },
  {
    id: 'visionary',
    name: { de: 'Sehende', en: 'The Visionary' },
    essence: {
      de: 'Du erkennst Muster, bevor sie Gestalt annehmen. Bilder und Ahnungen sprechen zu dir.',
      en: 'You sense patterns before they take shape. Images and hunches speak to you.',
    },
    strength: {
      de: 'Weitblick, Intuition und ein Auge für Möglichkeiten.',
      en: 'Foresight, intuition and an eye for possibility.',
    },
    shadow: {
      de: 'Wann verlierst du das Hier und Jetzt aus dem Blick, weil das Morgen lauter ist?',
      en: 'When do you lose sight of the here and now because tomorrow is louder?',
    },
    growth: {
      de: 'Visionen in einen ersten kleinen, greifbaren Schritt übersetzen.',
      en: 'Translating visions into a first small, tangible step.',
    },
    reflection: {
      de: 'Welches innere Bild möchte ich heute ernst nehmen?',
      en: 'Which inner image do I want to take seriously today?',
    },
    lens: {
      de: 'Deine sehende Seite darf heute einem ersten Bild trauen – und es dann in Ruhe prüfen.',
      en: 'Your seeing side may trust a first image today – and then examine it calmly.',
    },
  },
  {
    id: 'alchemist',
    name: { de: 'Verwandelnde', en: 'The Alchemist' },
    essence: {
      de: 'Du machst aus Schwerem etwas Wertvolles. Wandlung ist für dich ein Handwerk.',
      en: 'You turn what is heavy into something of value. Transformation is your craft.',
    },
    strength: {
      de: 'Ausdauer, Tiefe und die Gabe, Erfahrungen zu verwandeln.',
      en: 'Endurance, depth and a gift for transforming experience.',
    },
    shadow: {
      de: 'Darf etwas auch einfach so bleiben, wie es ist?',
      en: 'Is something allowed to simply stay as it is?',
    },
    growth: {
      de: 'Zwischen Verwandeln und Annehmen unterscheiden lernen.',
      en: 'Learning to tell transforming from accepting.',
    },
    reflection: {
      de: 'Was in meinem Leben ist bereit, sich zu wandeln?',
      en: 'What in my life is ready to change form?',
    },
    lens: {
      de: 'Deine verwandelnde Seite darf heute schauen, welcher Rohstoff in einer schwierigen Erfahrung steckt.',
      en: 'Your transforming side may look for the raw material hidden in a difficult experience today.',
    },
  },
  {
    id: 'wanderer',
    name: { de: 'Wandernde', en: 'The Wanderer' },
    essence: {
      de: 'Du lernst, indem du gehst. Weite und Bewegung machen deinen Kopf klar.',
      en: 'You learn by moving. Open horizons clear your mind.',
    },
    strength: {
      de: 'Freiheit, Anpassungsfähigkeit und Vertrauen in den Weg.',
      en: 'Freedom, adaptability and trust in the journey.',
    },
    shadow: {
      de: 'Wovor gehst du vielleicht auch ein Stück davon?',
      en: 'What might you also be walking away from?',
    },
    growth: {
      de: 'Wurzeln schlagen, ohne die Weite zu verlieren.',
      en: 'Putting down roots without losing the horizon.',
    },
    reflection: {
      de: 'Wohin möchte mein nächster Schritt eigentlich führen?',
      en: 'Where does my next step actually want to lead?',
    },
    lens: {
      de: 'Deine wandernde Seite darf heute einen kleinen Umweg nehmen und schauen, was er zeigt.',
      en: 'Your wandering side may take a small detour today and see what it reveals.',
    },
  },
  {
    id: 'creator',
    name: { de: 'Schaffende', en: 'The Creator' },
    essence: {
      de: 'Du bringst Neues in die Welt. Ideen werden in deinen Händen zu Formen.',
      en: 'You bring new things into the world. Ideas become forms in your hands.',
    },
    strength: {
      de: 'Schöpferkraft, Ausdruck und Freude am Gestalten.',
      en: 'Creative force, expression and joy in making.',
    },
    shadow: {
      de: 'Wann misst du deinen Wert nur an dem, was du hervorbringst?',
      en: 'When do you measure your worth only by what you produce?',
    },
    growth: {
      de: 'Unfertiges zeigen und dem Prozess vertrauen.',
      en: 'Showing what is unfinished and trusting the process.',
    },
    reflection: {
      de: 'Was möchte heute durch mich entstehen?',
      en: 'What wants to come into being through me today?',
    },
    lens: {
      de: 'Deine schaffende Seite darf heute etwas beginnen, das noch nicht perfekt sein muss.',
      en: 'Your creating side may begin something today that doesn’t need to be perfect yet.',
    },
  },
  {
    id: 'sage',
    name: { de: 'Weise', en: 'The Sage' },
    essence: {
      de: 'Du suchst das Verstehen hinter den Dingen. Ruhe und Wissen sind deine Lampe.',
      en: 'You seek the understanding behind things. Calm and knowledge are your lamp.',
    },
    strength: {
      de: 'Klarheit, Urteilskraft und die Geduld, genau hinzusehen.',
      en: 'Clarity, discernment and the patience to look closely.',
    },
    shadow: {
      de: 'Wann hältst du Abstand, wo Nähe dir mehr zeigen würde?',
      en: 'When do you keep your distance where closeness would teach you more?',
    },
    growth: {
      de: 'Wissen mit Gefühl verbinden.',
      en: 'Joining knowledge with feeling.',
    },
    reflection: {
      de: 'Was weiß ich schon – und was glaube ich nur zu wissen?',
      en: 'What do I already know – and what do I only believe I know?',
    },
    lens: {
      de: 'Deine weise Seite darf heute zwischen Wissen und Vermutung unterscheiden – freundlich und genau.',
      en: 'Your wise side may distinguish knowing from assuming today – kindly and precisely.',
    },
  },
  {
    id: 'renewer',
    name: { de: 'Erneuernde', en: 'The Renewer' },
    essence: {
      de: 'Du weißt, dass Enden auch Anfänge sind. Loslassen schafft in dir Raum.',
      en: 'You know that endings are also beginnings. Letting go makes room in you.',
    },
    strength: {
      de: 'Mut zum Neubeginn und eine große Kraft zur Erneuerung.',
      en: 'Courage to begin again and a deep power of renewal.',
    },
    shadow: {
      de: 'Was gibst du vielleicht zu früh auf, bevor es reifen konnte?',
      en: 'What might you give up too early, before it could ripen?',
    },
    growth: {
      de: 'Abschiede würdigen, statt nur nach vorn zu eilen.',
      en: 'Honouring goodbyes instead of only rushing ahead.',
    },
    reflection: {
      de: 'Was darf ich heute mit Dank verabschieden?',
      en: 'What can I let go of with gratitude today?',
    },
    lens: {
      de: 'Deine erneuernde Seite darf heute bemerken, was zu Ende gehen will – und was neu keimt.',
      en: 'Your renewing side may notice today what wants to end – and what is newly sprouting.',
    },
  },
];
