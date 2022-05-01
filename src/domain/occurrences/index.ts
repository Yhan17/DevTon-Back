export enum Occurrences {
  DatabaseError = "An Database error has occurred",
  ServerError = "An Server error has occurred",
  Undefined = "Undefined"
}

export interface IOccurrences {
  status: number,
  message: string,
  error: boolean,
}

export const unwrapOccurrences = (occurrence: Occurrences): IOccurrences => {
  return {
    error: true,
    message: occurrence,
    status: 500
  }
}