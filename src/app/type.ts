export type Subtema = {
  id: number;
  nombre: string;
  descripcion?: string;
};

export type tema = {
  id: number;
  nombre: string;
  descripcion: string;
  slug: string;
  subtemas: Subtema[];
};
