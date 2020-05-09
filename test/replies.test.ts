import { invalidValues } from '../src/util/replies';

test('retorna o motivo certo de erro', () => {
  const expected1 = `Invalid value for 'mode', this option accepts: 1, 2, 3`;
  const expected2 = `Invalid value for 'threshold', this option must be between these numbers: 0, 100`;
  const expected3 = `Invalid value for 'some', this option must be between these numbers: 0, 100`;

  const dummyObj = {
    //Return obj from `isValidValues`
    status: 'error',
    type: 'range',
    prop: 'some',
    //SketchConfig alike
    values: {
      some: {
        boundaries: [0, 100],
        type: 'range',
      },
    },
  };

  expect(invalidValues('allowed', 'mode', [1, 2, 3])).toBe(expected1);
  expect(invalidValues('range', 'threshold', [0, 100])).toBe(expected2);
  expect(
    invalidValues(
      dummyObj.type as 'range',
      dummyObj.prop,
      dummyObj.values[dummyObj.prop].boundaries
    )
  ).toBe(expected3);
});
