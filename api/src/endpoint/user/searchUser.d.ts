import Role from '../../../../ngapp/src/role';
type User = {username:string;_id:string;language:string;role:string};
export type SearchUserEndpoint = {
  users:User[];
  count:number;
  validatedQuery: SearchUserQueryBody
};
export type SearchUserQueryBody = {
  searchString:string;
  currentPage:number;
  limit:number;
  roles: Role[];
};
