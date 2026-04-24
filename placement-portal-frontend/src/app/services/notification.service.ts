import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Notification, UnreadCount } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private api = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getMyNotifications(): Observable<ApiResponse<Notification[]>> {
    return this.http.get<ApiResponse<Notification[]>>(this.api);
  }

  getUnreadCount(): Observable<ApiResponse<UnreadCount>> {
    return this.http.get<ApiResponse<UnreadCount>>(`${this.api}/unread-count`);
  }

  markAsRead(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.api}/${id}/read`, {});
  }

  markAllAsRead(): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.api}/read-all`, {});
  }
}
