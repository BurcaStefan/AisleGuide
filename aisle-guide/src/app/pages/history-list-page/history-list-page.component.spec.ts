import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryListPageComponent } from './history-list-page.component';

describe('HistoryListPageComponent', () => {
  let component: HistoryListPageComponent;
  let fixture: ComponentFixture<HistoryListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
