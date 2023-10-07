import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IAuthor } from 'src/app/models/author.model';
import { AuthorService } from 'src/app/services/author.service';
import { AddAuthorComponent } from '../add-author/add-author.component';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss'],
})
export class AuthorsComponent {
  displayedColumns: string[] = ['first_name', 'last_name', 'actions'];
  dataSource = new MatTableDataSource<IAuthor>();
  isLoading = false;

  pageSizeOptions: number[] = [5, 10, 25, 100];
  selectedAuthor: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private authorService: AuthorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.isLoading = true;
    this.authorService.getAll().subscribe(
      (data: any) => {
        this.dataSource.data = data;

        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openAddEditAuthorDialog(author?: any): void {
    const dialogRef = this.dialog.open(AddAuthorComponent, {
      width: '350px',
      data: { author: author },
    });

    dialogRef.afterClosed().subscribe((newAuthor: any) => {
      console.log('The dialog was closed with result:', newAuthor);
      if (newAuthor) {
        this.loadAuthors();
      }
    });
  }

  onClickEdit(author?: any): void {
    this.openAddEditAuthorDialog(author);
  }

  onClickAddAuthor(): void {
    this.openAddEditAuthorDialog();
  }

  onClickDelete(authorId: string) {
    this.authorService.delete(authorId).subscribe(
      () => {
        this.loadAuthors();
      },
      (error) => {
        console.error('Error deleting author:', error);
      }
    );
  }

  onClickRow(row: IAuthor): void {
    if (this.selectedAuthor !== row) {
      this.selectedAuthor = row;
    } else {
      this.selectedAuthor = null;
    }
  }
}
