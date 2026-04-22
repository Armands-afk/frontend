import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EventDTO, NewEventModel } from '../events/event-model';

// Atbild par visiem HTTP pieprasījumiem uz backend pasākumu API.
@Injectable({
  providedIn: 'root',
})
export class EventService {
  http = inject(HttpClient);

  baseUrl: string = environment.api.baseUrl;

  //GET /api/v1/getevents
  public getAllEvents(): Observable<HttpResponse<EventDTO[]>> {
    return this.http.get<EventDTO[]>(`${this.baseUrl}/api/v1/getevents`, {
      observe: 'response',
    });
  }

  //POST /api/v1/createevent
  public createEvent(event: NewEventModel & { organizatorId: number }): Observable<HttpResponse<EventDTO>> {
    return this.http.post<EventDTO>(`${this.baseUrl}/api/v1/createevent`, event, {
      observe: 'response',
    });
  }

  //POST /api/v1/registerevent/{userId}/{eventId}
  public registerForEvent(userId: number, eventId: number): Observable<HttpResponse<void>> {
    return this.http.post<void>(`${this.baseUrl}/api/v1/registerevent/${userId}/${eventId}`, null, {
      observe: 'response',
    });
  }

  //DELETE /api/v1/cancelevent/{userId}/{eventId}
  public cancelRegistration(userId: number, eventId: number): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.baseUrl}/api/v1/cancelevent/${userId}/${eventId}`, {
      observe: 'response',
    });
  }

  //DELETE /api/v1/deleteevent/{eventId}
  public deleteEvent(id: number): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.baseUrl}/api/v1/deleteevent/${id}`, {
      observe: 'response',
    });
  }

  //GET /api/v1/myevents/{userId}
  public getMyEvents(userId: number): Observable<HttpResponse<EventDTO[]>> {
    return this.http.get<EventDTO[]>(`${this.baseUrl}/api/v1/myevents/${userId}`, {
      observe: 'response',
    });
  }
}
