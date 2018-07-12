import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-image-dropzone',
  templateUrl: './image-dropzone.component.html',
  styleUrls: ['./image-dropzone.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ImageDropzoneComponent),
    }
  ]
})
export class ImageDropzoneComponent implements ControlValueAccessor {
  onChange;
  isHovering = false;
  constructor() { }

  writeValue() {
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  onImageDrop(event: File) { 
    if (event.type.split('/')[0] !== 'image') {
      console.error('This is not an image!');
      return;
    }
    this.onChange(event);
  }

  toggleHover(event: boolean) { // Used for dropzone
    this.isHovering = event;
  }

  registerOnTouched() { }

  setDisabledState() { }
}
