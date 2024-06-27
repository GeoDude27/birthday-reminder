import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Friend {
  id: number;
  nume: string;
  prenume: string;
  telefon: string;
  oras: string;
  dataNasterii: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  private apiUrl = 'http://localhost:3000/api/friends';
  private friendsSubject = new BehaviorSubject<Friend[]>([]);
  friends$ = this.friendsSubject.asObservable();

  constructor(private http: HttpClient) { }

  getFriends(): void {
    this.http.get<Friend[]>(this.apiUrl).subscribe(friends => {
      this.friendsSubject.next(friends);
    });
  }

  addFriend(friend: Friend): Observable<Friend> {
    return this.http.post<Friend>(this.apiUrl, friend).pipe(
      tap(newFriend => {
        const currentFriends = this.friendsSubject.value;
        this.friendsSubject.next([...currentFriends, newFriend]);
      })
    );
  }

  updateFriend(friend: Friend): Observable<Friend> {
    return this.http.put<Friend>(`${this.apiUrl}/${friend.id}`, friend).pipe(
      tap(updatedFriend => {
        const currentFriends = this.friendsSubject.value;
        const index = currentFriends.findIndex(f => f.id === updatedFriend.id);
        currentFriends[index] = updatedFriend;
        this.friendsSubject.next([...currentFriends]);
      })
    );
  }

  deleteFriend(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentFriends = this.friendsSubject.value;
        const updatedFriends = currentFriends.filter(f => f.id !== id);
        this.friendsSubject.next(updatedFriends);
      })
    );
  }
}
