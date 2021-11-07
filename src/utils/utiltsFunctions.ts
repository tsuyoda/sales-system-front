/* eslint-disable no-plusplus */
export function formatDoc(doc: string, type: string) {
  const initialDoc = doc.replace(/[^\d]/g, '');

  if (type === 'f') return initialDoc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  console.log(initialDoc.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5'));
  return initialDoc.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export function formatTel(tel: string) {
  const initialDoc = tel.replace(/[^\d]/g, '');

  return initialDoc.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
}

export function validateCpf(doc: string): boolean {
  const cpf = doc.replace(/[^\d]+/g, '');

  if (cpf.length !== 11) return false;

  if (
    [
      '00000000000',
      '11111111111',
      '22222222222',
      '33333333333',
      '44444444444',
      '55555555555',
      '66666666666',
      '77777777777',
      '88888888888',
      '99999999999'
    ].includes(cpf)
  ) {
    return false;
  }

  const cpfDigits = cpf.split('').map(Number).slice(0, 9);
  const cpfValidators = cpf.split('').map(Number).slice(9, 11);

  const validator = (digits: number[], initialMult: number) => {
    let mult = initialMult;

    let validatorDigit = (digits.map(d => d * mult--).reduce((a, b) => a + b) * 10) % 11;

    if ([10, 11].includes(validatorDigit)) {
      validatorDigit = 0;
    }

    return [10, 11].includes(validatorDigit) ? 0 : validatorDigit;
  };

  const firstDigit = validator(cpfDigits, 10);

  if (firstDigit !== cpfValidators[0]) {
    return false;
  }

  cpfDigits.push(firstDigit);

  const secondDigit = validator(cpfDigits, 11);

  if (secondDigit !== cpfValidators[1]) {
    return false;
  }

  return true;
}

export function validateCnpj(doc: string): boolean {
  const cnpj = doc.replace(/[^\d]+/g, '');

  if (cnpj.length !== 14) return false;

  // Elimina CNPJs invalidos conhecidos
  if (
    [
      '00000000000000',
      '11111111111111',
      '22222222222222',
      '33333333333333',
      '44444444444444',
      '55555555555555',
      '66666666666666',
      '77777777777777',
      '88888888888888',
      '99999999999999'
    ].includes(cnpj)
  )
    return false;

  const cnpjDigits = cnpj.split('').map(Number).slice(0, 12);
  const cnpjValidators = cnpj.split('').map(Number).slice(12, 14);

  const validator = (digits: number[], initialMult: number) => {
    let mult = initialMult;

    let validatorDigit =
      11 -
      (digits
        .map(d => {
          const multiplication = d * mult--;

          if (mult === 1) {
            mult = 9;
          }

          return multiplication;
        })
        .reduce((a, b) => a + b) %
        11);

    if ([10, 11].includes(validatorDigit)) {
      validatorDigit = 0;
    }

    return [10, 11].includes(validatorDigit) ? 0 : validatorDigit;
  };

  const firstDigit = validator(cnpjDigits, 5);

  if (firstDigit !== cnpjValidators[0]) {
    return false;
  }

  cnpjDigits.push(firstDigit);

  const secondDigit = validator(cnpjDigits, 6);

  if (secondDigit !== cnpjValidators[1]) {
    return false;
  }

  return true;
}
