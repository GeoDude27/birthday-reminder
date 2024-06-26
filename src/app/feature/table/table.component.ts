import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NotificationService } from '../../shared/notification.service';

interface Friend {
  id: number;
  nume: string;
  prenume: string;
  telefon: string;
  oras: string;
  dataNasterii: Date;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  listOfData: Friend[] = [];
  friendForm: FormGroup;
  searchTerm: string = '';

  constructor(private fb: FormBuilder, private notification: NotificationService, private modal: NzModalService) {
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
    this.listOfData = [
      {
        id: 1,
        nume: 'Popescu',
        prenume: 'Ion',
        telefon: '0712345678',
        oras: 'Bucuresti',
        dataNasterii: new Date('1990-01-01')
      },
      {
        id: 2,
        nume: 'Ionescu',
        prenume: 'Maria',
        telefon: '0712345679',
        oras: 'Cluj-Napoca',
        dataNasterii: new Date('1992-02-02')
      }
    ];
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
    this.listOfData = this.listOfData.filter(f => f.id !== friend.id);
    this.notification.showSuccess('Friend deleted successfully!');
  }

  onSubmit(): void {
    if (this.friendForm.valid) {
      const formValue = this.friendForm.value;
      if (formValue.id) {
        const index = this.listOfData.findIndex(f => f.id === formValue.id);
        this.listOfData[index] = { ...formValue, dataNasterii: new Date(formValue.dataNasterii) };
        this.notification.showSuccess('Friend updated successfully!');
      } else {
        const newId = this.listOfData.length ? Math.max(...this.listOfData.map(f => f.id)) + 1 : 1;
        this.listOfData = [...this.listOfData, { ...formValue, id: newId, dataNasterii: new Date(formValue.dataNasterii) }];
        this.notification.showSuccess('Friend added successfully!');
      }
      this.friendForm.reset();
    } else {
      this.notification.showError('Please fill in all required fields!');
    }
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
