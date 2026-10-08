/**
 * Duck-types an Axios-style error without importing axios's runtime code,
 * so this file has zero dependencies beyond the shape it checks for.
 */
export interface AxiosErrorLike {
  isAxiosError: true;
  code?: string;
  response?: {
    status?: number;
    data?: {
      message?: string | string[];
    };
  };
}
