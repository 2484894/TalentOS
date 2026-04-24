import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterNotificationsComponent } from './recruiter-notifications.component';

describe('RecruiterNotificationsComponent', () => {
  let component: RecruiterNotificationsComponent;
  let fixture: ComponentFixture<RecruiterNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruiterNotificationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecruiterNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

