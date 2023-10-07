import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { AddAuthorComponent } from './add-author.component';
import { AuthorService } from 'src/app/services/author.service';
import { MaterialComponentsModule } from '../material-components/material-components.module';

describe('AddAuthorComponent', () => {
  let component: AddAuthorComponent;
  let fixture: ComponentFixture<AddAuthorComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<AddAuthorComponent>>;
  let authorService: jasmine.SpyObj<AuthorService>;

  beforeEach(() => {
    const dialogMock = jasmine.createSpyObj('MatDialogRef', ['close']);
    const authorServiceMock = jasmine.createSpyObj('AuthorService', [
      'create',
      'update',
    ]);

    TestBed.configureTestingModule({
      declarations: [AddAuthorComponent],
      imports: [ReactiveFormsModule, MaterialComponentsModule],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: AuthorService, useValue: authorServiceMock },
      ],
    });

    fixture = TestBed.createComponent(AddAuthorComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<AddAuthorComponent>
    >;
    authorService = TestBed.inject(
      AuthorService
    ) as jasmine.SpyObj<AuthorService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    component.ngOnInit();
    expect(component.authorForm).toBeDefined();
  });

  it('should populate form if data is provided', () => {
    const authorData = { first_name: 'J. K.', last_name: 'Rowling' };
    component.data = { author: authorData };
    component.ngOnInit();

    expect(component.authorForm.value).toEqual(authorData);
  });

  it('should call service update method on form submission', () => {
    const authorId = '65212bb7b3bfb29b74c05d51';
    const authorData = {
      first_name: 'J. K.',
      last_name: 'Rowling',
    };
    const response = {
      _id: authorId,
      first_name: 'J. K.',
      last_name: 'Rowling',
      createdAt: '2023-10-07T09:58:15.928Z',
      updatedAt: '2023-10-07T20:23:48.347Z',
    };
    authorService.update.and.returnValue(of(response));

    component.data = { author: { _id: authorId, ...authorData } };
    component.ngOnInit();
    component.onSubmit();

    expect(authorService.update).toHaveBeenCalledWith(authorId, authorData);
    expect(dialogRef.close).toHaveBeenCalledWith(authorData);
  });

  it('should call service create method on form submission', () => {
    const authorData = {
      first_name: 'J. K.',
      last_name: 'Rowling',
    };
    const response = {
      _id: '65212bb7b3bfb29b74c05d51',
      first_name: 'J. K.',
      last_name: 'Rowling',
      createdAt: '2023-10-07T09:58:15.928Z',
      updatedAt: '2023-10-07T20:23:48.347Z',
    };
    authorService.create.and.returnValue(of(response));
    component.data = undefined;
    component.ngOnInit();
    component.authorForm.patchValue({
      first_name: authorData.first_name,
      last_name: authorData.last_name,
    });
    component.onSubmit();

    expect(authorService.create).toHaveBeenCalledWith(authorData);
    expect(dialogRef.close).toHaveBeenCalledWith(authorData);
  });

  it('should close dialog on cancel', () => {
    component.onNoClick();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
