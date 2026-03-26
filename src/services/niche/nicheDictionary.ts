type NicheDictionaryEntry = {
  aliases: string[];
  relatedTerms: string[];
};

export const nicheDictionary: Record<string, NicheDictionaryEntry> = {
  contabilidade: {
    aliases: ["contabilidade", "contabil", "contábil", "contador", "contadores"],
    relatedTerms: [
      "escritorio contabil",
      "escritorio de contabilidade",
      "servicos contabeis",
      "assessoria contabil",
      "consultoria contabil",
      "consultoria tributaria",
      "assessoria fiscal",
      "bpo financeiro",
      "terceirizacao financeira",
      "planejamento tributario"
    ]
  }
};
