import { IncomingMessage, ServerResponse } from 'http';

type IRepository<FindProp, CreateProp, UpdateProp, DeleteProp> = {
  find(prop: FindProp): Promise<any>;
  create(prop: CreateProp): Promise<any>;
  update(prop: UpdateProp): Promise<any>;
  delete(prop: DeleteProp): Promise<any>;
};

type ContextProps = {
  req: IncomingMessagee;
  res: ServerResponse;
};

type GqlUploadFileProps = {
  createReadStream: () => NodeJS.ReadableStream;
  filename: string;
  mimetype: string;
  encoding: string;
};
