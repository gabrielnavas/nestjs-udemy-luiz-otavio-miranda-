export type RecadoDto = {
  id: Readonly<number>;
  text: Readonly<string>;
  from: Readonly<string>;
  to: Readonly<string>;
  read: Readonly<boolean>;
  createdAt: Readonly<Date>;
  updatedAt: Readonly<Date>;
};
