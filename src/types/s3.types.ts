interface UploadFile {
  fileBuffer?: Buffer | string;
  mimetype?: string;
  staffId: string;
  productId?: string;
  image_type?: string;
}

interface UploadFiles {
  files: any;
  staffId: string;
  image_type : string;
  productId : string
}

interface FileExist {
  staffId?: string;
  fileName?: string;
}

interface FileList {
  staffId?: string;
  fileType?: string;
}

export { UploadFile, UploadFiles, FileExist, FileList };
