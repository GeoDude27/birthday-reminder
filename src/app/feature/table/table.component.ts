import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NotificationService } from '../../shared/notification.service';
import { FriendService, Friend } from '../../shared/friend.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  listOfData: Friend[] = [];
  friendForm: FormGroup;
  searchTerm: string = '';

  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private modal: NzModalService,
    private friendService: FriendService
  ) {
    this.friendForm = this.fb.group({
      id: [null],
      nume: ['', [Validators.required]],
      prenume: ['', [Validators.required]],
      telefon: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      oras: ['', [Validators.required]],
      dataNasterii: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.friendService.friends$.subscribe(friends => {
      this.listOfData = friends;
    });
    this.friendService.getFriends();
  }

  editFriend(friend: Friend): void {
    this.friendForm.setValue({
      id: friend.id,
      nume: friend.nume,
      prenume: friend.prenume,
      telefon: friend.telefon,
      oras: friend.oras,
      dataNasterii: friend.dataNasterii
    });
  }

  deleteFriend(friend: Friend): void {
    this.friendService.deleteFriend(friend.id).subscribe(() => {
      this.notification.showSuccess('Friend deleted successfully!');
    }, error => {
      this.notification.showError('Error deleting friend');
    });
  }

  onSubmit(): void {
    if (this.friendForm.valid) {
      const formValue = this.friendForm.value;
      if (formValue.id) {
        this.friendService.updateFriend(formValue).subscribe(() => {
          this.notification.showSuccess('Friend updated successfully!');
          this.resetForm(); // Resetăm formularul după actualizare
        }, error => {
          this.notification.showError('Error updating friend');
        });
      } else {
        this.friendService.addFriend(formValue).subscribe(() => {
          this.notification.showSuccess('Friend added successfully!');
          this.resetForm(); // Resetăm formularul după adăugare
        }, error => {
          this.notification.showError('Error adding friend');
        });
      }
    } else {
      this.notification.showError('Please fill in all required fields!');
    }
  }

  resetForm(): void {
    this.friendForm.reset({
      id: null,
      nume: '',
      prenume: '',
      telefon: '',
      oras: '',
      dataNasterii: ''
    });
  }

  viewFriend(friend: Friend): void {
    this.modal.create({
      nzTitle: 'Friend Details',
      nzContent: `<p><strong>Name:</strong> ${friend.nume}</p>
                  <p><strong>Surname:</strong> ${friend.prenume}</p>
                  <p><strong>Phone:</strong> ${friend.telefon}</p>
                  <p><strong>City:</strong> ${friend.oras}</p>
                  <p><strong>Birth Date:</strong> ${new Date(friend.dataNasterii).toLocaleDateString()}</p>`,
      nzFooter: null
    });
  }

  filterFriends(): Friend[] {
    if (!this.searchTerm) {
      return this.listOfData;
    }
    return this.listOfData.filter(friend =>
      friend.nume.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      friend.prenume.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      friend.telefon.includes(this.searchTerm) ||
      friend.oras.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
