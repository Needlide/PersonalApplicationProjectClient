import { TagDto } from '../tag/tag.dto';

export interface EventSummaryDto {
  id: number;
  name: string;
  eventTimestamp: any;
  participantCount: number;
  capacity?: number;
  visible: boolean;
  tags: TagDto[];
}
