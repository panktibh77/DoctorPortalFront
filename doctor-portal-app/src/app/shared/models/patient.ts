export class Patient{
  id?: String;
  patient_name?: String;
  address?: String;
  mobile?: number;
  email?: String;
  username?: String;
  password?: String;
  PageNo: number;
  PageSize: number;
  SortItem: string;
  SortOrder: string;
  SearchText: string;

  constructor() {
    this.PageNo = 0;
    this.PageSize = 5;
    this.SortItem = 'patient_name';
    this.SortOrder = 'ASC';
    this.SearchText = '';
  }
}
