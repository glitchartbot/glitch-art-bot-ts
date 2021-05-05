import { parseConfig } from '../src/util/common';

test('parseia as opções informadas pelo usuário', () => {
  const subjects = [
    {
      input: 'mode=5 photo=1',
      output: { mode: 5, photo: 1 }
    },
    {
      input: ' photo=2',
      output: { photo: 2 }
    },
    {
      input: '    a=3 b=5',
      output: { a: 3, b: 5 }
    }
  ];

  const expected = subjects.map(sub => sub.output);
  const results = subjects.map(sub => parseConfig(sub.input));
  expect(expected).toStrictEqual(results);
})