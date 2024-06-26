import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  friends: any[] = [];
  newFriend: any = {};
  searchTerm: string = '';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadFriends();
  }

  loadFriends(): void {
    this.friends = this.dataService.getFriends();
  }

  addFriend(): void {
    if (this.newFriend.id) {
      // Update existing friend
      this.dataService.updateFriend(this.newFriend.id, this.newFriend);
    } else {
      // Add new friend
      this.dataService.addFriend(this.newFriend);
    }
    this.loadFriends();
    this.newFriend = {};
  }

  editFriend(friend: any): void {
    this.newFriend = { ...friend }; // Preluăm datele prietenului pentru editare
  }

  deleteFriend(id: number): void {
    this.dataService.deleteFriend(id);
    this.loadFriends();
  }

  sortFriends(column: string): void {
    this.friends.sort((a, b) => a[column].localeCompare(b[column]));
  }

  searchFriends(): any[] {
    return this.friends.filter(friend => 
      friend.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      friend.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      friend.phone.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      friend.city.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      friend.birthday.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openDetails(friend: any): void {
    alert(`Details:\nName: ${friend.firstName} ${friend.lastName}\nPhone: ${friend.phone}\nCity: ${friend.city}\nBirthday: ${friend.birthday}`);
  }
}
