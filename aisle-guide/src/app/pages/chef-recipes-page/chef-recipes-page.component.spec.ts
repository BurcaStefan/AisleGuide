import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefRecipesPageComponent } from './chef-recipes-page.component';

describe('ChefRecipesPageComponent', () => {
  let component: ChefRecipesPageComponent;
  let fixture: ComponentFixture<ChefRecipesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChefRecipesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChefRecipesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
