import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { EditStoryComponent } from './edit-story-page/edit-story/component';
import { RecordingComponent } from './student-components/recording/recording.component';

@Injectable({
  providedIn: 'root'
})
class CanDeactivateDashboardGuard implements CanDeactivate<EditStoryComponent> {
  canDeactivate(editStoryComponent: EditStoryComponent) {
    if(editStoryComponent.storySaved) { return true };
    editStoryComponent.showModal();
    return editStoryComponent.modalChoice;
  }
}

@Injectable({
  providedIn: 'root'
})
class CanDeactivateRecordingGuard implements CanDeactivate<RecordingComponent> {
  canDeactivate(
    recording: RecordingComponent
  ): Observable<boolean> | boolean {
    if(recording.recordingSaved) { return true };
    recording.showModal();
    return recording.modalChoice;
  }
}

export {CanDeactivateDashboardGuard, CanDeactivateRecordingGuard};