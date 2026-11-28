/**
 * Module symbols, English (V06.4). 24 symbols with name, meaning, light, shadow and reflection.
 * Every meaning names the tradition ("is traditionally a sign of"), never a power of the symbol.
 * Where a symbol appears in a card picture, the text describes this app's painted deck (S-34,
 * picture check S-64), not the classic image. Names as in the module `archetypes`.
 */
import { symbolsTable } from './symbols-keys.ts';
import type { TextTable } from './registry.ts';

export const texts: TextTable = symbolsTable({
  sun: {
    name: 'Sun',
    meaning:
      'The sun is traditionally a sign of life, clarity and awareness. It makes visible what lay in the dark and gives warmth without asking anything in return. In many cultures it stands for the self that may show itself as it is. In this deck it rises between two towers on the Death card, and on the Sun it shines brightly above an old garden wall. Its light is a reminder that even after long nights, day returns.',
    light: 'The sun invites you to show what is bright and alive in you.',
    shadow: 'Do you sometimes shine so brightly that there is no room left for doubt or tiredness?',
    reflection: 'What in your life feels warm and clear right now?',
  },
  moon: {
    name: 'Moon',
    meaning:
      'The moon is traditionally a sign of the unconscious, of dreams, feelings and cycles. It does not shine by itself but reflects the light of the sun, and each night it shows a slightly different shape. So it stands for what changes and still returns. In this deck it glows behind the curtain of the High Priestess and shows its full disc with a golden crescent above the path of the Moon. Its light reveals outlines, not details.',
    light: 'The moon encourages you to trust feelings and hunches, even before they take a clear shape.',
    shadow: 'When do you lose yourself in moods until you hardly know what is dream and what is real?',
    reflection: 'Which feeling keeps coming back to you, like a phase of the moon?',
  },
  star: {
    name: 'Star',
    meaning:
      'The star is traditionally a sign of hope, orientation and trust. Sailors and travellers read their way by the stars long before there were maps. A star is far away and still gives direction without prescribing a goal. In this deck it glows in the glass of the Hermit’s lantern, forms a wreath of twelve stars above the Empress and shines large with eight rays on the Star. It stands for a light that only becomes visible at night.',
    light: 'The star reminds you that a distant light is enough to keep your direction.',
    shadow: 'Are you waiting for a sign from above instead of taking your own next step?',
    reflection: 'What gives you orientation right now, even if the goal is still far away?',
  },
  lotus: {
    name: 'Lotus',
    meaning:
      'The lotus is traditionally a sign of purity, awakening and inner growth. It roots in the mud of a pond and still opens its flower clean above the water. In old traditions of India and Egypt it stands for a mind that unfolds without denying where it comes from. Every layer of the way belongs to it, the murky one too. The lotus tells of beauty that can grow from what first seems heavy.',
    light: 'The lotus shows you that you can grow and open up out of difficult experiences.',
    shadow: 'Would you rather show only the flower and hide the mud it grew from?',
    reflection: 'What has grown in you out of a hard time?',
  },
  key: {
    name: 'Key',
    meaning:
      'The key is traditionally a sign of access, knowledge and decision. It opens and it locks, and whoever holds it chooses which door moves. In old images, guardians of the threshold carry keys that mediate between inside and outside. In this deck two large keys cross on the chequered floor in the hall of the Hierophant. They lie there openly, as if anyone were allowed to pick them up.',
    light: 'The key reminds you that you can open some doors yourself.',
    shadow: 'Which door do you keep closed, although the key has long been in your hand?',
    reflection: 'What knowledge could open a door for you right now?',
  },
  butterfly: {
    name: 'Butterfly',
    meaning:
      'The butterfly is traditionally a sign of transformation, lightness and the soul. Before it can fly, it lives as a caterpillar and rests hidden in a chrysalis, where its form is rearranged completely. In Greek, psyche means both soul and butterfly. So it stands for change that needs time and stillness. Its flight looks delicate, and yet some species travel great distances.',
    light: 'The butterfly encourages you to give a change time until it unfolds by itself.',
    shadow: 'Is part of you trying to fly already while something still needs rest in the chrysalis?',
    reflection: 'Which transformation is quietly happening in you right now?',
  },
  phoenix: {
    name: 'Phoenix',
    meaning:
      'The phoenix is traditionally a sign of renewal and of the strength to begin again after an ending. According to legend, the bird burns in flames at the end of its long life and rises again from its own ashes. Even in antiquity it was told of as an image of return. It stands for change that glosses over nothing: something really passes. And yet something remains from which the new can arise.',
    light: 'The phoenix shows you that after an ending, something new can rise in you.',
    shadow: 'Are you holding on to the ashes, although you already sense that something new wants to begin?',
    reflection: 'What in your life has come to an end and left room for something new?',
  },
  serpent: {
    name: 'Serpent',
    meaning:
      'The serpent is traditionally a sign of transformation, life force and knowledge. It sheds its skin many times in its life and simply leaves the old shell behind. Many cultures see it as a keeper of wisdom, and as the ouroboros biting its own tail it stands for the eternal cycle. It is considered ambiguous, watchful and close to the earth at once. Its image invites you to shed what has grown too tight.',
    light: 'The serpent encourages you to shed what has become too tight for you.',
    shadow: 'Which old skin are you still wearing because it is familiar, although it no longer fits?',
    reflection: 'What would you like to shed so you can breathe freely again?',
  },
  tree: {
    name: 'Tree',
    meaning:
      'The tree is traditionally a sign of growth, rootedness and connection. Its roots reach into the earth, its crown into the sky, and many myths see it as an axis between the worlds. It grows slowly and adds a ring with every year. In this deck two very different trees lean towards each other on the Lovers, and on the Hanged Man a living tree grows by a still lake. A tree stands for steadiness that stays alive.',
    light: 'The tree invites you to root deeply and still give yourself room to grow.',
    shadow: 'Where do you stand so firmly that no wind may move you any more?',
    reflection: 'What gives you roots, and where would you like to grow?',
  },
  owl: {
    name: 'Owl',
    meaning:
      'The owl is traditionally a sign of wisdom, wakefulness and the gaze into what is hidden. In Greek tradition it accompanied Athena, the goddess of wisdom. It sees and hears at night, when other animals rest, and flies almost silently. That is why it stands for a knowledge that grows in stillness and looks closely. Its calm gaze is a reminder that clarity often comes when things around us have grown quiet.',
    light: 'The owl encourages you to grow still and look closely before you judge.',
    shadow: 'When do you withdraw so far into watching that you hardly take part any more?',
    reflection: 'What do you see more clearly when you grow still?',
  },
  crown: {
    name: 'Crown',
    meaning:
      'The crown is traditionally a sign of dignity, responsibility and completion. It is worn on the head, the highest point of the body, and in many images it links the earthly with the higher. Whoever wears it stands up for something beyond their own person. In this deck the small golden crown on the Tower has come loose a little from the masonry. So it also shows that dignity stays movable and is not walled in.',
    light: 'The crown reminds you of your own dignity and of what you are willing to take responsibility for.',
    shadow: 'Is there a rank or reputation you cling to, even though it has long become too heavy?',
    reflection: 'Which responsibility do you carry gladly?',
  },
  chalice: {
    name: 'Chalice',
    meaning:
      'The chalice is traditionally a sign of feeling, receiving and connection. In tarot it belongs to the element of water and to everything that moves the heart. A chalice is open and can only hold what flows into it. In this deck it stands on the Magician’s table, and on Temperance an arc of water links two golden chalices. It tells of abundance that begins with receiving.',
    light: 'The chalice invites you to openly receive the care that comes your way.',
    shadow: 'How often do you pour out so much from your chalice that nothing is left for yourself?',
    reflection: 'What is filling your inner chalice right now?',
  },
  sword: {
    name: 'Sword',
    meaning:
      'The sword is traditionally a sign of clarity, truth and decision. In tarot it belongs to the element of air, to thinking and to the clear word. A sword separates what has grown together and so creates distinction. In this deck it lies on the Magician’s table, and on Justice it stands upright as the axis of the scales. So it shows a clarity that stays in balance.',
    light: 'The sword encourages you to name clearly what you think and what you want.',
    shadow: 'Where do your words become sharper than the matter requires?',
    reflection: 'Which decision would bring you clarity right now?',
  },
  staff: {
    name: 'Staff',
    meaning:
      'The staff is traditionally a sign of willpower, drive and growth. In tarot it belongs to the element of fire and to everything that gets moving. A walking staff gives hold when the ground is uneven. In this deck it leans against a rock on the Fool, carries the Hermit’s lantern and stands as a golden staff with three rings in the hall of the Hierophant. It stands for the strength to set out and keep going.',
    light: 'The staff gives you momentum to turn an idea into action.',
    shadow: 'Does your fire sometimes consume you more than it warms you?',
    reflection: 'What would you like to put your strength into right now?',
  },
  rose: {
    name: 'Rose',
    meaning:
      'The rose is traditionally a sign of love, beauty and mystery. The red rose stands for passion, the white for purity and new beginnings, and its thorns are a reminder that beauty is vulnerable. In antiquity it was also an image of discretion. In this deck a white rose grows beside the rocky edge of the Fool and blooms in the foreground of Death. On the Magician’s table, roses stand beside lilies.',
    light: 'The rose invites you to consciously notice beauty and love in your everyday life.',
    shadow: 'Do you guard your heart with thorns, although you actually long for closeness?',
    reflection: 'What is blooming in your life that you would like to honour more?',
  },
  lily: {
    name: 'Lily',
    meaning:
      'The lily is traditionally a sign of purity, innocence and clarity. With its bright, upright flower it stands in many images for a clear mind and an open heart. In tarot it often appears beside the rose, as the counterpart of passion. In this deck lilies stand on the Magician’s table, and on Strength a lily grows out of a cracked stone. It shows that something tender can make room for itself even in hard places.',
    light: 'The lily reminds you that clarity and gentleness go well together.',
    shadow: 'Are you demanding a purity of yourself that no longer allows any mistake?',
    reflection: 'Where may something tender grow in you?',
  },
  eye: {
    name: 'Eye',
    meaning:
      'The eye is traditionally a sign of perception, awareness and inner vision. In many cultures it stands for an alert gaze that reaches beneath the surface. In ancient Egypt the Eye of Horus was considered a sign of wholeness, and some teachings speak of an inner eye of intuition. It invites you to look closely. That includes looking at yourself honestly.',
    light: 'The eye encourages you to trust your perception and look more closely.',
    shadow: 'Where would you rather look away because what you might see would be uncomfortable?',
    reflection: 'What do you see when you look honestly?',
  },
  feather: {
    name: 'Feather',
    meaning:
      'The feather is traditionally a sign of lightness, freedom and truth. In ancient Egypt, according to tradition, the heart of the dead was weighed against the feather of Maat, the goddess of truth and order. Feathers carry birds through the air, and for a long time people wrote down their thoughts with quills. So it links lightness with expression. Whoever finds a feather may see in it an invitation to take something more lightly.',
    light: 'The feather invites you to take something more lightly and give your thoughts room.',
    shadow: 'When does lightness become an escape from what really carries weight?',
    reflection: 'If no one were reading along, what would you write down?',
  },
  wheel: {
    name: 'Wheel',
    meaning:
      'The wheel is traditionally a sign of cycles, change and movement. It turns, and what was just at the top travels down and up again. Meanwhile its centre stays calm while the rim moves. Many cultures know the wheel as an image of the course of time and the seasons. In this deck a golden wheel with eight spokes floats in the violet sky of the Wheel of Fortune, and the empty Chariot stands ready on its wheels.',
    light: 'The wheel reminds you that difficult times keep turning too.',
    shadow: 'Do you feel at the mercy of how things go, although you could stand in the calm centre?',
    reflection: 'Which cycle is repeating itself in your life right now?',
  },
  pillars: {
    name: 'Pillars',
    meaning:
      'Pillars are traditionally a sign of balance, support and the threshold between two worlds. In pairs they frame gates and temples, and whoever passes between them enters another space. Often one stands for the light, the other for the dark. In this deck a dark and a light pillar frame the curtain of the High Priestess, and on Justice two pillars enclose the alcove. Between them lies the space where both sides may hold true.',
    light: 'The pillars encourage you to let both sides of a matter stand and find your way between them.',
    shadow: 'Have you divided the world so strictly into light and dark that nothing in between remains?',
    reflection: 'Between which two poles are you moving right now?',
  },
  scales: {
    name: 'Scales',
    meaning:
      'The scales are traditionally a sign of justice, weighing and balance. They do not show what is right but make visible how the weights are distributed. In ancient Egypt and Greece they were already an image of a fair judgement. In this deck an upright sword forms the axis of the golden scales, and both pans hang at the same height. So they link clarity with balance.',
    light: 'The scales invite you to weigh things calmly before you decide.',
    shadow: 'Where do you weigh things up for so long that the decision never comes?',
    reflection: 'Where in your life has something fallen out of balance right now?',
  },
  lantern: {
    name: 'Lantern',
    meaning:
      'The lantern is traditionally a sign of inner light, seeking and guidance. It carries a small flame through the darkness and keeps it safe from the wind. Its light does not reach far, but it is enough for the next steps. In this deck it hangs from the curved end of the walking staff on the Hermit’s snowy peak, and a small star glows in its glass. Whoever carries a lantern looks for the way, not for the whole destination.',
    light: 'The lantern encourages you to follow your own light, step by step.',
    shadow: 'Could it be that you stay so alone with your light that no one can find you any more?',
    reflection: 'Which next step can you already see in the light of your lantern?',
  },
  lemniscate: {
    name: 'Lemniscate',
    meaning:
      'The lemniscate, the figure eight lying on its side, is traditionally a sign of infinity, balance and eternal flow. As the sign ∞ it stands for the infinite in mathematics, and its line runs back into itself without beginning or end. Its two loops join opposites in a single movement. In this deck it floats in gold above the Magician’s table and above the calm lion of Strength. It tells of strength that renews itself instead of wearing itself out.',
    light: 'The lemniscate reminds you that giving and receiving may stay in one flow.',
    shadow: 'Do your thoughts go round in circles without coming to rest?',
    reflection: 'Where do you draw strength that renews itself again and again?',
  },
  wheat: {
    name: 'Ear of wheat',
    meaning:
      'The ear of wheat is traditionally a sign of abundance, harvest and gratitude. From a single grain grows a stalk with many new grains, and so it stands for what arises from patience and care. In ancient cultures it belonged to the goddesses of fertility and farming, such as Demeter. In this deck the golden heart-shaped shield of the Empress leans in ripe wheat. The ear of wheat is a reminder that every harvest needs its time.',
    light: 'The ear of wheat invites you to notice what you have already harvested and to be grateful for it.',
    shadow: 'Are you trying to harvest before what you sowed has had time to ripen?',
    reflection: 'What are you grateful for today that has grown slowly?',
  },
});
