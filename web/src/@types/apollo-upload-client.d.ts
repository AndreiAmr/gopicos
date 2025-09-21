declare module 'apollo-upload-client' {
  import { ApolloLink } from '@apollo/client/core';
  import { HttpOptions } from '@apollo/client/link/http';

  export interface UploadOptions extends HttpOptions {
    isExtractableFile?: (value: any) => boolean;
    formDataAppendFile?: (
      formData: FormData,
      fieldName: string,
      file: any
    ) => void;
  }

  export function createUploadLink(options?: UploadOptions): ApolloLink;
}
