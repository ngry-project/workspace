import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { useAsync } from './use-async';

@Component({
  selector: 'ngry-test',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {
  readonly source$ = new Subject<string>();

  readonly getValue = useAsync(this.source$);
}

describe('useAsync', () => {
  describe('within component', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    beforeEach(() => {
      return TestBed.configureTestingModule({
        declarations: [TestComponent],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
    });

    describe('when source not emitted yet', () => {
      it('should return `undefined`', () => {
        expect(component.getValue()).toBeUndefined();
      });
    });

    describe('when source has emitted', () => {
      it('should return the latest emitted value', () => {
        component.source$.next('one');

        expect(component.getValue()).toBe('one');

        component.source$.next('two');

        expect(component.getValue()).toBe('two');
      });
    });
  });
});
