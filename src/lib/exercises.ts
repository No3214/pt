// ═══════════════ Exercise Database ═══════════════
export interface Exercise {
  name: string
  muscle: string
  equipment: string
  category: 'compound' | 'isolation' | 'cardio' | 'plyo' | 'mobility'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  youtubeId?: string
  description?: string
}

export const exercises: Exercise[] = [
  // ─── Alt Vücut (Compound) ───
  { name: 'Back Squat', muscle: 'Quadriceps', equipment: 'Barbell', category: 'compound', difficulty: 'intermediate', youtubeId: 'gcNh17Ckjgg' },
  { name: 'Front Squat', muscle: 'Quadriceps', equipment: 'Barbell', category: 'compound', difficulty: 'advanced', youtubeId: 'v-mQM_altUZu' },
  { name: 'Goblet Squat', muscle: 'Quadriceps', equipment: 'Dumbbell', category: 'compound', difficulty: 'beginner', youtubeId: 'MeIiIdhvXT4' },
  { name: 'Bulgarian Split Squat', muscle: 'Quadriceps', equipment: 'Dumbbell', category: 'compound', difficulty: 'intermediate', youtubeId: '2C-uNgKwPLE' },
  { name: 'Leg Press', muscle: 'Quadriceps', equipment: 'Machine', category: 'compound', difficulty: 'beginner', youtubeId: 'IZxyjW7MPJQ' },
  { name: 'Romanian Deadlift (RDL)', muscle: 'Hamstrings', equipment: 'Barbell', category: 'compound', difficulty: 'intermediate', youtubeId: 'jcV7KrC1sss' },
  { name: 'Conventional Deadlift', muscle: 'Hamstrings', equipment: 'Barbell', category: 'compound', difficulty: 'advanced', youtubeId: 'r4MzxtBKyNE' },
  { name: 'Sumo Deadlift', muscle: 'Hamstrings', equipment: 'Barbell', category: 'compound', difficulty: 'advanced', youtubeId: 'X0vCQuh9m2g' },
  { name: 'Hip Thrust', muscle: 'Glutes', equipment: 'Barbell', category: 'compound', difficulty: 'intermediate', youtubeId: 'LM8lE7arSQU' },
  { name: 'Glute Bridge', muscle: 'Glutes', equipment: 'Bodyweight', category: 'compound', difficulty: 'beginner', youtubeId: 'wPM8icPu6H8' },
  { name: 'Walking Lunge', muscle: 'Quadriceps', equipment: 'Dumbbell', category: 'compound', difficulty: 'beginner' },
  { name: 'Reverse Lunge', muscle: 'Quadriceps', equipment: 'Dumbbell', category: 'compound', difficulty: 'beginner' },
  { name: 'Step Up', muscle: 'Quadriceps', equipment: 'Dumbbell', category: 'compound', difficulty: 'beginner' },
  { name: 'Hack Squat', muscle: 'Quadriceps', equipment: 'Machine', category: 'compound', difficulty: 'intermediate' },
  { name: 'Trap Bar Deadlift', muscle: 'Hamstrings', equipment: 'Barbell', category: 'compound', difficulty: 'intermediate' },
  // ─── Alt Vücut (İzolasyon) ───
  { name: 'Leg Extension', muscle: 'Quadriceps', equipment: 'Machine', category: 'isolation', difficulty: 'beginner' },
  { name: 'Leg Curl (Lying)', muscle: 'Hamstrings', equipment: 'Machine', category: 'isolation', difficulty: 'beginner' },
  { name: 'Leg Curl (Seated)', muscle: 'Hamstrings', equipment: 'Machine', category: 'isolation', difficulty: 'beginner' },
  { name: 'Calf Raise (Standing)', muscle: 'Calves', equipment: 'Machine', category: 'isolation', difficulty: 'beginner' },
  { name: 'Calf Raise (Seated)', muscle: 'Calves', equipment: 'Machine', category: 'isolation', difficulty: 'beginner' },
  { name: 'Hip Abduction', muscle: 'Glutes', equipment: 'Machine', category: 'isolation', difficulty: 'beginner' },
  { name: 'Hip Adduction', muscle: 'Adductors', equipment: 'Machine', category: 'isolation', difficulty: 'beginner' },
  { name: 'Cable Kickback', muscle: 'Glutes', equipment: 'Cable', category: 'isolation', difficulty: 'beginner' },
  { name: 'Nordic Hamstring Curl', muscle: 'Hamstrings', equipment: 'Bodyweight', category: 'isolation', difficulty: 'advanced' },
  // ─── Üst Vücut Push ───
  { name: 'Bench Press', muscle: 'Chest', equipment: 'Barbell', category: 'compound', difficulty: 'intermediate', youtubeId: 'vcBig73ojpE' },
  { name: 'Incline Bench Press', muscle: 'Chest', equipment: 'Barbell', category: 'compound', difficulty: 'intermediate', youtubeId: 'SrqOu55lr6A' },
  { name: 'DB Bench Press', muscle: 'Chest', equipment: 'Dumbbell', category: 'compound', difficulty: 'beginner', youtubeId: 'vmO2Xm89vXk' },
  { name: 'DB Incline Press', muscle: 'Chest', equipment: 'Dumbbell', category: 'compound', difficulty: 'beginner', youtubeId: '8iPEnn-ltC8' },
  { name: 'Push Up', muscle: 'Chest', equipment: 'Bodyweight', category: 'compound', difficulty: 'beginner', youtubeId: 'IODxDxX7oi4' },
  { name: 'Overhead Press (OHP)', muscle: 'Shoulders', equipment: 'Barbell', category: 'compound', difficulty: 'intermediate', youtubeId: 'QAQ6niAPr94' },
  { name: 'DB Shoulder Press', muscle: 'Shoulders', equipment: 'Dumbbell', category: 'compound', difficulty: 'beginner' },
  { name: 'Arnold Press', muscle: 'Shoulders', equipment: 'Dumbbell', category: 'compound', difficulty: 'intermediate' },
  { name: 'Dips (Chest)', muscle: 'Chest', equipment: 'Bodyweight', category: 'compound', difficulty: 'intermediate' },
  { name: 'Chest Fly (DB)', muscle: 'Chest', equipment: 'Dumbbell', category: 'isolation', difficulty: 'beginner' },
  { name: 'Cable Fly', muscle: 'Chest', equipment: 'Cable', category: 'isolation', difficulty: 'beginner' },
  { name: 'Lateral Raise', muscle: 'Shoulders', equipment: 'Dumbbell', category: 'isolation', difficulty: 'beginner', youtubeId: 'cP0atnN9o6o' },
  { name: 'Front Raise', muscle: 'Shoulders', equipment: 'Dumbbell', category: 'isolation', difficulty: 'beginner', youtubeId: 'alRwd-S-O7c' },
  { name: 'Face Pull', muscle: 'Rear Delts', equipment: 'Cable', category: 'isolation', difficulty: 'beginner', youtubeId: 'rep-qVOkqgk' },
  { name: 'Tricep Pushdown', muscle: 'Triceps', equipment: 'Cable', category: 'isolation', difficulty: 'beginner', youtubeId: '2-LAMcpzHLU' },
  { name: 'Skull Crusher', muscle: 'Triceps', equipment: 'Barbell', category: 'isolation', difficulty: 'intermediate' },
  { name: 'Overhead Tricep Extension', muscle: 'Triceps', equipment: 'Dumbbell', category: 'isolation', difficulty: 'beginner' },
  // ─── Üst Vücut Pull ───
  { name: 'Barbell Row', muscle: 'Back', equipment: 'Barbell', category: 'compound', difficulty: 'intermediate' },
  { name: 'DB Row (Single Arm)', muscle: 'Back', equipment: 'Dumbbell', category: 'compound', difficulty: 'beginner' },
  { name: 'Pull Up', muscle: 'Back', equipment: 'Bodyweight', category: 'compound', difficulty: 'advanced' },
  { name: 'Chin Up', muscle: 'Back', equipment: 'Bodyweight', category: 'compound', difficulty: 'intermediate' },
  { name: 'Lat Pulldown', muscle: 'Back', equipment: 'Cable', category: 'compound', difficulty: 'beginner', youtubeId: 'CAwf7n6Luuc' },
  { name: 'Seated Cable Row', muscle: 'Back', equipment: 'Cable', category: 'compound', difficulty: 'beginner', youtubeId: 'GZbfZ033f74' },
  { name: 'T-Bar Row', muscle: 'Back', equipment: 'Barbell', category: 'compound', difficulty: 'intermediate', youtubeId: 'j3Igk5nyZE4' },
  { name: 'Pendlay Row', muscle: 'Back', equipment: 'Barbell', category: 'compound', difficulty: 'advanced', youtubeId: 'h4nZ6pUf9vY' },
  { name: 'Chest Supported Row', muscle: 'Back', equipment: 'Dumbbell', category: 'compound', difficulty: 'beginner' },
  { name: 'Bicep Curl (Barbell)', muscle: 'Biceps', equipment: 'Barbell', category: 'isolation', difficulty: 'beginner' },
  { name: 'Bicep Curl (DB)', muscle: 'Biceps', equipment: 'Dumbbell', category: 'isolation', difficulty: 'beginner' },
  { name: 'Hammer Curl', muscle: 'Biceps', equipment: 'Dumbbell', category: 'isolation', difficulty: 'beginner' },
  { name: 'Preacher Curl', muscle: 'Biceps', equipment: 'Barbell', category: 'isolation', difficulty: 'beginner' },
  { name: 'Cable Curl', muscle: 'Biceps', equipment: 'Cable', category: 'isolation', difficulty: 'beginner' },
  { name: 'Reverse Fly', muscle: 'Rear Delts', equipment: 'Dumbbell', category: 'isolation', difficulty: 'beginner' },
  { name: 'Shrug', muscle: 'Traps', equipment: 'Dumbbell', category: 'isolation', difficulty: 'beginner' },
  // ─── Core ───
  { name: 'Plank', muscle: 'Core', equipment: 'Bodyweight', category: 'isolation', difficulty: 'beginner' },
  { name: 'Side Plank', muscle: 'Obliques', equipment: 'Bodyweight', category: 'isolation', difficulty: 'beginner' },
  { name: 'Copenhagen Plank', muscle: 'Adductors', equipment: 'Bodyweight', category: 'isolation', difficulty: 'advanced' },
  { name: 'Ab Rollout', muscle: 'Core', equipment: 'Ab Wheel', category: 'isolation', difficulty: 'intermediate' },
  { name: 'Hanging Leg Raise', muscle: 'Core', equipment: 'Bar', category: 'isolation', difficulty: 'intermediate' },
  { name: 'Cable Woodchopper', muscle: 'Obliques', equipment: 'Cable', category: 'isolation', difficulty: 'beginner' },
  { name: 'Pallof Press', muscle: 'Core', equipment: 'Cable', category: 'isolation', difficulty: 'beginner' },
  { name: 'Dead Bug', muscle: 'Core', equipment: 'Bodyweight', category: 'isolation', difficulty: 'beginner' },
  { name: 'Bird Dog', muscle: 'Core', equipment: 'Bodyweight', category: 'isolation', difficulty: 'beginner' },
  { name: 'Russian Twist', muscle: 'Obliques', equipment: 'Bodyweight', category: 'isolation', difficulty: 'beginner' },
  { name: 'Crunch', muscle: 'Core', equipment: 'Bodyweight', category: 'isolation', difficulty: 'beginner' },
  { name: 'Bicycle Crunch', muscle: 'Core', equipment: 'Bodyweight', category: 'isolation', difficulty: 'beginner' },
  // ─── Pliometrik & Atletik ───
  { name: 'Box Jump', muscle: 'Quadriceps', equipment: 'Box', category: 'plyo', difficulty: 'intermediate' },
  { name: 'Depth Jump', muscle: 'Quadriceps', equipment: 'Box', category: 'plyo', difficulty: 'advanced' },
  { name: 'Broad Jump', muscle: 'Quadriceps', equipment: 'Bodyweight', category: 'plyo', difficulty: 'intermediate' },
  { name: 'Tuck Jump', muscle: 'Quadriceps', equipment: 'Bodyweight', category: 'plyo', difficulty: 'intermediate' },
  { name: 'Power Clean', muscle: 'Full Body', equipment: 'Barbell', category: 'plyo', difficulty: 'advanced' },
  { name: 'Hang Clean', muscle: 'Full Body', equipment: 'Barbell', category: 'plyo', difficulty: 'advanced' },
  { name: 'Med Ball Slam', muscle: 'Full Body', equipment: 'Med Ball', category: 'plyo', difficulty: 'beginner' },
  { name: 'Med Ball Throw', muscle: 'Core', equipment: 'Med Ball', category: 'plyo', difficulty: 'intermediate' },
  { name: 'Kettlebell Swing', muscle: 'Glutes', equipment: 'Kettlebell', category: 'plyo', difficulty: 'intermediate' },
  { name: 'Drop Freeze (İniş)', muscle: 'Quadriceps', equipment: 'Box', category: 'plyo', difficulty: 'intermediate' },
  { name: 'Lateral Bound', muscle: 'Glutes', equipment: 'Bodyweight', category: 'plyo', difficulty: 'intermediate' },
  { name: 'Single Leg Hop', muscle: 'Quadriceps', equipment: 'Bodyweight', category: 'plyo', difficulty: 'intermediate' },
  // ─── Mobilite & Düzeltici ───
  { name: 'T-Spine Rotation', muscle: 'Thoracic', equipment: 'Bodyweight', category: 'mobility', difficulty: 'beginner' },
  { name: 'Cat-Cow Stretch', muscle: 'Spine', equipment: 'Bodyweight', category: 'mobility', difficulty: 'beginner' },
  { name: 'Hip 90/90 Stretch', muscle: 'Hips', equipment: 'Bodyweight', category: 'mobility', difficulty: 'beginner' },
  { name: 'World\'s Greatest Stretch', muscle: 'Full Body', equipment: 'Bodyweight', category: 'mobility', difficulty: 'beginner' },
  { name: 'Banded Walks', muscle: 'Glutes', equipment: 'Band', category: 'mobility', difficulty: 'beginner' },
  { name: 'Clamshell', muscle: 'Glutes', equipment: 'Band', category: 'mobility', difficulty: 'beginner' },
  { name: 'Foam Roll (Quads)', muscle: 'Quadriceps', equipment: 'Foam Roller', category: 'mobility', difficulty: 'beginner' },
  { name: 'Foam Roll (IT Band)', muscle: 'IT Band', equipment: 'Foam Roller', category: 'mobility', difficulty: 'beginner' },
  { name: 'Ankle Mobility Drill', muscle: 'Ankle', equipment: 'Bodyweight', category: 'mobility', difficulty: 'beginner' },
  { name: 'Wall Slide', muscle: 'Shoulders', equipment: 'Bodyweight', category: 'mobility', difficulty: 'beginner' },
  // ─── Voleybol Spesifik ───
  { name: 'Approach Jump (Smaç Sıçrama)', muscle: 'Full Body', equipment: 'Bodyweight', category: 'plyo', difficulty: 'intermediate' },
  { name: 'Block Jump (Blok Sıçrama)', muscle: 'Calves', equipment: 'Bodyweight', category: 'plyo', difficulty: 'intermediate' },
  { name: 'Lateral Shuffle', muscle: 'Quadriceps', equipment: 'Bodyweight', category: 'plyo', difficulty: 'beginner' },
  { name: 'Reactive Agility Drill', muscle: 'Full Body', equipment: 'Cones', category: 'plyo', difficulty: 'intermediate' },
  { name: 'Landing Mechanics Drill', muscle: 'Quadriceps', equipment: 'Box', category: 'plyo', difficulty: 'intermediate' },
  { name: 'Rotator Cuff External Rotation', muscle: 'Shoulders', equipment: 'Band', category: 'mobility', difficulty: 'beginner' },
  { name: 'Scapular Push Up', muscle: 'Serratus', equipment: 'Bodyweight', category: 'mobility', difficulty: 'beginner' },
]

// ═══════════════ Muscle Groups ═══════════════
export const muscleGroups = [
  'Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Adductors',
  'Chest', 'Back', 'Shoulders', 'Rear Delts', 'Biceps', 'Triceps', 'Traps',
  'Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Adductors',
  'Chest', 'Back', 'Shoulders', 'Rear Delts', 'Biceps', 'Triceps', 'Traps',
  'Forearms', 'Abs', 'Obliques', 'Serratus', 'Lats', 'Erector Spinae'
];

export const equipment = [
  'Barbell', 'Dumbbell', 'Kettlebell', 'Band', 'Cable', 'Machine', 'Bodyweight', 'Box', 'Plate', 'Medicine Ball'
];

export const categories = [
  'strength', 'hypertrophy', 'power', 'conditioning', 'mobility', 'plyo', 'cardio', 'flexibility'
];

export const difficulties = ['beginner', 'intermediate', 'advanced'];

export const categoryLabels: Record<string, string> = {
  'compound': 'Compound',
  'isolation': 'Isolation',
  'cardio': 'Cardio',
  'plyo': 'Plyometric',
  'mobility': 'Mobility'
};

export const difficultyLabels: Record<string, string> = {
  'beginner': 'Beginner',
  'intermediate': 'Intermediate',
  'advanced': 'Advanced'
};
