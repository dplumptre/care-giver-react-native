import Segment from "../models/segment";

export const SEGMENTS =[
    new Segment('s1', 'Personalised Home Setup', 'home','#522E2E','HomeSetupModule'),
    new Segment('s2', 'Learning Hub', 'graduation-cap','#522E2E','LearningHub'),
    new Segment('s3', 'Medical Tracker', 'first-aid','#522E2E','MedicationModule'),
    new Segment('s4', 'Excercises', 'running','#522E2E','ExerciseModule'),
];


export const EXERCISE_SEGMENTS =[
    new Segment('PATIENT_EXERCISE_SUPPORT', 'Patient', 'user-injured','#522E2E','ExerciseList'),
    new Segment('CARER_EXERCISE', 'Carers', 'user-nurse','#522E2E','ExerciseList'),
];

