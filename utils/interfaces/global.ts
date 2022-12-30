import { Key } from "react";

interface HeadProps {
  description: string;
  section: string;
}

interface ProductCategoryBoxProps {
  key: Key;
  href: String;
  name: String;
  categoryId: string;
  imgKey: string;
}

interface SpecificProductBoxProps {
  key: Key;
  sku: string;
  name: string;
  // price: string
  // imgUrl: string
  // hasOffer: boolean
  category: string;
  individuals: any;
}

interface PageProps {
  data: any;
  success: boolean;
  error: boolean;
  reload?: boolean
}

interface ProductSize {
  name: string;
  key: string;
  stock: number;
}

interface ISizeSelector {
  name: string;
  stock?: number;
  disabled?: boolean;
  colorSizes?: any;
}

interface IRegisterUserBody {
  user_name: string;
  user_surname: string;
  user_document_type: string;
  user_document_number: string;
  user_cellphone: string;
  user_email: string;
  user_password: string;
}

interface ILoginUser {
  user_email: string;
  user_password: string;
}

interface IAuthContext {
  id_user: number;
  user_name: string;
  user_surname: string;
  user_document_type: string;
  user_document_number: string;
  user_cellphone: string;
  user_email: string;
  user_role: string;
}

interface ICartPayload {
  globalProductId: number,
  individualProductId: number,
  quantity: number
}

interface IPersonalDataComponentProps {
  name: string,
  surname: string,
  cellphone: string,
  email: string
}

interface IUserAddress {
  id_user_address?: number,
  id_user?: number,
  country: string,
  province: string,
  city: string,
  address: string,
  address_number: string,
  road_type: string
}

interface IAddressesPanelProps {
  addresses: IUserAddress[],
  error: boolean
}

interface IGenericInternalServiceResponse {
  error: boolean,
  success: boolean
  data: any
}

interface IGenericExternalServiceResponse {
  httpStatus: number,
  serverMessage: string,
  moreDetails: string,
  responseBody: any,
  errorMessage?: string | Array<any>,
  error: boolean,
  success: boolean
}

export type {
  HeadProps,
  IRegisterUserBody,
  IAuthContext,
  ProductCategoryBoxProps,
  SpecificProductBoxProps,
  PageProps,
  ProductSize,
  ISizeSelector,
  ILoginUser,
  ICartPayload,
  IPersonalDataComponentProps,
  IUserAddress,
  IAddressesPanelProps,
  IGenericExternalServiceResponse,
  IGenericInternalServiceResponse
};
