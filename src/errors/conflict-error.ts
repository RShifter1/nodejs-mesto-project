import { STATUS_CONFLICT } from '../utils/constants';

class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_CONFLICT;
  }
}
export default ConflictError;
