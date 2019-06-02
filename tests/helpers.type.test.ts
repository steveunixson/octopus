import helpersClass from '../src/helpers/helpers.class';
import { expect } from 'chai';
import 'mocha';

describe('Helpers class --> type()', () => {
  it('should not return undefined', () => {
    const array = helpersClass.type('unixson@gmail.com');
    expect(array).not.undefined;
  });
});
