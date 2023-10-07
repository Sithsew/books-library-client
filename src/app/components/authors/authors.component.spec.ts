import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthorsComponent } from './authors.component';
import { AuthorService } from 'src/app/services/author.service';
import { MaterialComponentsModule } from '../material-components/material-components.module';
import { IAuthor } from 'src/app/models/author.model';

describe('AuthorsComponent', () => {
  let component: AuthorsComponent;
  let fixture: ComponentFixture<AuthorsComponent>;
  let dialog: MatDialog;
  let authorService: jasmine.SpyObj<AuthorService>;

  const mockAuthors: IAuthor[] = [
    { _id: '1', first_name: 'John', last_name: 'Doe' },
    { _id: '2', first_name: 'Jane', last_name: 'Doe' },
  ];

  beforeEach(() => {
    const dialogMock = {
      open: jasmine.createSpy('open'),
    };

    const authorServiceMock = jasmine.createSpyObj('AuthorService', [
      'getAll',
      'delete',
    ]);

    TestBed.configureTestingModule({
      declarations: [AuthorsComponent],
      imports: [RouterTestingModule, MaterialComponentsModule],
      providers: [
        { provide: MatDialog, useValue: dialogMock },
        { provide: AuthorService, useValue: authorServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorsComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    authorService = TestBed.inject(
      AuthorService
    ) as jasmine.SpyObj<AuthorService>;

    authorService.getAll.and.returnValue(of(mockAuthors));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
