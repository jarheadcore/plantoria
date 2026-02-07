import type { DiaryEntry } from '@/types'

// Tagebuch-Aufgaben (synced with project tasks from tasks.ts where applicable)
// These represent field diary entries for the Gemüsefläche project (proj-1)

export const fixtureDiaryTasks = [
  {
    id: 'diary-task-1',
    projectId: 'proj-1',
    taskId: 't-5',
    title: 'Boden vorbereiten',
    knowledgeFacts: [
      {
        title: 'Bodenvorbereitung',
        text: 'Lockere den Boden 20–30 cm tief. Entferne Wurzeln und Steine. Mische Kompost unter (ca. 3 Liter pro m²).',
      },
      {
        title: 'Warum ist lockerer Boden wichtig?',
        text: 'Lockerer Boden lässt Wurzeln besser wachsen und speichert Wasser gleichmässiger.',
      },
    ],
  },
  {
    id: 'diary-task-2',
    projectId: 'proj-1',
    taskId: 't-6',
    title: 'Säen nach Beetplan',
    knowledgeFacts: [
      {
        title: 'Wichtigste Punkte beim Säen',
        text: 'Saattiefe beachten (Faustregel: 2× so tief wie der Samen gross ist). Reihenabstand einhalten. Nach dem Säen gut angiessen.',
      },
    ],
  },
  {
    id: 'diary-task-3',
    projectId: 'proj-1',
    taskId: 't-7',
    title: 'Setzlinge einpflanzen',
    knowledgeFacts: [
      {
        title: 'Wichtigste Punkte beim Pflanzen',
        text: 'Pflanzloch doppelt so gross wie der Wurzelballen. Setzling vorsichtig einsetzen, Erde andrücken, sofort giessen.',
      },
      {
        title: 'Bester Zeitpunkt',
        text: 'Pflanze am besten an einem bewölkten Tag oder abends, um Stress durch Hitze zu vermeiden.',
      },
    ],
  },
  {
    id: 'diary-task-4',
    projectId: 'proj-1',
    taskId: 't-12',
    title: 'Unkraut jäten (Woche 20)',
    knowledgeFacts: [
      {
        title: 'Unkraut erkennen',
        text: 'Jäte regelmässig, bevor das Unkraut Samen bildet. Kulturpflanzen stehen in Reihen – alles dazwischen ist meist Unkraut.',
      },
    ],
  },
  {
    id: 'diary-task-5',
    projectId: 'proj-1',
    taskId: 't-11',
    title: 'Giessplan erstellen',
    knowledgeFacts: [
      {
        title: 'Richtig giessen',
        text: 'Morgens giessen ist ideal. Direkt an den Wurzeln giessen, nicht über die Blätter. Lieber seltener, dafür gründlich.',
      },
    ],
  },
  {
    id: 'diary-task-6',
    projectId: 'proj-1',
    taskId: 't-13',
    title: 'Schädlinge beobachten',
    knowledgeFacts: [
      {
        title: 'Häufige Schädlinge',
        text: 'Blattläuse: Unterseite der Blätter prüfen. Schnecken: Schleimspuren am Morgen. Erdflöhe: Kleine Löcher in Blättern.',
      },
      {
        title: 'Biologischer Pflanzenschutz',
        text: 'Nützlinge fördern: Marienkäfer fressen Blattläuse. Schneckenkragen schützen junge Setzlinge.',
      },
    ],
  },
  {
    id: 'diary-task-7',
    projectId: 'proj-1',
    taskId: 't-14',
    title: 'Erntezeitpunkt bestimmen',
    knowledgeFacts: [
      {
        title: 'Wann ist die Ernte reif?',
        text: 'Rübli: Schultern schauen aus der Erde. Tomaten: Vollständig rot und leicht ablösbar. Salat: Vor der Blüte ernten.',
      },
    ],
  },
  {
    id: 'diary-task-8',
    projectId: 'proj-1',
    taskId: 't-15',
    title: 'Ernte dokumentieren und wiegen',
    knowledgeFacts: [
      {
        title: 'Erntedokumentation',
        text: 'Jede Ernte wiegen und notieren: Was, wieviel (kg), welches Beet. So lernt ihr, was gut gewachsen ist.',
      },
    ],
  },
]

export const fixtureDiaryEntries: DiaryEntry[] = [
  {
    id: 'diary-1',
    projectId: 'proj-1',
    taskId: 't-5',
    taskTitle: 'Boden vorbereiten',
    date: '2026-04-05',
    notes: 'Boden war ziemlich hart nach dem Winter. Wir haben ca. 25 cm tief umgegraben und 2 Schubkarren Kompost untergemischt. Der pH-Test zeigte 6.5 – ideal für Gemüse!',
    photos: [
      {
        id: 'photo-1',
        base64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzhCNjkxNCIvPjxyZWN0IHg9IjUwIiB5PSIyMDAiIHdpZHRoPSIzMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNjU0MzIxIi8+PHRleHQgeD0iMjAwIiB5PSIxNTAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj7wn4yxIEJvZGVuIHZvcmJlcmVpdGV0PC90ZXh0Pjwvc3ZnPg==',
        caption: 'Beet nach dem Umgraben',
        takenAt: '2026-04-05',
      },
    ],
    knowledgeFacts: [
      {
        title: 'Bodenvorbereitung',
        text: 'Lockere den Boden 20–30 cm tief. Entferne Wurzeln und Steine. Mische Kompost unter (ca. 3 Liter pro m²).',
      },
    ],
    completed: true,
  },
  {
    id: 'diary-2',
    projectId: 'proj-1',
    taskId: 't-6',
    taskTitle: 'Säen nach Beetplan',
    date: '2026-04-15',
    notes: 'Rübli und Radieschen direkt gesät. Reihenabstand 25 cm. Saattiefe ca. 1 cm. Danach alles gut angegossen. Die Kinder waren begeistert!',
    photos: [
      {
        id: 'photo-2',
        base64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzRhOGYyOSIvPjxsaW5lIHgxPSI1MCIgeTE9IjEwMCIgeDI9IjM1MCIgeTI9IjEwMCIgc3Ryb2tlPSIjNjU0MzIxIiBzdHJva2Utd2lkdGg9IjMiLz48bGluZSB4MT0iNTAiIHkxPSIxNTAiIHgyPSIzNTAiIHkyPSIxNTAiIHN0cm9rZT0iIzY1NDMyMSIgc3Ryb2tlLXdpZHRoPSIzIi8+PGxpbmUgeDE9IjUwIiB5MT0iMjAwIiB4Mj0iMzUwIiB5Mj0iMjAwIiBzdHJva2U9IiM2NTQzMjEiIHN0cm9rZS13aWR0aD0iMyIvPjx0ZXh0IHg9IjIwMCIgeT0iMjYwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjIwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+8J+MsSBTYWF0cmVpaGVuPC90ZXh0Pjwvc3ZnPg==',
        caption: 'Saatreihen im Beet',
        takenAt: '2026-04-15',
      },
    ],
    knowledgeFacts: [
      {
        title: 'Wichtigste Punkte beim Säen',
        text: 'Saattiefe beachten (Faustregel: 2× so tief wie der Samen gross ist). Reihenabstand einhalten. Nach dem Säen gut angiessen.',
      },
    ],
    completed: true,
  },
  {
    id: 'diary-3',
    projectId: 'proj-1',
    taskId: 't-9',
    taskTitle: 'Boden testen (pH-Wert)',
    date: '2026-04-10',
    notes: 'pH-Wert mit Teststreifen gemessen: 6.5 – perfekt für die meisten Gemüsearten. Die Gruppe Gänseblümchen hat die Ergebnisse tabellarisch festgehalten.',
    photos: [],
    knowledgeFacts: [
      {
        title: 'pH-Wert im Garten',
        text: 'Die meisten Gemüse bevorzugen einen pH von 6.0–7.0. Zu sauer? Kalk zugeben. Zu basisch? Kompost hilft.',
      },
    ],
    completed: true,
  },
]
