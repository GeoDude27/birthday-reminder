import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private friends: any[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', phone: '1234567890', city: 'New York', birthday: '1990-01-01' },
    { id: 2, firstName: 'Jane', lastName: 'Doe', phone: '0987654321', city: 'Los Angeles', birthday: '1992-02-02' }
  ];

  getFriends(): any[] {
    return this.friends;
  }

  addFriend(friend: any): void {
    friend.id = this.friends.length + 1;
    this.friends.push(friend);
  }

  updateFriend(id: number, friend: any): void {
    const index = this.friends.findIndex(f => f.id === id);
    if (index !== -1) {
      this.friends[index] = friend;
    }
  }

  deleteFriend(id: number): void {
    this.friends = this.friends.filter(f => f.id !== id);
  }
}
