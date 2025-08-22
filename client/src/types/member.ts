import { PagingParams } from "./pagination"

export type Member = {
  id: string
  dateOfBirth: string
  imageUrl?: string
  displayName: string
  created: string
  lastActive: string
  gender: string
  description?: string
  country: string
  city: string
}

export type EditableMember = {
  displayName: string,
  description?: string,
  country: string,
  city: string
}

export class MemberParams extends PagingParams {
  gender?: string;
  minAge = 18;
  maxAge = 100;
  orderBy = 'lastActive';
}
