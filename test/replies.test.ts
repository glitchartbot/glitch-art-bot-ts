import { invalidValues } from '../src/util/replies';

test('retorna o motivo certo de erro', () => {
  const expected1 = `Invalid value for 'mode', this option accepts: 1, 2, 3`;
  const expected2 = `Invalid value for 'threshold', this option must be between these numbers: 0, 100`;

  expect(invalidValues('allowed', 'mode', [1, 2, 3])).toBe(expected1);
  expect(invalidValues('range', 'threshold', [0, 100])).toBe(expected2);
});
