import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyEventsCalendarComponent } from './components/my-events-calendar/my-events-calendar.component';

const routes: Routes = [
  {
    path: '',
    component: MyEventsCalendarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyEventsRoutingModule {}
