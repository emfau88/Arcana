/**
 * Module cards-deep, English (V05.1): card depth, fifteen texts per card. An adaptation of the
 * German texts, not a word-for-word translation. Describes this app's painted deck (S-34).
 * Group 1 (S-29): 0–VII, the Fool and the outer path.
 */
import { deepTable, type DeepCard } from './cards-deep-keys.ts';
import type { TextTable } from './registry.ts';

const cards: Record<string, DeepCard> = {
  'major-00-fool': {
    light:
      'The Fool brings the freshness of a beginning that has nothing to prove yet. It trusts the path before knowing it and stays open to whatever comes along the way. In its light, not knowing turns into curiosity.',
    shadow:
      'When lightness stops looking down, it easily becomes recklessness. And sometimes setting out is also a way to avoid something uncomfortable. Are you walking towards something right now, or away from it?',
    keyword:
      'For the Fool, beginning is not escape but readiness: the bundle is packed and the gaze points ahead. It is enough that the first step is possible, even while the destination is still in the mist.',
    symbols:
      'Staff and bundle lean against a rock, set down as if someone paused for a moment before moving on. A white rose grows by the cliff edge, mist fills the valley below, and a pale sun is rising. The drop is there, yet the picture feels like a deep breath before the path.',
    roles: {
      light: 'Your curiosity carries you, and you may begin before you can do it all.',
      shadow: 'Perhaps you are not seeing how close the edge is. Lightness also needs an eye on the ground.',
      root: 'An earlier beginning still resonates, one where you simply set off. What you learned then is still in your bundle.',
      possibility: 'A path you cannot plan yet could open up. Perhaps it only appears once you risk a first step.',
      bridge: 'The Fool joins courage and openness. You can be unsure and ready at once.',
    },
    study: [
      'No one appears in this picture: staff and bundle are set down, the edge is empty. The journey has not begun yet, or it is taking a pause. What would you do at this spot if the bundle were yours?',
      'Think of a beginning in your life that you were not ready for and made anyway. What let you set off back then? Where could you use that courage today?',
    ],
    question: 'Which beginning am I putting off while I wait for the perfect moment?',
    reflections: ['What may I try for the first time today?', 'What baggage could I set down along the way?'],
    ritual: 'Stand at an open window, breathe in deeply and quietly say one sentence to begin your day with.',
  },
  'major-01-magician': {
    light:
      'The Magician knows that everything needed is already on the table. Gathered attention turns an idea into something your hands can do. In this light, skill becomes visible.',
    shadow:
      'Great skill can also want to impress rather than make a difference. Then craft becomes a show, and will becomes the urge to keep everything under control. What are you using your skill for right now, and for whom?',
    keyword:
      'For the Magician, will is not hardness but focused attention: one aim, one hand, one tool. Will means starting what you want instead of only dreaming about it.',
    symbols:
      'On the red-draped table lie a goblet, a coin, a sword and a wand, the traditional signs of the four elements. In the middle a beam of light rises to a golden figure eight lying on its side, the sign of the infinite. Roses and lilies along the edge join passion and clarity.',
    roles: {
      light: 'Your skill holds you up, even the kind you hardly notice yourself.',
      shadow: 'You may be spreading your strength across too many tools at once. Doing one thing fully could achieve more.',
      root: 'An ability you learned early is still alive in you. It may have become more of a given than it deserves.',
      possibility: 'An idea that has been with you for a while could now become a first concrete step.',
      bridge: 'The Magician builds a bridge between thinking and doing. Often only one clear decision lies between plan and action.',
    },
    study: [
      'Four things lie on the table: goblet, coin, sword and wand. Each stands for a different way of acting in the world, from feeling to doing. Which one feels closest to you, and which do you rarely use?',
      'Choose an idea you have been carrying for a while. Consider which tool you already have to begin it, and what the smallest first step would be. What keeps you from taking it today?',
    ],
    question: 'What do I want to use my skill for when no one is watching?',
    reflections: ['Which idea is waiting for me to start it?', 'What deserves my whole attention today?'],
    ritual: 'Clear your table of everything but one object you need today, and work with only that for a while.',
  },
  'major-02-high-priestess': {
    light:
      'The High Priestess knows the strength of waiting. She listens to what lies beneath the words and lets a hunch ripen before she speaks. In her light, stillness becomes a kind of knowing.',
    shadow:
      'Sensing a great deal can also mean hiding behind silence. Then something stays unsaid that wants to be said, or a hunch is never tested. What have you known for a while without saying it?',
    keyword:
      'Intuition is knowing that arrives faster than the reasons. The High Priestess takes it seriously and still tests it calmly.',
    symbols:
      'A dark and a pale pillar frame a veil embroidered with pomegranates, and behind it glows a large moon. In front of them a blank, half-unrolled scroll rests by still water. The picture speaks of the in-between: between light and dark, between what is said and what is not.',
    roles: {
      light: 'What supports you is your fine sense for things that have no name yet.',
      shadow: 'Perhaps you treat a hunch as a fact, or pass over it because it is quiet.',
      root: 'Something unspoken from an earlier time still resonates. It may work so strongly precisely because it never found words.',
      possibility: 'If you give a quiet hunch some room, an answer that was already there could show itself.',
      bridge: 'The High Priestess joins knowing and not knowing. Between them lies a calm space where you do not have to decide yet.',
    },
    study: [
      'At the front of the picture lies a scroll, blank and only half unrolled. Some knowledge has not been written down yet, perhaps not even thought. What would you write on this scroll if it were yours?',
      'Remember a hunch that later proved right. How did it feel back then, in your body and in your thoughts? How do you recognise such a hunch when it returns?',
    ],
    question: 'Which quiet voice in me do I give too little room?',
    reflections: ['What do I sense before I can explain it?', 'Where could I talk less and listen more today?'],
    ritual: 'Sit by a window, look at the sky for one minute, then write down a single word that came to you.',
  },
  'major-03-empress': {
    light:
      'The Empress lets things grow instead of pushing them. She knows the value of care, warmth and time, for others and for herself. In her light, care turns into abundance.',
    shadow:
      'Care can become too much when it cannot let go or forgets itself. Then tending turns into overprotection or exhaustion. Whom are you caring for right now, and who cares for you?',
    keyword:
      'For the Empress, creation means bringing forth in the widest sense: a garden, a relationship, a piece of work, a home. She does not create from nothing but from care and patience.',
    symbols:
      'A golden heart-shaped shield leans in ripe wheat, and above it floats a circlet of twelve stars. Green hills, cypresses and a small waterfall show a land where everything thrives. The heart stands where the harvest is: abundance grows from what is loved.',
    roles: {
      light: 'You are carried by what you have tended, even if it grew quietly.',
      shadow: 'What you need yourself can easily slip from view while you care for everything else.',
      root: 'An experience of being cared for, or its absence, still shapes you. It shows in how you look after yourself and others.',
      possibility: 'Something you nourish patiently could ripen and bear fruit.',
      bridge: 'Giving and receiving belong together for the Empress. Whoever cares for others may be cared for, too.',
    },
    study: [
      'The heart in the wheat is not a fragile heart but a shield of gold. Care can protect and be strong. Where in your life does something tender need that kind of protection?',
      'Bring to mind something that is growing in your life right now: a plan, a relationship, a skill. What does it need from you to keep growing well, time, rest or attention? What small care could you give it this week?',
    ],
    question: 'How would I look after myself if I were my own garden?',
    reflections: ['What has grown quietly that I am grateful for today?', 'Where could I allow more time so that something can ripen?'],
    ritual: 'Water a plant or slowly drink a glass of water, thinking of something you would like to let grow.',
  },
  'major-04-emperor': {
    light:
      'The Emperor gives support. He creates order, takes responsibility and stands by what he promises. In his light, a clear framework becomes a place where people can move safely.',
    shadow:
      'When order leaves no room, structure becomes a wall. Then it is about control rather than support, for others or for yourself. Which rule are you holding on to although it no longer serves you?',
    keyword:
      'Structure, as the Emperor sees it, is the frame on which something can grow: agreements, habits, boundaries. It is not an end in itself but holds things up so that other things can be free.',
    symbols:
      'An empty throne of dark basalt stands on broad steps, its armrests ending in stone ram heads. Orb and sceptre lie on the seat, and red mountains glow in the dusk behind. No one sits on the throne: the responsibility is waiting to be taken up.',
    roles: {
      light: 'Your reliability gives you support, for others and for yourself.',
      shadow: 'Perhaps you are holding on to a plan that no longer fits what is happening now.',
      root: 'Rules and expectations from your background can still be felt. Some give you support, others may have grown too tight.',
      possibility: 'A clear framework could give you freedom instead of taking it away.',
      bridge: 'The Emperor joins stability and responsibility. Whoever keeps order can give others room.',
    },
    study: [
      'The throne is empty, sceptre and orb lie ready. Power here is not a possession but a task someone can take up. For which area of your life would you sit down on this throne?',
      'Choose an area of your everyday life that feels messy right now. Which one rule, agreement or fixed time could give it some support? How does it feel to imagine trying it for a week?',
    ],
    question: 'What am I ready to take responsibility for, and what not any longer?',
    reflections: ['Which kind of order would make today easier?', 'Where am I holding too tight, and where too loose?'],
    ritual: 'Write down three things you want to do reliably today, and cross each one out the moment it is done.',
  },
  'major-05-hierophant': {
    light:
      'The Hierophant keeps what has proven itself and passes it on, knowing that no one has to find out everything alone. In this light, learning becomes a bond between people and between times.',
    shadow:
      'Inherited ways can turn into habits nobody examines. Then rules are followed simply because they exist, or one waits for permission from others. Whose approval do you need before you trust your own judgement?',
    keyword:
      'Tradition here means experience handed down: knowledge that many gathered before you. It comes alive when you understand it and carry it on in your own way.',
    symbols:
      'In a tall, quiet hall stands a golden staff with three rings, and on the checkered floor in front two large keys lie crossed. Books at the side recall gathered knowledge. The keys lie in the open: knowledge wants to be shared, and it opens doors.',
    roles: {
      light: 'What others learned before you and passed on to you carries you.',
      shadow: 'Without noticing, you may be following a rule that was never truly your own.',
      root: 'Values from your family or your school years live on in you. Some you carry gladly, others only out of habit.',
      possibility: 'A conversation with someone who knows the way could open a door for you.',
      bridge: 'In the Hierophant, the handed-down and your own come together. You can learn without giving yourself up.',
    },
    study: [
      'Two keys lie crossed on the floor of the hall. One could stand for what was handed down to you, the other for what you found out yourself. Which door would you open with both together?',
      'Recall a person from whom you learned something important. What did this person give you that you still use today? To whom could you pass some of it on?',
    ],
    question: 'Which tradition do I want to keep, and which may end with me?',
    reflections: ['Whom could I ask for advice today?', 'Which of my values shows in what I do today?'],
    ritual: 'Read a paragraph from a book that means a lot to you, and copy out one sentence to take with you today.',
  },
  'major-06-lovers': {
    light:
      'The Lovers stand for bonds that come from free choice. They show how two different beings can lean towards each other without giving themselves up. In their light, a decision becomes an expression of what truly matters to you.',
    shadow:
      'Longing for closeness can lead to choices against yourself. Then connection turns into fitting in, or a choice into putting things off. Where do you decide in order to be liked rather than by your heart?',
    keyword:
      'For the Lovers, connection arises where two independent beings move freely towards each other. It means love as much as friendship, and being in tune with your own values.',
    symbols:
      'Two very different trees grow on one hill, one with flame-orange leaves, one full of red apples. Their crowns lean together and open a view onto a mountain peak, above which a golden sun spreads its wings. Staying different and still meeting is the art of this picture.',
    roles: {
      light: 'A bond in which you may be just as you are gives you strength.',
      shadow: 'Perhaps you overlook where you adapt only so as not to risk closeness.',
      root: 'An earlier choice of the heart has left its traces. It helped shape what matters to you in relationships today.',
      possibility: 'A choice that heart and mind can both support could bring you new clarity.',
      bridge: 'The Lovers join two different sides without making them the same. The same holds for conflicting wishes within you.',
    },
    study: [
      'Two trees, different in leaf and fruit, grow from the same hill. Between their crowns a view opens that neither could reveal alone. Which bond in your life opens such a view for you?',
      'Consider a decision ahead of you, big or small. Write down what your mind says about it and what your heart says. Where do they agree, and where not?',
    ],
    question: 'Which bond in my life do I want to choose more consciously?',
    reflections: ['Whom would I like to meet with an open heart today?', 'What do my values say about the choice in front of me?'],
    ritual: 'Send a short greeting to someone who matters to you, for no special reason.',
  },
  'major-07-chariot': {
    light:
      'The Chariot brings movement with direction. It unites opposing forces without suppressing either and holds its course. In its light, determination becomes calm steering.',
    shadow:
      'Wanting to arrive at all costs makes it easy to miss what lies by the road. Then direction turns into doggedness, and everything that slows you down looks like an opponent. Which course are you keeping only out of habit?',
    keyword:
      'Direction is more than a goal for the Chariot: it is the decision where your own strength should flow. With a direction, you can take detours without losing yourself.',
    symbols:
      'An empty, splendid chariot stands before a walled city in the moonlight, with a midnight-blue canopy of golden stars above the seat. Before the wheels lie two spheres, one dark and one light. There are no horses: what moves this chariot is the decision to steer it.',
    roles: {
      light: 'Once you know where you want to go, your determination carries you.',
      shadow: 'Two wishes might be pulling in different directions, and you only hear the louder one.',
      root: 'A goal you once pursued with great strength is still at work. It showed you what drives you.',
      possibility: 'Once you choose a direction, much could start moving more easily.',
      bridge: 'In the Chariot, opposites are steered in the same direction. Both forces may stay.',
    },
    study: [
      'Before the chariot’s wheels lie two spheres, one dark and one light. They are at rest, yet the chariot needs both sides to travel in balance. Which two sides in you want to go in different directions right now?',
      'Write down one goal for the coming weeks in a single sentence. Below it, note what draws you towards it and what holds you back. What could steer both in one direction?',
    ],
    question: 'Where do I want to steer my strength when I am honest with myself?',
    reflections: ['Which direction feels right today?', 'What is holding me back, and which part of it should I take seriously?'],
    ritual: 'Walk briskly for a few minutes with a clear aim, perhaps to the next corner, and feel what a chosen direction is like.',
  },
  // Group 2 (S-29): VIII–XIV, the inner path.
  'major-08-strength': {
    light:
      'Strength shows a power that does not need to be loud. It tames not by force but with patience and care, including what is wild in oneself. In its light, gentleness becomes steadfastness.',
    shadow:
      'Wanting always to stay gentle can mean swallowing what needs to be said. Then patience turns into putting up with things, and your strength turns inwards. Where are you holding back although a clear word would be yours to say?',
    keyword: 'Gentleness here is not weakness but strength that has nothing to prove. It holds what is wild instead of fighting it.',
    symbols:
      'A calm lion rests with folded paws in the morning light, and beside it a flower grows from a cracked stone, circled by a floating garland of blossoms. Above them floats a golden figure eight lying on its side. The strong and the tender share the same light, and neither threatens the other.',
    roles: {
      light: 'Patience with yourself gives you more strength than pressure ever could.',
      shadow: 'Quite possibly you underestimate your strength because it is quiet.',
      root: 'Something heavy you carried in the past is still in you as strength. It may be greater than you give it credit for.',
      possibility: 'If you meet what is difficult kindly, it could lose some of its force.',
      bridge: 'Strength joins courage and tenderness. Both may rest in the same hand.',
    },
    study: [
      'A lion rests beside a flower that grows out of a cracked stone. Neither moves away from the other. What in this picture is the strong part for you, and what the tender one?',
      'Remember a moment when you stayed calm although a storm was raging inside you. What helped you stay kind to yourself then? Where could you use that calm right now?',
    ],
    question: 'Which wild part of me wants to be held, not fought?',
    reflections: ['How can I be kind and clear at the same time today?', 'Towards whom can I be more patient today, myself included?'],
    ritual: 'Rest a hand on your belly, feel it rise and fall for three breaths, and let your shoulders drop.',
  },
  'major-09-hermit': {
    light:
      'The Hermit seeks silence not to escape but to find. A light of one’s own needs no applause to trust the path. In this light, being alone becomes a way of gathering yourself.',
    shadow:
      'Retreat can also protect you from a closeness that feels uncomfortable. Then reflection turns into shutting yourself off, and the answer stays up on the mountain. With whom would you like to share what you found in the quiet?',
    keyword:
      'For the Hermit, solitude means leaving the noise for a while to hear your own voice again. It is a path inwards, not a farewell to the world.',
    symbols:
      'On a snowy peak in the deep night stands a walking staff with a lantern hanging from its curved end. In its glass shines a small star that tints the snow around it warm. The light does not reach far, but exactly as far as the next step needs.',
    roles: {
      light: 'Your ability to be alone without feeling lonely is a quiet support.',
      shadow: 'Perhaps you withdraw where a conversation would help you more.',
      root: 'Perhaps an earlier time on your own showed you what matters to you. You can return to that clarity.',
      possibility: 'In a quiet hour, an answer could surface that had no room in the bustle.',
      bridge: 'The Hermit joins retreat and return. What you find in the quiet may come back among people.',
    },
    study: [
      'The lantern hangs from the staff, no one holds it, and still it shines. Its light reaches only a little way into the night. Which step in your life needs no more light than this right now?',
      'Take five minutes without a screen and without conversation. Notice which thought keeps coming back once it is quiet. What might it want to tell you?',
    ],
    question: 'What do I only know when I am fully with myself?',
    reflections: ['When was I fully myself today?', 'What light do I carry that could show others the way?'],
    ritual: 'In the evening, switch off every lamp but one for a few minutes and sit quietly in its light.',
  },
  'major-10-wheel': {
    light:
      'The Wheel of Fortune is a reminder that nothing stands still. What is on top turns on, and what was below comes back into the light. In its light, change becomes a movement you can trust.',
    shadow:
      'Watching only the wheel can make you forget what lies in your own hands. Then change becomes an excuse to do nothing, or a fear of every turn. What in this situation really depends on you?',
    keyword:
      'For the Wheel, change is the rule, not the exception: times shift as a wheel turns. Accepting that lets you hope in hard phases and be grateful in light ones.',
    symbols:
      'A golden wheel with eight spokes floats in a violet sky, its rim decorated with tiny suns, moons and stars. Below it lies a wide landscape, and light clouds drift around it. The wheel has no beginning and no end, only a centre that stays calm while the rim turns.',
    roles: {
      light: 'You are supported by knowing that things can turn, for the better too.',
      shadow: 'Without realising it, you may be waiting for a turn instead of taking a step yourself.',
      root: 'A recurring pattern from earlier years is still turning with you. Recognising it is the first step towards answering differently.',
      possibility: 'A turn could show itself if you stay flexible and keep looking.',
      bridge: 'The Wheel joins above and below into one circle. Both belong to the same path.',
    },
    study: [
      'Eight spokes lead from the rim to the centre of the wheel. The rim turns, the hub stays in place. What in your life is the moving rim right now, and what is the calm centre?',
      'Set two stretches of your life side by side: a hard phase that turned, and an easy one that passed. What did both teach you about change? Which attitude do you want to take into the next turn?',
    ],
    question: 'Which circle in my life do I not want to go round again?',
    reflections: ['What may change today without my holding on to it?', 'What stays calm in me while much is moving outside?'],
    ritual: 'Draw a circle on a sheet of paper, write what is moving around its edge, and in the middle what stays the same.',
  },
  'major-11-justice': {
    light:
      'Justice looks closely and weighs things before judging. It asks for honesty, outwards and inwards, and stands by the consequences of its own actions. In its light, clarity becomes peace with your own decision.',
    shadow:
      'Wanting to be perfectly fair can turn into harshness, towards others or yourself. Then every mistake weighs too much, and mildness seems forbidden. Where do you judge more strictly than the matter needs?',
    keyword: 'Clarity, for Justice, means seeing things as they are, not as you would like them to be. Only then can you weigh them fairly.',
    symbols:
      'An upright sword is the axis of a golden scale, both pans hanging at the same height. Behind them falls a deep red curtain, and two columns and shallow steps frame the niche. The sword divides, the scale balances: clarity and fairness belong together.',
    roles: {
      light: 'Your honesty with yourself is solid ground.',
      shadow: 'A judgement about yourself or others can easily block your view of the whole situation.',
      root: 'An earlier decision and its consequences can still be felt. It invites you to take responsibility without condemning yourself.',
      possibility: 'An honest conversation could bring something into balance that has long been tilted.',
      bridge: 'Justice joins strictness and fairness. Seeing clearly also makes a mild judgement possible.',
    },
    study: [
      'The sword stands upright, and the two pans of the scale hang at exactly the same height. Nothing here weighs more than the other. What would you place in one pan, and what in the other?',
      'Pick a decision you keep putting off. Write down honestly what speaks for each option, including what you are reluctant to admit. What shows itself once both are on paper?',
    ],
    question: 'Where am I unfair to myself without noticing?',
    reflections: ['What would be honest today, even if it is uncomfortable?', 'To whom do I still owe a clarifying word?'],
    ritual: 'Write down one sentence in which you forgive yourself something, and read it aloud once.',
  },
  'major-12-hanged-man': {
    light:
      'The Hanged Man lets go where struggling no longer helps. He pauses, sees things from the other side and finds a new order in it. In his light, a pause becomes an insight.',
    shadow:
      'Waiting can become a stance to hide behind. Then something stays suspended although a step would have been possible long ago. Are you waiting because the moment needs it, or because you do?',
    keyword:
      'For the Hanged Man, a pause is not idleness but a deliberate stop so that something can show itself. Holding still often reveals what stays hidden while running.',
    symbols:
      'A living tree grows on the shore of a calm lake, its trunk dividing at the top into two wide-spreading branches. Behind the fork a soft glow lights the evening sky and is mirrored in the water. Nothing hangs here, nothing is bound: the picture shows a pause in which the view widens.',
    roles: {
      light: 'Your willingness to see a situation from the other side holds you up.',
      shadow: 'It may be that you hold on to one view because changing it would be uncomfortable.',
      root: 'A time when you had to wait is still in you. Perhaps it taught you what cannot be forced.',
      possibility: 'If you stop pulling, something could loosen by itself.',
      bridge: 'The Hanged Man joins surrender and insight. In letting go, a new view can open.',
    },
    study: [
      'The tree stands still by the water, and behind its fork a glow is mirrored in the lake. In the mirror everything is upside down, and yet it is the same picture. Which situation in your life would change if you looked at it the other way round?',
      'Take a question that is on your mind and write it down the way a kind-hearted person might ask it of you. What changes when you read it like this? Which answer have you overlooked so far?',
    ],
    question: 'What in my life do I no longer want to force?',
    reflections: ['Where could a pause show me more than haste today?', 'What would my day look like if I saw it from its end?'],
    ritual: 'Switch off everything that drives you for one minute and simply watch something move outside: leaves, clouds, people.',
  },
  'major-13-death': {
    light:
      'The Death card stands for farewells that make room. It allows something to end that has had its time, and trusts that something can grow afterwards. In its light, letting go becomes an act of care.',
    shadow:
      'Endings can come too fast when they only follow restlessness. Or they are avoided for so long that the old ties up all your strength. What are you ending too early, and what too late?',
    keyword: 'Release, with this card, means closing a chapter deliberately instead of letting it fray. It hurts and frees at the same time.',
    symbols:
      'A white rose blooms in the foreground, and behind it lies a valley dark as night. A river draws a narrow line of light towards a rising sun between two towers. The picture is still and dark, yet the water’s path leads to morning.',
    roles: {
      light: 'Your ability to say goodbye when something is over gives you footing.',
      shadow: 'Something past may be tying up more strength than you admit to yourself.',
      root: 'An earlier farewell has not been fully told yet. It may be mourned and honoured.',
      possibility: 'Where something ends, room could open for something you cannot imagine yet.',
      bridge: 'The Death card joins ending and beginning. Between the two lies a quiet passage.',
    },
    study: [
      'A white rose blooms brightly before the dark valley, and far behind, at the end of the river, the sun is rising. A farewell and a beginning share one picture. Which of them draws your eye first?',
      'Write down what in your life has come to an end or would like to. Next to it, note what you are grateful it gave you. What could grow in the space this sets free?',
    ],
    question: 'Which farewell have I not yet honoured?',
    reflections: ['What may come to an end today?', 'Which memory do I want to keep as I let the old go?'],
    ritual: 'Put away one thing you no longer need, and silently thank it before you set it aside.',
  },
  'major-14-temperance': {
    light:
      'Temperance finds the right measure between too much and too little. It blends what seems separate with patience and a steady hand. In its light, balance becomes an art you can practise.',
    shadow:
      'Always wanting to balance things out can cost you your own stance. Then the middle becomes a compromise that does justice to no one, least of all you. Where are you watering down what could simply be clear?',
    keyword: 'Moderation, for Temperance, is not going without but finding the blend that does you good right now. It is not found once but tuned again and again.',
    symbols:
      'Two golden cups, one above the other, are joined by a clear arc of water. Irises bloom by the pond, and a path leads through green meadows to distant mountains in the morning light. Nothing is lost in the pouring: the water flows calmly from one shape into the next.',
    roles: {
      light: 'Your sense of the right measure helps you keep your balance even in full times.',
      shadow: 'You might be looking for a middle way where a clear decision would be easier.',
      root: 'A time when you had too much or too little still shapes your feeling for measure.',
      possibility: 'From two things that do not seem to fit, something new could emerge.',
      bridge: 'Temperance joins opposites by blending them patiently. Neither has to disappear.',
    },
    study: [
      'One cup pours water into a second, with no hand holding it. The arc of water is calm and unbroken. What in your life would like to flow just as slowly and steadily from one state into another?',
      'Look at an ordinary week in your life: work, rest, people, time for yourself. Where is there too much, and where too little? Which small shift would make the blend feel more right?',
    ],
    question: 'Which two sides of me want to work with each other instead of against each other?',
    reflections: ['What could I take a little less of today, and what a little more?', 'What brings me back to my centre?'],
    ritual: 'Do one thing today at half your usual speed, such as getting dressed or washing up, and notice how the pace feels.',
  },
};

export const texts: TextTable = deepTable(cards);
