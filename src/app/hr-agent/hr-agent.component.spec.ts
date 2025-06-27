import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrAgentComponent } from './hr-agent.component';

describe('HrAgentComponent', () => {
  let component: HrAgentComponent;
  let fixture: ComponentFixture<HrAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrAgentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
