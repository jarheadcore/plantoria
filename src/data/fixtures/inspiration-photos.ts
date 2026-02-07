export interface InspirationPhoto {
  id: string
  url: string
  source: 'pexels' | 'unsplash' | 'pixabay'
  photographer?: string
  description: string
  activity: InspirationActivity
}

export type InspirationActivity =
  | 'planting'
  | 'watering'
  | 'exploring'
  | 'harvesting'
  | 'collaborative'
  | 'raised-bed'
  | 'composting'
  | 'family'

export const fixtureInspirationPhotos: InspirationPhoto[] = [
  // ── Pexels ────────────────────────────────────────────
  {
    id: 'pexels-7782160',
    url: 'https://www.pexels.com/photo/a-kid-planting-seeds-on-the-ground-7782160/',
    source: 'pexels',
    photographer: 'RDNE Stock project',
    description: 'Kind kniet am Boden und pflanzt Samen in die Erde',
    activity: 'planting',
  },
  {
    id: 'pexels-7782192',
    url: 'https://www.pexels.com/photo/a-kid-planting-seeds-on-the-ground-soil-7782192/',
    source: 'pexels',
    photographer: 'RDNE Stock project',
    description: 'Kind und Erwachsener pflanzen gemeinsam Samen',
    activity: 'family',
  },
  {
    id: 'pexels-7342639',
    url: 'https://www.pexels.com/photo/a-girl-watering-the-plants-7342639/',
    source: 'pexels',
    photographer: 'Antoni Shkraba',
    description: 'Mädchen giesst Pflanzen mit einer Giesskanne',
    activity: 'watering',
  },
  {
    id: 'pexels-7342638',
    url: 'https://www.pexels.com/photo/a-girl-watering-a-plant-7342638/',
    source: 'pexels',
    photographer: 'Antoni Shkraba',
    description: 'Mädchen giesst sorgfältig eine einzelne Pflanze',
    activity: 'watering',
  },
  {
    id: 'pexels-5997587',
    url: 'https://www.pexels.com/photo/a-young-girl-watering-a-plants-5997587/',
    source: 'pexels',
    photographer: 'Polesie Toys',
    description: 'Junges Mädchen beim Giessen mit bunten Gartenwerkzeugen',
    activity: 'watering',
  },
  {
    id: 'pexels-4750260',
    url: 'https://www.pexels.com/photo/a-girl-watering-the-plants-4750260/',
    source: 'pexels',
    photographer: 'Cottonbro Studio',
    description: 'Mädchen giesst grüne Pflanzen im Garten',
    activity: 'watering',
  },
  {
    id: 'pexels-9870434',
    url: 'https://www.pexels.com/photo/kids-carrying-watering-cans-9870434/',
    source: 'pexels',
    photographer: 'Nasirun Khan',
    description: 'Kinder tragen fröhlich Giesskannen zusammen',
    activity: 'collaborative',
  },
  {
    id: 'pexels-5063002',
    url: 'https://www.pexels.com/photo/diverse-girls-taking-care-of-plants-5063002/',
    source: 'pexels',
    photographer: 'Monstera Production',
    description: 'Verschiedene Mädchen pflegen gemeinsam Topfpflanzen',
    activity: 'collaborative',
  },
  {
    id: 'pexels-11130997',
    url: 'https://www.pexels.com/photo/young-boys-planting-a-tree-on-brown-soil-11130997/',
    source: 'pexels',
    photographer: 'Leiliane Dutra',
    description: 'Zwei Jungen pflanzen gemeinsam einen Baum',
    activity: 'planting',
  },
  {
    id: 'pexels-18991334',
    url: 'https://www.pexels.com/photo/girl-playing-with-garden-toys-18991334/',
    source: 'pexels',
    photographer: 'Polesie Toys',
    description: 'Mädchen spielt mit bunten Gartenwerkzeugen im Garten',
    activity: 'exploring',
  },
  {
    id: 'pexels-5624245',
    url: 'https://www.pexels.com/photo/amazed-little-boy-touching-plants-while-standing-in-garden-with-sister-5624245/',
    source: 'pexels',
    photographer: 'Allan Mas',
    description: 'Geschwister erkunden staunend Pflanzen im Garten',
    activity: 'exploring',
  },
  {
    id: 'pexels-17164683',
    url: 'https://www.pexels.com/photo/boy-picking-withered-flowers-in-autumn-garden-17164683/',
    source: 'pexels',
    photographer: 'Tatiana Syrikova',
    description: 'Junge pflückt Blumen im Herbstgarten',
    activity: 'harvesting',
  },
  {
    id: 'pexels-5354550',
    url: 'https://www.pexels.com/photo/mother-with-little-son-walking-in-garden-5354550/',
    source: 'pexels',
    photographer: 'Allan Mas',
    description: 'Mutter führt Kleinkind durch den sonnigen Garten',
    activity: 'family',
  },

  // ── Unsplash ──────────────────────────────────────────
  {
    id: 'unsplash-9y0rLay0CU4',
    url: 'https://unsplash.com/photos/a-young-boy-watering-plants-in-a-garden-9y0rLay0CU4',
    source: 'unsplash',
    photographer: 'Diana Light',
    description: 'Junge giesst Pflanzen im Garten',
    activity: 'watering',
  },
  {
    id: 'unsplash-hRepuL1ryys',
    url: 'https://unsplash.com/photos/a-woman-is-helping-a-child-to-plant-a-plant-hRepuL1ryys',
    source: 'unsplash',
    photographer: 'Nadia Clabassi',
    description: 'Frau hilft Kind beim Einpflanzen eines Setzlings',
    activity: 'family',
  },
  {
    id: 'unsplash-cEnEfAW1l2w',
    url: 'https://unsplash.com/photos/a-little-boy-standing-next-to-a-potted-plant-cEnEfAW1l2w',
    source: 'unsplash',
    photographer: 'Samantha Fortney',
    description: 'Kleiner Junge neben einer Topfpflanze',
    activity: 'exploring',
  },
  {
    id: 'unsplash-evsO5NsynMk',
    url: 'https://unsplash.com/photos/playful-little-boy-helping-his-father-to-plant-the-tree-while-working-together-in-the-garden-evsO5NsynMk',
    source: 'unsplash',
    description: 'Verspielter Junge hilft seinem Vater beim Baumpflanzen',
    activity: 'family',
  },
  {
    id: 'unsplash-t2ODooWyQWI',
    url: 'https://unsplash.com/photos/child-surrounded-by-plants-t2ODooWyQWI',
    source: 'unsplash',
    photographer: 'Liana Mikah',
    description: 'Kind umgeben von üppigen grünen Pflanzen',
    activity: 'exploring',
  },
  {
    id: 'unsplash-GUvav_7bKsQ',
    url: 'https://unsplash.com/photos/GUvav_7bKsQ',
    source: 'unsplash',
    photographer: 'Kande Bonfim',
    description: 'Kindergruppe am Gartenschlauch beim Spielen',
    activity: 'collaborative',
  },
  {
    id: 'unsplash-cdfv65CldQQ',
    url: 'https://unsplash.com/photos/boy-in-blue-and-white-checkered-button-up-shirt-holding-green-plant-cdfv65CldQQ',
    source: 'unsplash',
    description: 'Junge hält grüne Pflanze im Hochbeet',
    activity: 'raised-bed',
  },
  {
    id: 'unsplash-TF5U-7bjLwU',
    url: 'https://unsplash.com/photos/TF5U-7bjLwU',
    source: 'unsplash',
    description: 'Junge pflanzt Gemüse im Hochbeet mit Handschuhen',
    activity: 'raised-bed',
  },
  {
    id: 'unsplash-LOCYhBKrPM0',
    url: 'https://unsplash.com/photos/a-couple-of-girls-cleaning-the-ground-LOCYhBKrPM0',
    source: 'unsplash',
    description: 'Mädchen pflegen den Gemüsegarten',
    activity: 'harvesting',
  },
  {
    id: 'unsplash-9gUVNzHKBG4',
    url: 'https://unsplash.com/photos/a-person-holding-a-small-plant-in-their-hands-9gUVNzHKBG4',
    source: 'unsplash',
    photographer: 'Jennifer Delmarre',
    description: 'Hände halten behutsam einen kleinen Setzling',
    activity: 'planting',
  },

  // ── Pixabay ───────────────────────────────────────────
  {
    id: 'pixabay-559407',
    url: 'https://pixabay.com/photos/child-kid-garden-watering-flower-559407/',
    source: 'pixabay',
    description: 'Kind giesst Blumen mit kleiner Giesskanne',
    activity: 'watering',
  },
  {
    id: 'pixabay-3335400',
    url: 'https://pixabay.com/photos/tree-watering-child-planting-3335400/',
    source: 'pixabay',
    description: 'Kind giesst einen frisch gepflanzten Baum',
    activity: 'watering',
  },
  {
    id: 'pixabay-1898946',
    url: 'https://pixabay.com/photos/planting-environment-nature-botany-1898946/',
    source: 'pixabay',
    description: 'Hände pflanzen einen Setzling in die Erde',
    activity: 'planting',
  },
]
