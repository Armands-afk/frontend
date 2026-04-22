import { Component, inject, OnInit, signal } from '@angular/core';
import { form, FormField, required, validate, min, minLength } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { EventDTO, NewEventModel } from '../events/event-model';
import { EventService } from '../services/event-service';
import { UserDataService } from '../services/user-data';
import { ErrorValidation } from '../error-validation/error-validation';
import { SchemaPathTree } from '@angular/forms/signals';

// šeit man ir validātors priekš admina kur uzreiz es pārbadu vai datums nav pagātnē
//  un vai ir aizpildīti visi lauki, un vai max dalībnieku skaits nav mazāks par 1
function validateNewEventForm(s: SchemaPathTree<NewEventModel>) {
  required(s.nosaukums, { message: 'Nosaukums ir obligāts' });
  minLength(s.nosaukums, 3, { message: 'Nosaukumam jābūt vismaz 3 rakstzīmēm' });
  required(s.apraksts, { message: 'Apraksts ir obligāts' });
  required(s.vieta, { message: 'Vieta ir obligāta' });
  minLength(s.vieta, 2, { message: 'Vietai jābūt vismaz 2 rakstzīmēm' });
  required(s.datums, { message: 'Datums ir obligāts' });
  validate(s.datums, ({ value }) => {
    const entered = value().trim();
    if (!entered) return null;
    const d = new Date(entered);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d < today) {
      return { kind: 'pastDate', message: 'Pasākums nedrīkst būt pagātnē' };
    }
    return null;
  });
  required(s.laiks, { message: 'Laiks ir obligāts' });
  min(s.maxDalibnieki, 1, { message: 'Maks. dalībnieku skaitam jābūt vismaz 1' });
}

@Component({
  selector: 'app-events-admin',
  imports: [FormField, ErrorValidation],
  templateUrl: './events-admin.html',
  styleUrl: './events-admin.css',
})
export class EventsAdmin implements OnInit {
  eventService = inject(EventService);
  userDataService = inject(UserDataService);
  router = inject(Router);

  userId: number = this.userDataService.getUserData().id;

  // visi pasākumi no backend, tiek ielādēti ngOnInit un pēc katras izmaiņas (izveidošanas/dzēšanas)
  allEvents = signal<EventDTO[]>([]);

  // Nosaka, vai rādīt pasākuma izveides formu
  showCreateForm = signal<boolean>(false);

  // Signāls, kas satur jauna pasākuma formas datus
  newEventSignal = signal<NewEventModel>({
    nosaukums: '',
    apraksts: '',
    datums: '',
    laiks: '',
    vieta: '',
    maxDalibnieki: 1,
  });

  // Reaktīvais formas koks ar validāciju
  newEventForm = form(this.newEventSignal, (v) => {
    validateNewEventForm(v);
  });

  ngOnInit(): void {
    this.loadAllEvents();
  }

  // Iegūst visus pasākumus no servera.
  loadAllEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.allEvents.set(response.body ?? []);
        }
      },
      error: () => {
        alert('Neizdevās ielādēt pasākumus.');
      },
    });
  }

  // Parāda vai paslēpj pasākuma izveides formu.
  toggleCreateForm() {
    this.showCreateForm.update((v) => !v);
  }

  // Iesniedz jauna pasākuma formu un saglabā serverī.
  createEvent() {
    const formData = this.newEventSignal();
    if (!formData.nosaukums || !formData.apraksts || !formData.datums || !formData.laiks || !formData.vieta || formData.maxDalibnieki < 1) {
      alert('Lūdzu aizpildiet visus obligātos laukus.');
      return;
    }
    const payload = { ...formData, organizatorId: this.userId };
    this.eventService.createEvent(payload).subscribe({
      next: (response) => {
        if (response.status === 201) {
          this.showCreateForm.set(false);
          // Atjauno formu uz tukšu stāvokli
          this.newEventSignal.set({
            nosaukums: '',
            apraksts: '',
            datums: '',
            laiks: '',
            vieta: '',
            maxDalibnieki: 1,
          });
          this.loadAllEvents();
        }
      },
      error: () => {
        alert('Neizdevās izveidot pasākumu. Pārliecinieties, ka datums nav pagātnē.');
      },
    });
  }

  // Dzēš pasākumu pēc ID (kopā ar visiem pieteikumiem).
  deleteEvent(id: number) {
    if (!confirm('Vai tiešām vēlaties dzēst šo pasākumu? Tiks dzēstas arī visas pieteikšanās.')) {
      return;
    }
    this.eventService.deleteEvent(id).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.loadAllEvents();
        }
      },
      error: () => {
        alert('Neizdevās dzēst pasākumu.');
      },
    });
  }

  // Atgriež true, ja pasākums ir pilns (sasniegts maks. dalībnieku skaits).
  isFull(event: EventDTO) {
    return event.pieteikumuSkaits >= event.maxDalibnieki;
  }

  // Novirza atpakaļ uz pasākumu sarakstu.
  goToEvents() {
    this.router.navigate(['/events']);
  }

  // Sito man atdod ka tekstu un nevar izveleties pagatnes datumus uzreiz nepieleca bet darbojas
  get minDate() {
    return new Date().toISOString().split('T')[0];
  }
}
