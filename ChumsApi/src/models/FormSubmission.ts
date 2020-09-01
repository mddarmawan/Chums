export class FormSubmission {
    public id?: number;
    public churchId?: number;
    public formId?: number;
    public contentType?: string;
    public contentId?: number;
    public submissionDate?: Date;
    public submittedBy: number;
    public revisionDate: Date;
    public revisedBy: number;
}
