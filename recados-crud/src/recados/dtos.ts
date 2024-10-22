export type RecadoDto = {
  id: number;
  text: string;
  from: string;
  to: string;
  read: boolean;
  createdAt: Date;
};

export type FindAllQuery = {
  size: string;
  page: string;
  q: string;
};
