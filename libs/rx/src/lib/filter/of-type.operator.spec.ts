import { from } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { ofType } from './of-type.operator';

class Load {}

class Loaded {}

describe('ofType', () => {
  it('should select values of certain type(s)', (done) => {
    from([new Load(), new Loaded()])
      .pipe(ofType(Load), toArray())
      .subscribe((result) => {
        expect(result.length).toBe(1);
        expect(result[0]).toBeInstanceOf(Load);

        done();
      });
  });
});
