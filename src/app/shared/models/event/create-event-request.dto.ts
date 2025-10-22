export interface CreateEventRequestDto {
  name: string;
  description?: string;
  eventTimestamp: any;
  location?: string;
  capacity?: number;
  visible: boolean;
}
