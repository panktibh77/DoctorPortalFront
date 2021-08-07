export class User {
  user_id: any;
  id?: number;
  name: string;
  username: string;
  password?: string;
  email: string;
  last_login_on: any;
  PageNo: number;
  PageSize: number;
  SortItem: String;
  SortOrder: String;
  SearchText: String;
  SearchText2: String;

  constructor() {
    this.PageNo = 0;
    this.PageSize = 5;
    this.SortItem = "name";
    this.SortOrder = "ASC";
    this.SearchText = '';
    this.SearchText2 = '';
  }

}

export class UserAuth {
  username: string;
  password: string;
}
