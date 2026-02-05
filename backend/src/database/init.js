const { dbAsync, initTables } = require('./db');

const sampleQuestions = [
  // Emoji Questions
  {
    category: 'emoji',
    type: 'emoji',
    question: '🦁👑🌍',
    hint: 'Disney-Klassiker über einen jungen Löwen',
    answers: JSON.stringify(["Der König der Löwen", "Madagascar", "Ice Age", "Findet Nemo"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'emoji',
    type: 'emoji',
    question: '🚢❄️💑🎻',
    hint: 'Romantik-Drama auf einem sinkenden Schiff',
    answers: JSON.stringify(["Titanic", "Poseidon", "The Perfect Storm", "Pearl Harbor"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'emoji',
    type: 'emoji',
    question: '🕷️🕸️🦸‍♂️',
    hint: 'Marvel-Superheld aus New York',
    answers: JSON.stringify(["Spider-Man", "Batman", "Ant-Man", "Iron Man"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'emoji',
    type: 'emoji',
    question: '🧙‍♂️💍🌋🧝‍♂️',
    hint: 'Fantasy-Epos von J.R.R. Tolkien',
    answers: JSON.stringify(["Der Herr der Ringe", "Harry Potter", "The Hobbit", "Chroniken von Narnia"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'emoji',
    type: 'emoji',
    question: '🦕🦖🌴🚙',
    hint: 'Dinosaurier im Vergnügungspark',
    answers: JSON.stringify(["Jurassic Park", "Godzilla", "King Kong", "Die Reise zum Mittelpunkt der Erde"]),
    correct_index: 0,
    difficulty: 'medium'
  },
  {
    category: 'emoji',
    type: 'emoji',
    question: '👽🚲🌙📞',
    hint: 'Spielberg-Klassiker über einen außerirdischen Freund',
    answers: JSON.stringify(["E.T. - Der Außerirdische", "Close Encounters", "Alien", "Mars Attacks!"]),
    correct_index: 0,
    difficulty: 'medium'
  },
  {
    category: 'emoji',
    type: 'emoji',
    question: '🔫🤵‍♂️🍷💼',
    hint: 'Tarantinos legendärer Krimi',
    answers: JSON.stringify(["Pulp Fiction", "Reservoir Dogs", "Jackie Brown", "Kill Bill"]),
    correct_index: 0,
    difficulty: 'medium'
  },
  {
    category: 'emoji',
    type: 'emoji',
    question: '🦇🃏🦸‍♂️🌃',
    hint: 'Dunkler Ritter in Gotham City',
    answers: JSON.stringify(["The Dark Knight", "Batman Begins", "Joker", "Watchmen"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'emoji',
    type: 'emoji',
    question: '❄️👑👧⛄',
    hint: 'Disney-Animationsfilm über zwei Schwestern',
    answers: JSON.stringify(["Die Eiskönigin", "Brave", "Tangled", "Moana"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'emoji',
    type: 'emoji',
    question: '🎈🏠🐕🌿',
    hint: 'Pixar-Film über einen fliegenden Häuser',
    answers: JSON.stringify(["Oben", "WALL·E", "Ratatouille", "Findet Nemo"]),
    correct_index: 0,
    difficulty: 'medium'
  },
  {
    category: 'emoji',
    type: 'emoji',
    question: '🤠👩‍🚀🦖🧒',
    hint: 'Spielzeug, das lebendig wird',
    answers: JSON.stringify(["Toy Story", "Wreck-It Ralph", "The Lego Movie", "Small Soldiers"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'emoji',
    type: 'emoji',
    question: '🐀👨‍🍳🍝🇫🇷',
    hint: 'Ratte, die kochen kann',
    answers: JSON.stringify(["Ratatouille", "Flushed Away", "The Secret of NIMH", "Stuart Little"]),
    correct_index: 0,
    difficulty: 'medium'
  },
  // Quote Questions
  {
    category: 'quote',
    type: 'quote',
    question: '"Ich werde dir ein Angebot machen, das du nicht ablehnen kannst."',
    hint: "Mafia-Drama von 1972",
    answers: JSON.stringify(["Der Pate", "Goodfellas", "Scarface", "Casino"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'quote',
    type: 'quote',
    question: '"Hier ist Johnny!"',
    hint: "Horrorfilm nach Stephen King",
    answers: JSON.stringify(["Shining", "The Exorcist", "Psycho", "Halloween"]),
    correct_index: 0,
    difficulty: 'medium'
  },
  {
    category: 'quote',
    type: 'quote',
    question: '"May the Force be with you."',
    hint: "Science-Fiction Saga im Weltraum",
    answers: JSON.stringify(["Star Wars", "Star Trek", "Galaxy Quest", "Dune"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'quote',
    type: 'quote',
    question: '"Ich bin der König der Welt!"',
    hint: "1997 - Geschichte einer tragischen Liebe",
    answers: JSON.stringify(["Titanic", "The Great Gatsby", "Romeo + Julia", "Moulin Rouge"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'quote',
    type: 'quote',
    question: '"Wieso so ernst?"',
    hint: "Batman-Film mit Heath Ledger",
    answers: JSON.stringify(["The Dark Knight", "Batman Begins", "Joker", "Batman Forever"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'quote',
    type: 'quote',
    question: '"Hasta la vista, baby."',
    hint: "Arnold Schwarzenegger als Roboter",
    answers: JSON.stringify(["Terminator 2", "Commando", "Predator", "Total Recall"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'quote',
    type: 'quote',
    question: '"Life is like a box of chocolates."',
    hint: "Tom Hanks als liebenswerter Einfaltspinsel",
    answers: JSON.stringify(["Forrest Gump", "The Green Mile", "Philadelphia", "Cast Away"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'quote',
    type: 'quote',
    question: '"Ich sehe tote Menschen."',
    hint: "Übernatürlicher Thriller mit Bruce Willis",
    answers: JSON.stringify(["The Sixth Sense", "The Others", "Ghost", "The Frighteners"]),
    correct_index: 0,
    difficulty: 'medium'
  },
  {
    category: 'quote',
    type: 'quote',
    question: '"Just keep swimming."',
    hint: "Pixar-Film über einen vergesslichen Fisch",
    answers: JSON.stringify(["Findet Nemo", "Shark Tale", "Kleiner Hai", "Happy Feet"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'quote',
    type: 'quote',
    question: '"To infinity and beyond!"',
    hint: "Pixar-Film über sprechendes Spielzeug",
    answers: JSON.stringify(["Toy Story", "Wreck-It Ralph", "The Lego Movie", "Small Soldiers"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'quote',
    type: 'quote',
    question: '"Ich bin dein Vater."',
    hint: "Berühmte Enthüllung in einer Sci-Fi-Saga",
    answers: JSON.stringify(["Das Imperium schlägt zurück", "Star Wars", "Return of the Jedi", "Revenge of the Sith"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'quote',
    type: 'quote',
    question: '"Elementar, mein lieber Watson."',
    hint: "Berühmter Detektiv",
    answers: JSON.stringify(["Sherlock Holmes", "Hercule Poirot", "Miss Marple", "Philip Marlowe"]),
    correct_index: 0,
    difficulty: 'medium'
  },
  // Facts Questions
  {
    category: 'facts',
    type: 'facts',
    question: "Welcher Film gewann 2023 den Oscar für den besten Film?",
    hint: "Eine Komödie über eine alleinstehende Mutter",
    answers: JSON.stringify(["Everything Everywhere All at Once", "The Fabelmans", "Elvis", "Top Gun: Maverick"]),
    correct_index: 0,
    difficulty: 'hard'
  },
  {
    category: 'facts',
    type: 'facts',
    question: "Wer spielte die Hauptrolle in 'Forrest Gump'?",
    hint: "Zweifacher Oscar-Preisträger",
    answers: JSON.stringify(["Tom Hanks", "Tom Cruise", "Brad Pitt", "Leonardo DiCaprio"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'facts',
    type: 'facts',
    question: "Welcher Regisseur drehte 'Inception' und 'The Dark Knight'?",
    hint: "Bekannt für komplexe Erzählstrukturen",
    answers: JSON.stringify(["Christopher Nolan", "Steven Spielberg", "Martin Scorsese", "Quentin Tarantino"]),
    correct_index: 0,
    difficulty: 'medium'
  },
  {
    category: 'facts',
    type: 'facts',
    question: "Welcher Film ist der erfolgreichste aller Zeiten (Einspielergebnis)?",
    hint: "James Cameron Science-Fiction",
    answers: JSON.stringify(["Avatar", "Avengers: Endgame", "Titanic", "Star Wars: Das Erwachen der Macht"]),
    correct_index: 0,
    difficulty: 'medium'
  },
  {
    category: 'facts',
    type: 'facts',
    question: "Welcher Schauspieler verkörperte Iron Man im MCU?",
    hint: "Er hatte früher Drogenprobleme",
    answers: JSON.stringify(["Robert Downey Jr.", "Chris Evans", "Chris Hemsworth", "Mark Ruffalo"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'facts',
    type: 'facts',
    question: "In welchem Jahr wurde der erste 'Star Wars' Film veröffentlicht?",
    hint: "Die späten 70er Jahre",
    answers: JSON.stringify(["1977", "1975", "1980", "1983"]),
    correct_index: 0,
    difficulty: 'medium'
  },
  {
    category: 'facts',
    type: 'facts',
    question: "Welcher Animationsfilm war der erste von Pixar?",
    hint: "Spielzeug, das lebendig wird",
    answers: JSON.stringify(["Toy Story", "A Bug's Life", "Monsters, Inc.", "Findet Nemo"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'facts',
    type: 'facts',
    question: "Wie heißt der Zauberlehrling in Harry Potter?",
    hint: "Er hat eine Blitznarbe",
    answers: JSON.stringify(["Harry Potter", "Ron Weasley", "Hermine Granger", "Draco Malfoy"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'facts',
    type: 'facts',
    question: "Welcher Film gewann die meisten Oscars aller Zeiten?",
    hint: "Episches Drama über einen Sklaven in Rom",
    answers: JSON.stringify(["Ben Hur", "Titanic", "Der Herr der Ringe", "West Side Story"]),
    correct_index: 0,
    difficulty: 'hard'
  },
  {
    category: 'facts',
    type: 'facts',
    question: "Wer spielte Jack in 'Titanic'?",
    hint: "Er war auch in 'Inception'",
    answers: JSON.stringify(["Leonardo DiCaprio", "Brad Pitt", "Johnny Depp", "Tom Cruise"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'facts',
    type: 'facts',
    question: "Welcher Film hat den Oscar für den besten Animationsfilm 2024 gewonnen?",
    hint: "Hayao Miyazaki Film",
    answers: JSON.stringify(["Der Junge und der Reiher", "Spider-Man: Across the Spider-Verse", "Elemental", "Nimona"]),
    correct_index: 0,
    difficulty: 'hard'
  },
  {
    category: 'facts',
    type: 'facts',
    question: "Wie viele Filme gibt es in der originalen 'Star Wars' Trilogie?",
    hint: "Episoden IV, V und VI",
    answers: JSON.stringify(["3", "4", "5", "6"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'facts',
    type: 'facts',
    question: "Welcher Schauspieler spielte den Joker in 'The Dark Knight'?",
    hint: "Er verstarb tragischerweise vor Filmrelease",
    answers: JSON.stringify(["Heath Ledger", "Joaquin Phoenix", "Jared Leto", "Jack Nicholson"]),
    correct_index: 0,
    difficulty: 'medium'
  },
  {
    category: 'facts',
    type: 'facts',
    question: "In welchem Land spielt 'Der Herr der Ringe'?",
    hint: "Fiktives Land, nicht Neuseeland",
    answers: JSON.stringify(["Mittelerde", "Narnia", "Westeros", "Hogwarts"]),
    correct_index: 0,
    difficulty: 'easy'
  },
  {
    category: 'facts',
    type: 'facts',
    question: "Welcher Disney-Film basiert auf Hamlet?",
    hint: "Afrikanische Savanne",
    answers: JSON.stringify(["Der König der Löwen", "Bambi", "Das Dschungelbuch", "Robin Hood"]),
    correct_index: 0,
    difficulty: 'medium'
  }
];

async function initDatabase() {
  try {
    await initTables();
    
    // Check if questions already exist
    const existing = await dbAsync.get('SELECT COUNT(*) as count FROM questions');
    
    if (existing.count === 0) {
      console.log('📝 Inserting sample questions...');
      
      for (const q of sampleQuestions) {
        await dbAsync.run(
          `INSERT INTO questions (category, type, question, hint, answers, correct_index, difficulty) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [q.category, q.type, q.question, q.hint, q.answers, q.correct_index, q.difficulty]
        );
      }
      
      console.log(`✅ Inserted ${sampleQuestions.length} questions`);
    } else {
      console.log(`✅ Database already contains ${existing.count} questions`);
    }
    
    console.log('🎬 Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
