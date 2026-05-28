export interface Transmission {
  id: string;
  slug: string;
  title: string;
  date: string;           // ISO 8601: "2020-03-17"
  transmissionId: string; // "TX-001"
  excerpt: string;
  body: string;           // paragraphs separated by \n\n
}

export const transmissions: Transmission[] = [
  {
    id: 'tx-001',
    slug: 'the-stillness-and-the-signal',
    title: 'The Stillness & The Signal',
    date: '2020-03-17',
    transmissionId: 'TX-001',
    excerpt:
      'It began in 2020, in Harlem, during the great stillness. The world had stopped — or something close to it. And in that quiet, something else got loud.',
    body:
      'It began in 2020, in Harlem, during the great stillness. The world had stopped — or something close to it. Streets that never slept went quiet. And in that quiet, something else got loud. The walls of an apartment became the walls of a studio became the walls of a ritual chamber. There was time, suddenly, terrifyingly, to listen.\n\nDemos were built from nothing and sent into the ether — rough transmissions to Tony, the voice. He received them. He heard something in them. He sang back. That exchange, that signal passing through the locked-down city like a frequency that didn\'t need the streets, was the first working of the Wave.\n\nThen came the sampled world. At 7pm every night, New York did something it almost never did: it stopped and it made noise together. People leaned from windows and beat pots and shouted into the sky — a collective prayer for the nurses and doctors holding the threshold between the living and the dead. That sound was recorded. It went into the music. The neighborhood\'s grief and gratitude became part of the body of the work.',
  },
  {
    id: 'tx-002',
    slug: 'on-the-wave',
    title: 'On the Wave',
    date: '2020-09-04',
    transmissionId: 'TX-002',
    excerpt:
      'The Wave is not sound. The Wave is what sound leaves behind — the resonance in a room after the last note dies. Exit-Wave exists in that space.',
    body:
      'The Wave is not sound. The Wave is what sound leaves behind — the resonance in a room after the last note dies. Exit-Wave exists in that space. We channel it, ride it, sometimes drown in it.\n\nThere are frequencies that exist at the edge of hearing — not quite audible, but felt. The body registers them before the mind does. Aaron\'s modular synthesizer speaks in this language. It is not an instrument so much as an entity. He is its interpreter, not its master.\n\nTo record is to fix a moment that was, by nature, passing. The drum track is captured and then fractured — resampled, rebuilt into something that has been alive and is now something else, something stranger. Thom\'s rhythms live inside the music in forms he may not recognize. That estrangement is intentional. The Wave takes what it needs.',
  },
  {
    id: 'tx-003',
    slug: 'the-coalescing',
    title: 'The Coalescing',
    date: '2021-02-11',
    transmissionId: 'TX-003',
    excerpt:
      'Exit-Wave was never formed. It coalesced — the way a storm coalesces, the way a coven finds itself, the way a frequency that has always existed finally finds its receivers.',
    body:
      'Exit-Wave was never formed. It coalesced — the way a storm coalesces, the way a coven finds itself, the way a frequency that has always existed finally finds its receivers.\n\nThe circle widened slowly. Aaron arrived with his modular synth — a machine that thinks in electricity and speaks in frequencies that exist at the edge of hearing. John came with the bass, the low end, the gravitational pull that keeps the other sounds from drifting into pure abstraction. Chris received the transmissions and made them listenable — not by taming them, but by understanding what they were trying to become.\n\nWe are space druids — but not the kind that tend sacred groves on forest moons. We are the witchier kind. The ones who were cast out, who left, who chose the void. The exit is not an ending — it is a rite of passage. A frequency. A door that only opens from one side.',
  },
];
