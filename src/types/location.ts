export type CityOption = {
  value: string;
  label: string;
};

export type StateOption = {
  value: string;
  label: string;
  cities: CityOption[];
};

export type CountryOption = {
  value: string;
  label: string;
  states: StateOption[];
};
