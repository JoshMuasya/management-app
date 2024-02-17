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

export interface PopoverType {
    userName: string;
    handleSignOut: () => void;
    department: string;
    rank: string;
}

export interface UsersType {
    userName?: string;
    department?: string;
    rank?: string;
}

export interface UserData {
    fullname?: string;
    department?: string;
    rank?: string;
}

export interface FinanceClientData {
    paymentHistory?: { [date: string]: string };
    dateCreated: { seconds: number; nanoseconds: number } | Date;
    clientId?: string;
    clientName?: string;
    totalAmount?: string;
    financeId: string;
}

export interface FinancesClient extends ClientFormData {
    dateCreated: { seconds: number; nanoseconds: number } | Date;
    totalAmount?: string;
    financeId: string;
}

export interface Expenses {
    amount: string;
    date: { seconds: number; nanoseconds: number } | Date;
    description: string;
    loggedBy: string;
    name: string;
    docId: string;
}