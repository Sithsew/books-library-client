import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
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
export class AuthorsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['first_name', 'last_name', 'actions'];
  dataSource = new MatTableDataSource<IAuthor>();
  isLoading = false;

  pageSizeOptions: number[] = [5, 10, 25, 100];
  selectedAuthor: IAuthor | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private authorService: AuthorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAuthors();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadAuthors(): void {
    this.isLoading = true;
    this.authorService.getAll().subscribe(
      (data: IAuthor[]) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error(error);
      }
    );
  }

  openAddEditAuthorDialog(author?: IAuthor): void {
    const dialogRef = this.dialog.open(AddAuthorComponent, {
      width: '350px',
      data: { author: author },
    });

    dialogRef.afterClosed().subscribe((newAuthor: IAuthor) => {
      console.log('The dialog was closed with result:', newAuthor);
      if (newAuthor) {
        this.loadAuthors();
      }
    });
  }

  onClickEdit(author?: IAuthor): void {
    this.openAddEditAuthorDialog(author);
  }

  onClickAddAuthor(): void {
    this.openAddEditAuthorDialog();
  }

  onClickDelete(authorId: string): void {
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
    this.selectedAuthor = this.selectedAuthor !== row ? row : null;
  }
}
