export interface IPerson {
  fullName: string;
  doc: {
    id: string;
    type: 'F' | 'J';
  };
  contact: {
    email: string;
    tel: string;
  };
  address: {
    street: string;
    number: number;
    complement?: string;
    city: string;
    state: string;
    postalCode: string;
  };
}
