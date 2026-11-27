/**
 * Content module `archetypes`, English (V04.2). An adaptation of the German texts: same meaning,
 * natural English. Keys: see archetype-keys.ts.
 */
import { archetypeTable } from './archetype-keys.ts';
import type { TextTable } from './registry.ts';

export const texts: TextTable = archetypeTable(
  {
    seeker: {
      description:
        'As the Seeker, you meet the world with questions. You are drawn to what is not yet explained: a thought that does not quite add up, a place you have never been, a conversation that could go deeper. Answers are waypoints for you, rarely destinations. There is freedom in that, because you are not easily held to a single point of view. In the imagery of this app, three cards belong to you: the Fool, who sets out with light luggage, the Hermit, whose lantern shines inward, and the Star, who offers direction without dictating the goal. The lantern is your guiding symbol. It never shows the whole path, only the next few steps, and that is often enough for you. Your gift is the openness with which you let new things in. One invitation for you may be to give what you have found some time, so it can take root.',
      strengths: [
        'You ask the questions others overlook, and so you open conversations that would otherwise stay on the surface.',
        'New things rarely put you off. You can stay with uncertainty for a while without forcing a solution.',
        'You learn from many sources and connect experiences that seem unrelated at first glance.',
      ],
      shadows: [
        'Which answer have you already found but not yet dared to let stand?',
        'Where does the search for the right thing keep you from taking the good that is already here?',
      ],
      growth: 'Carrying one question with you for a while instead of jumping straight to the next.',
      reflections: [
        'What have I discovered recently that I have not yet honoured?',
        'Where in my life may I arrive, at least for a while?',
        'Which question do I keep asking, and what is it really looking for?',
        'Who likes to walk my detours with me?',
      ],
      reveal: 'You follow the light of a question. Not every destination has to be fixed for the path to make sense.',
      complement: 'Curiosity is the gift of this second voice. It reminds you to look at familiar things again with open eyes.',
    },
    guardian: {
      description:
        'As the Guardian, you create a place to stand. People sense that something stays reliable around you, even when much else is in motion. You notice early what a room, a group or a relationship needs, and you take care of it, often without fuss. Care is not a duty for you but a form of attention. In the imagery of this app, three cards belong to you: the Emperor, who offers order and safe boundaries, Strength, who leads with a gentle hand rather than force, and Temperance, who balances and keeps measure. The lily is your guiding symbol, a sign of purity and protection that need not be loud. Your gift is steadiness. One invitation for you may be to grant yourself the same protection you give to others, and to notice your own needs before the end of the day.',
      strengths: [
        'People can count on you. What you promise, you carry through, and others can build on it.',
        'You sense boundaries finely, your own and other people’s, and treat them with care.',
        'In restless times you remain a calm centre where others can gather.',
      ],
      shadows: [
        'What would happen if, for once, you asked for help instead of only giving it?',
        'When do you hold on to the familiar even though it has long felt too tight?',
      ],
      growth: 'Sharing out your care so that some is left for you as well.',
      reflections: [
        'Where may I carry less today?',
        'Which of my boundaries deserves more respect right now?',
        'Who gives me support when I need it?',
        'What do I protect out of habit, and what out of real conviction?',
      ],
      reveal: 'You are a safe place for others. Your strength shows quietly, in loyalty and attentiveness.',
      complement: 'This second voice keeps you grounded. It invites you to care well for what matters to you, yourself included.',
    },
    visionary: {
      description:
        'As the Visionary, you perceive what lies between the lines. You sense connections before you can name them, and images, dreams or a sudden feeling often speak more clearly to you than long explanations. This sensitivity lets you watch the world closely, and you recognise patterns where others see only chance. In the imagery of this app, three cards belong to you: the High Priestess, who keeps inner knowledge, the Moon, who guides through twilight and intuition, and the Wheel of Fortune, who tells of cycles and turning points. The eye is your guiding symbol, a gaze that reaches inward as well as outward. Your gift is breadth of vision. One invitation for you may be to test your intuitions kindly and give them a first small, tangible step, so they do not remain only images.',
      strengths: [
        'You pick up moods and undertones that others easily miss.',
        'Your imagination opens possibilities no one has thought of yet.',
        'You recognise patterns and repetitions, and so you see connections that reach beyond the moment.',
      ],
      shadows: [
        'Which hunch do you take more seriously than what is actually in front of you?',
        'When do you doubt your perception just because others do not share it?',
      ],
      growth: 'Trusting your own perception while keeping it open to other views.',
      reflections: [
        'Which image keeps coming back to me lately?',
        'What does my gut tell me when I give it a minute of silence?',
        'Which cycle in my life is repeating right now?',
        'How can I turn one idea from today into a small step?',
      ],
      reveal: 'You see what is still taking shape. Your intuitions are a language you may learn to read.',
      complement: 'With this second voice your eye opens to undertones. Alongside the facts, your intuitions get a place too.',
    },
    alchemist: {
      description:
        'As the Alchemist, you do not go around what is difficult but through it. You have learned that crises, breaks and uncomfortable feelings often hold a raw material from which something new can grow. This stance gives you depth and a particular kind of courage. Others may seek you out just when something starts to sway. In the imagery of this app, three cards belong to you: Death, who speaks of farewell and change, the Tower, who breaks open rigid walls, and the Devil, who points to ties that can be loosened once they are seen. The phoenix is your guiding symbol, a creature that rises anew from the ashes. Your gift is endurance through change. One invitation for you may be to tell apart what wants to be transformed and what may simply be accepted.',
      strengths: [
        'You can stay with difficult feelings without running from them, and you often find meaning in them.',
        'You turn mistakes and detours into experience that helps you and others.',
        'When something breaks, you already see the pieces from which something new can be built.',
      ],
      shadows: [
        'Do you sometimes seek depth where lightness would also be allowed?',
        'Which change do you wish for in others that may really be your own?',
      ],
      growth: 'Granting small, quiet changes their worth too, not only the great upheavals.',
      reflections: [
        'Which experience from the past carries a strength for me today?',
        'What am I clinging to, and what would happen if I held it more loosely?',
        'Where may I simply accept today instead of changing?',
        'Which part of me is being rebuilt right now?',
      ],
      reveal: 'You know the power of transformation. What you have lived through becomes something precious in you.',
      complement: 'Here the courage for depth joins in. Even a heavy stretch can become raw material for something new.',
    },
    wanderer: {
      description:
        'As the Wanderer, you learn by going. Movement clears your head, and new places, people or tasks show you sides of yourself that stay hidden when everything stands still. You need space, in the world and in your thinking, and you trust that the path takes shape beneath your feet. This makes you adaptable and open to encounters. In the imagery of this app, three cards belong to you: the Chariot, who moves forward with will and direction, the Lovers, who ask for a choice from the heart at every crossroads, and the World, who describes the feeling of having arrived while staying free. The feather is your guiding symbol, light enough to travel on the wind. Your gift is trust in the path. One invitation for you may be to allow roots as well, and to notice which places and people truly nourish you.',
      strengths: [
        'You find your way quickly in new situations and turn detours into discoveries.',
        'You meet unfamiliar people and views openly and without quick judgement.',
        'Movement, outside or in your head, helps you get stuck questions flowing again.',
      ],
      shadows: [
        'When is setting out curiosity, and when is it more a way of avoiding closeness?',
        'What would you discover if you stayed in one place longer than usual?',
      ],
      growth: 'Combining freedom and commitment so that both have room.',
      reflections: [
        'Where do I feel at home, even when I am on the move?',
        'Which decision is waiting at my next crossroads?',
        'What do I take with me from my recent paths?',
        'Who or what makes me glad to stay?',
      ],
      reveal: 'You find yourself by going. Every path gives you a little more of who you are.',
      complement: 'Movement and space come into your life with this second voice. Now and then a new path may call, even in small ways.',
    },
    creator: {
      description:
        'As the Creator, you bring new things into the world. Ideas rarely stay mere thoughts with you; they want to take form, as a picture, a text, a project or a lovingly laid table. You enjoy shaping things and often carry others along with your enthusiasm. Creating is a way for you to speak with the world. In the imagery of this app, three cards belong to you: the Magician, who combines the means at hand into something new, the Empress, who nourishes growth and abundance, and the Sun, who radiates joy and liveliness. The staff is your guiding symbol, a sign of drive and the spark that sets something in motion. Your gift is expression. One invitation for you may be to show unfinished work too, and not to measure your worth only by what comes of it in the end.',
      strengths: [
        'You see material for something new in simple things, and you just begin.',
        'Your enthusiasm is contagious and encourages others to dare something themselves.',
        'You give feelings and ideas a form that can be seen, heard or touched.',
      ],
      shadows: [
        'What would you create if no one would ever judge it?',
        'When do you prefer starting something new to letting what you began ripen in peace?',
      ],
      growth: 'Seeing pauses as part of creating, times in which something new quietly grows.',
      reflections: [
        'Which idea has been waiting a while for me to begin it?',
        'What makes me lose track of time because it simply brings me joy?',
        'What may stay imperfect today?',
        'Who could I shape something together with?',
      ],
      reveal: 'You give ideas a shape. What comes into being through you carries your own signature.',
      complement: 'This second voice wakes your delight in making things. Then even a small beginning counts as a work.',
    },
    sage: {
      description:
        'As the Sage, you seek the understanding behind things. You listen closely, weigh things up and take your time before you judge. Knowledge is not a possession for you but a lamp that brings clarity to tangled situations, for you and for others. Many value your calm advice and your ability to name what matters. In the imagery of this app, three cards belong to you: the Hierophant, who passes on what has been handed down, Justice, who weighs honestly, and the Hanged Man, who sees the world from a new angle and gains insight from it. The owl is your guiding symbol; it sees in the dark and is most attentive in the quiet. Your gift is clarity. One invitation for you may be to join your knowledge with feeling, and to allow closeness where distance would be more comfortable.',
      strengths: [
        'You can bring order to confusion and name the essentials in a few words.',
        'You do not judge hastily; you listen first and check what was really said.',
        'Others trust your advice because you are honest, even when it is uncomfortable.',
      ],
      shadows: [
        'When do you hide a feeling behind a clever explanation?',
        'What would open up if, for once, you did not have to know?',
      ],
      growth: 'Showing your own uncertainty and recognising a kind of wisdom in it.',
      reflections: [
        'What did I last learn from someone I had underestimated?',
        'Which view of something could I turn upside down today?',
        'Where is my head speaking, and where my heart?',
        'Which knowledge would I like to pass on?',
      ],
      reveal: 'You seek the understanding behind things. In your calm lies a clarity that gives others direction.',
      complement: 'A clear, calm eye walks with you as your second voice. Before decisions it helps you pause and look closely.',
    },
    renewer: {
      description:
        'As the Renewer, you know that endings are also beginnings. You sense when something has had its time, and you find the courage to let it go so that there is room for something new. That is a precious ability, because letting go is hard for many, while you often already notice the next seed. A fresh start is not a rupture for you but a natural rhythm, like the seasons. In the imagery of this app, three cards belong to you: Death, who honours farewells, Judgement, who calls to a conscious new beginning, and the Star, who brings hope after stormy times. The lotus is your guiding symbol, a flower that rises clear and beautiful from murky water. Your gift is renewal. One invitation for you may be to honour farewells consciously instead of rushing ahead at once, and to give time to what still wants to ripen.',
      strengths: [
        'You can let go of what no longer fits, and so you make room for something new.',
        'After hard times you find your way back into life and encourage others to do the same.',
        'You recognise the right moment for a fresh start and meet it with confidence.',
      ],
      shadows: [
        'Which farewell still needs a little grief before the new beginning can really hold?',
        'When is a fresh start a renewal, and when a way of avoiding staying?',
      ],
      growth: 'Being patient with what grows slowly, and giving it care rather than haste.',
      reflections: [
        'What in me is quietly beginning to grow anew?',
        'What am I grateful to a closed chapter for?',
        'What may still stay, even though I wanted to let it go?',
        'Which hope carries me these days?',
      ],
      reveal: 'You know that every ending holds a beginning. For you, letting go is an act of trust.',
      complement: 'Letting go comes a little easier with this second voice. An ending may make room for something new.',
    },
  },
  {
    lantern: 'Lantern',
    star: 'Star',
    key: 'Key',
    lily: 'Lily',
    pillars: 'Pillars',
    rose: 'Rose',
    eye: 'Eye',
    moon: 'Moon',
    feather: 'Feather',
    phoenix: 'Phoenix',
    serpent: 'Serpent',
    chalice: 'Chalice',
    wheel: 'Wheel',
    wheat: 'Ear of wheat',
    staff: 'Staff',
    sun: 'Sun',
    lotus: 'Lotus',
    owl: 'Owl',
    scales: 'Scales',
    butterfly: 'Butterfly',
    lemniscate: 'Lemniscate',
  },
);
