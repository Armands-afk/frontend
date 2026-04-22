// Modelis kas man paradis to pasu backend modeli..
export interface EventDTO {
  id?: number;
  nosaukums: string;
  apraksts: string;
  datums: string;      // ISO date string e.g. '2026-05-10'
  laiks: string;       // Time string e.g. '18:00'
  vieta: string;
  maxDalibnieki: number;
  organizatorId?: number;
  pieteikumuSkaits: number; // current registration count from backend
}

// Sis man bus prieks izeidot pasakumu un paaaaaaaaareizu secibu!
export interface NewEventModel {
  nosaukums: string;
  apraksts: string;
  datums: string;
  laiks: string;
  vieta: string;
  maxDalibnieki: number; // Šis būs jāparāda formā
}
