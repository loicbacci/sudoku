export interface Square {
  value: number;
  notes: number[];
  solved: boolean;
}

export interface Grid {
  squares: Square[];
}

export {};
