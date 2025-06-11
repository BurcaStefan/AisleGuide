import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedItemsPageComponent } from './suggested-items-page.component';

describe('SuggestedItemsPageComponent', () => {
  let component: SuggestedItemsPageComponent;
  let fixture: ComponentFixture<SuggestedItemsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestedItemsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestedItemsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
