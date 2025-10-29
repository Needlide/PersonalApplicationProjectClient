import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { TagDto } from '../../shared/models/tag/tag.dto';
import { handleError } from '../../shared/handle-error';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private http = inject(HttpClient);
  private readonly rootUrl = 'http://localhost:5047';

  getAllTags(): Observable<TagDto[]> {
    return this.http
      .get<TagDto[]>(`${this.rootUrl}/api/tags`)
      .pipe(catchError(handleError));
  }
}
