export interface StudentApiInterface {
    studentId: string,
    studentName: string,
    courseId: string
}

export interface ApiErrorInterface {
    isError: boolean,
    errorCode: number,
    errorMessage: string
}