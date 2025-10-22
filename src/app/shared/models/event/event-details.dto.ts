import { UserDto } from '../user/user.dto';

export interface EventDetailsDto {
  id: number;
  name: string;
  description?: string;
  eventTimestamp: any;
  location?: string;
  capacity?: number;
  participantCount: number;
  visible: boolean;
  organizer: UserDto;
  participants: UserDto[];
}
