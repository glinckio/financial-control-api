import { User } from '../../database/entities/user.entity';

export interface RequestWithUser {
  user: User;
}
