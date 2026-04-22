import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EventDTO } from './event-model';
import { EventService } from '../services/event-service';
import { UserDataService } from '../services/user-data';

@Component({
  selector: 'app-events',
  imports: [],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events implements OnInit {
  eventService = inject(EventService);
  userDataService = inject(UserDataService);
  router = inject(Router);

  // Pašreiz pieslēgtā lietotāja dati
  userId: number = this.userDataService.getUserData().id;
  userEmail: string = this.userDataService.getUserData().email;

  // Patiess, ja pieslēgtais lietotājs ir admins
  isAdmin: boolean = this.userDataService.getUserData().email.toLowerCase() === 'admin@gmail.com';

  // Visi pasākumi no servera
  allEvents = signal<EventDTO[]>([]);

  // Pasākumu ID kopums, uz kuriem pašreizējais lietotājs ir pieteicies
  myEventIds = signal<Set<number>>(new Set());

  ngOnInit(): void {
    this.loadAllEvents();
    this.loadMyEvents();
  }

  // Iegūst visus pasākumus no servera un atjauno sarakstu.
  loadAllEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.allEvents.set(response.body ?? []);
        }
      },
      error: () => {
        alert('Neizdevās ielādēt pasākumus. Pārbaudiet savienojumu ar serveri.');
      },
    });
  }

  // Iegūst to pasākumu ID, uz kuriem pašreizējais lietotājs ir pieteicies.
  loadMyEvents() {
    this.eventService.getMyEvents(this.userId).subscribe({
      next: (response) => {
        if (response.status === 200) {
          const ids = new Set((response.body ?? []).map((e) => e.id!));
          this.myEventIds.set(ids);
        }
      },
      error: () => {
        console.error('Neizdevās ielādēt jūsu pasākumus.');
      },
    });
  }

  // Atgriež true, ja pašreizējais lietotājs ir pieteicies uz šo pasākumu.
  isRegistered(eventId: number) {
    return this.myEventIds().has(eventId);
  }

  // Atgriež true, ja pasākums ir pilns (sasniegts maks. dalībnieku skaits).
  isFull(event: EventDTO) {
    return event.pieteikumuSkaits >= event.maxDalibnieki;
  }

  // Atgriež true, ja pasākuma datums un laiks jau ir pagājis.
  isPast(event: EventDTO) {
    const eventDate = new Date(`${event.datums}T${event.laiks}`);
    return eventDate < new Date();
  }

  // Piesaka pašreizējo lietotāju uz pasākumu.
  register(eventId: number) {
    this.eventService.registerForEvent(this.userId, eventId).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.loadAllEvents();
          this.loadMyEvents();
        }
      },
      error: () => {
        alert('Neizdevās pieteikties uz pasākumu. Iespējams, tas ir pilns vai jūs jau esat pieteicies.');
      },
    });
  }

  // Atceļ pašreizējā lietotāja pieteikumu uz pasākumu.
  cancel(eventId: number) {
    this.eventService.cancelRegistration(this.userId, eventId).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.loadAllEvents();
          this.loadMyEvents();
        }
      },
      error: () => {
        alert('Neizdevās atcelt dalību pasākumā.');
      },
    });
  }

  // Novirza uz admin paneli.
  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  // Izraksta pašreizējo lietotāju un novirza uz pieslēgšanās lapu.
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}