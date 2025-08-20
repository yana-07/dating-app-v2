import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css'
})
export class ImageUpload {
  protected imageSrc = signal<string | ArrayBuffer | null | undefined>(null);
  protected isDragging = signal(false);
  private fileToUpload = signal<File | null>(null);
  uploadFile = output<File>();
  loading = input(false);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave() {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    console.log(event);

    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      this.createImagePreview(file);
      this.fileToUpload.set(file);
    }
  }

  onSelectFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.createImagePreview(file);
      this.fileToUpload.set(file);
    }
  }

  onUploadFile() {
    const fileToUpload = this.fileToUpload();
    if (fileToUpload) {
      this.uploadFile.emit(fileToUpload);
    }
  }

  onCancel() {
    this.fileToUpload.set(null);
    this.imageSrc.set(null);
  }

  private createImagePreview(file: File) {
    const reader = new FileReader();
    reader.onload = event => {
      this.imageSrc?.set(event.target?.result)
    };
    reader.readAsDataURL(file);
  }
}
