import VMasker from 'vanilla-masker';

export const telefone = value => value && VMasker.toPattern(value, '(99) 9999-9999');
export const celular = value => {
  if (!value) return '';
  if (value.length > 14) {
    return VMasker.toPattern(value, '(99) 99999-9999');
  } else {
    return VMasker.toPattern(value, '(99) 9999-9999');
  }

}
export const cpf = value => value && VMasker.toPattern(value, '999.999.999-99');
export const cnpjNormalizer = value => value && VMasker.toPattern(value, '9999.9999.9999.9999');
