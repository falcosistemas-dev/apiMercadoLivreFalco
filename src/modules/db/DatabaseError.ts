export default class DatabaseError extends Error{
    public readonly originalError: any;

    constructor(message: string, originalError: any){
        super(message)
        this.name = "DatabaseError"
        this.originalError = originalError
    }
}