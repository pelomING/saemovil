import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewEventosaePage } from './view-eventosae.page';

describe('ViewEventosaePage', () => {
  let component: ViewEventosaePage;
  let fixture: ComponentFixture<ViewEventosaePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewEventosaePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
