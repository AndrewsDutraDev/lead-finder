import type { CountryOption } from "@/types/location";
import { BRAZIL_COUNTRY_CODE, BRAZIL_COUNTRY_LABEL } from "@/lib/constants";

export const brazilLocations: CountryOption = {
  value: BRAZIL_COUNTRY_CODE,
  label: BRAZIL_COUNTRY_LABEL,
  states: [
    { value: "AC", label: "Acre", cities: [{ value: "Rio Branco", label: "Rio Branco" }, { value: "Cruzeiro do Sul", label: "Cruzeiro do Sul" }, { value: "Sena Madureira", label: "Sena Madureira" }] },
    { value: "AL", label: "Alagoas", cities: [{ value: "Maceió", label: "Maceió" }, { value: "Arapiraca", label: "Arapiraca" }, { value: "Palmeira dos Índios", label: "Palmeira dos Índios" }] },
    { value: "AP", label: "Amapá", cities: [{ value: "Macapá", label: "Macapá" }, { value: "Santana", label: "Santana" }, { value: "Laranjal do Jari", label: "Laranjal do Jari" }] },
    { value: "AM", label: "Amazonas", cities: [{ value: "Manaus", label: "Manaus" }, { value: "Parintins", label: "Parintins" }, { value: "Itacoatiara", label: "Itacoatiara" }] },
    { value: "BA", label: "Bahia", cities: [{ value: "Salvador", label: "Salvador" }, { value: "Feira de Santana", label: "Feira de Santana" }, { value: "Vitória da Conquista", label: "Vitória da Conquista" }, { value: "Camaçari", label: "Camaçari" }] },
    { value: "CE", label: "Ceará", cities: [{ value: "Fortaleza", label: "Fortaleza" }, { value: "Caucaia", label: "Caucaia" }, { value: "Juazeiro do Norte", label: "Juazeiro do Norte" }] },
    { value: "DF", label: "Distrito Federal", cities: [{ value: "Brasília", label: "Brasília" }, { value: "Taguatinga", label: "Taguatinga" }, { value: "Ceilândia", label: "Ceilândia" }] },
    { value: "ES", label: "Espírito Santo", cities: [{ value: "Vitória", label: "Vitória" }, { value: "Vila Velha", label: "Vila Velha" }, { value: "Serra", label: "Serra" }] },
    { value: "GO", label: "Goiás", cities: [{ value: "Goiânia", label: "Goiânia" }, { value: "Aparecida de Goiânia", label: "Aparecida de Goiânia" }, { value: "Anápolis", label: "Anápolis" }] },
    { value: "MA", label: "Maranhão", cities: [{ value: "São Luís", label: "São Luís" }, { value: "Imperatriz", label: "Imperatriz" }, { value: "Caxias", label: "Caxias" }] },
    { value: "MT", label: "Mato Grosso", cities: [{ value: "Cuiabá", label: "Cuiabá" }, { value: "Várzea Grande", label: "Várzea Grande" }, { value: "Rondonópolis", label: "Rondonópolis" }] },
    { value: "MS", label: "Mato Grosso do Sul", cities: [{ value: "Campo Grande", label: "Campo Grande" }, { value: "Dourados", label: "Dourados" }, { value: "Três Lagoas", label: "Três Lagoas" }] },
    { value: "MG", label: "Minas Gerais", cities: [{ value: "Belo Horizonte", label: "Belo Horizonte" }, { value: "Uberlândia", label: "Uberlândia" }, { value: "Contagem", label: "Contagem" }, { value: "Juiz de Fora", label: "Juiz de Fora" }] },
    { value: "PA", label: "Pará", cities: [{ value: "Belém", label: "Belém" }, { value: "Ananindeua", label: "Ananindeua" }, { value: "Santarém", label: "Santarém" }] },
    { value: "PB", label: "Paraíba", cities: [{ value: "João Pessoa", label: "João Pessoa" }, { value: "Campina Grande", label: "Campina Grande" }, { value: "Patos", label: "Patos" }] },
    { value: "PR", label: "Paraná", cities: [{ value: "Curitiba", label: "Curitiba" }, { value: "Londrina", label: "Londrina" }, { value: "Maringá", label: "Maringá" }, { value: "Cascavel", label: "Cascavel" }] },
    { value: "PE", label: "Pernambuco", cities: [{ value: "Recife", label: "Recife" }, { value: "Jaboatão dos Guararapes", label: "Jaboatão dos Guararapes" }, { value: "Caruaru", label: "Caruaru" }] },
    { value: "PI", label: "Piauí", cities: [{ value: "Teresina", label: "Teresina" }, { value: "Parnaíba", label: "Parnaíba" }, { value: "Picos", label: "Picos" }] },
    { value: "RJ", label: "Rio de Janeiro", cities: [{ value: "Rio de Janeiro", label: "Rio de Janeiro" }, { value: "Niterói", label: "Niterói" }, { value: "Duque de Caxias", label: "Duque de Caxias" }, { value: "Nova Iguaçu", label: "Nova Iguaçu" }] },
    { value: "RN", label: "Rio Grande do Norte", cities: [{ value: "Natal", label: "Natal" }, { value: "Mossoró", label: "Mossoró" }, { value: "Parnamirim", label: "Parnamirim" }] },
    { value: "RS", label: "Rio Grande do Sul", cities: [{ value: "Porto Alegre", label: "Porto Alegre" }, { value: "Caxias do Sul", label: "Caxias do Sul" }, { value: "Pelotas", label: "Pelotas" }, { value: "Canoas", label: "Canoas" }] },
    { value: "RO", label: "Rondônia", cities: [{ value: "Porto Velho", label: "Porto Velho" }, { value: "Ji-Paraná", label: "Ji-Paraná" }, { value: "Ariquemes", label: "Ariquemes" }] },
    { value: "RR", label: "Roraima", cities: [{ value: "Boa Vista", label: "Boa Vista" }, { value: "Rorainópolis", label: "Rorainópolis" }, { value: "Caracaraí", label: "Caracaraí" }] },
    { value: "SC", label: "Santa Catarina", cities: [{ value: "Florianópolis", label: "Florianópolis" }, { value: "Joinville", label: "Joinville" }, { value: "Blumenau", label: "Blumenau" }, { value: "Chapecó", label: "Chapecó" }] },
    { value: "SP", label: "São Paulo", cities: [{ value: "São Paulo", label: "São Paulo" }, { value: "Campinas", label: "Campinas" }, { value: "Santos", label: "Santos" }, { value: "Ribeirão Preto", label: "Ribeirão Preto" }, { value: "São José dos Campos", label: "São José dos Campos" }] },
    { value: "SE", label: "Sergipe", cities: [{ value: "Aracaju", label: "Aracaju" }, { value: "Nossa Senhora do Socorro", label: "Nossa Senhora do Socorro" }, { value: "Lagarto", label: "Lagarto" }] },
    { value: "TO", label: "Tocantins", cities: [{ value: "Palmas", label: "Palmas" }, { value: "Araguaína", label: "Araguaína" }, { value: "Gurupi", label: "Gurupi" }] }
  ]
};
