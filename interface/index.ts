export interface CardType {
    title: string;
    desc: string;
    button1: string;
    button2: string;
    link1: string;
    link2: string;
}

export interface CasesFormData {
    documentId: string;
    caseNo: string;
    caseName: string;
    location: string;
    court: string;
    department: string;
    status: string;
    summary: string;
    loggedBy: string;
    instructionDate: string;
    clientId: string;
}

export interface ClientFormData {
    clientName: string;
    phoneNumber: string;
    email: string;
    pin: string;
    clientId: string;
    address: string;
    servicesProvided: string;
    indemnityClause: string;
    nextOfKinName: string;
    nextOfKinNumber: string;
    nextOfKinAddress: string;
}

export interface DatesType {
    dateName: string;
    dateValue: string | string[];
}

export interface CasesType extends CasesFormData {
    dateName: string;
    dateValue: string;
    dates: {
        [dateName: string]: string[];
    };
}