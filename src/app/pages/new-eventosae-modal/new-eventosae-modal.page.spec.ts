import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewEventosaeModalPage } from './new-eventosae-modal.page';

describe('NewEventosaeModalPage', () => {
  let component: NewEventosaeModalPage;
  let fixture: ComponentFixture<NewEventosaeModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NewEventosaeModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
