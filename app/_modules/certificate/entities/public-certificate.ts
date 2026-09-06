import { Certificate } from "./certificate";

export interface PublicCertificate extends Certificate {
  signed: boolean;
  signatureValid: boolean;
}
