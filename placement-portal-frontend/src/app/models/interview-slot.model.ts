export interface InterviewSlot {
  id: number;
  applicationId: number;
  proposedTimes: string[];
  confirmedTime: string | null;
  confirmed: boolean;
  cancelled: boolean;
}

export interface ProposeSlotRequest {
  proposedTimes: string[];
}

export interface ConfirmSlotRequest {
  confirmedTime: string;
}

