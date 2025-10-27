import { TagDto } from '../tag/tag.dto';

export interface UpdateEventRequestDto {
  name: string;
  description?: string;
  eventTimestamp: any;
  location?: string;
  capacity?: number;
  visible: boolean;
  tags: TagDto[];
}
