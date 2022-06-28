import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObservableSpy } from '../testing/observable-spy';
import { useDestroy } from './use-destroy';

@Component({
  selector: 'ngry-test',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {
  readonly destroy$ = useDestroy();
}

describe('useDestroy', () => {
  describe('within component', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let destroySpy: ObservableSpy<void>;

    beforeEach(() => {
      return TestBed.configureTestingModule({
        declarations: [TestComponent],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      destroySpy = new ObservableSpy(component.destroy$);
    });

    beforeEach(() => {
      fixture.destroy();
    });

    it('should emit once and complete', () => {
      expect(destroySpy.values.length).toBe(1);
      expect(destroySpy.complete).toBe(true);
    });
  });
});
