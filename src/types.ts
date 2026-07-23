export type ApplicationType = 'application' | 'letter';

export type ToneType = 'formal' | 'veryformal' | 'simple' | 'rural' | 'office';

export type StampType = 'none' | 'verified' | 'approved' | 'urgent' | 'draft' | 'confidential';

export interface DepartmentItem {
  id: string;
  name: string;
  categoryGroup: string;
  iconName: string;
  defaultTitle: string;
  description: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  deptId?: string;
  introSentence: string;
  extraFields: Array<'village' | 'district' | 'state' | 'pincode' | 'occupation' | 'idNumber' | 'duration' | 'refNumber'>;
  description: string;
}

export interface FormFields {
  name: string;
  fatherName: string;
  gender: 'पुरुष' | 'महिला' | 'अन्य' | '';
  address: string;
  mobile: string;
  email: string;
  officerName: string;
  date: string;
  reason: string;
  village?: string;
  district?: string;
  state?: string;
  pincode?: string;
  occupation?: string;
  idNumber?: string;
  duration?: string;
  refNumber?: string;
  signatureText?: string;
  signatureImage?: string;
}

export interface TemplateItem {
  id: string;
  title: string;
  department: string;
  category: string;
  description: string;
  type: ApplicationType;
  tone: ToneType;
  sampleFields: Partial<FormFields>;
  badge: string;
}

export interface DraftItem {
  id: string;
  title: string;
  department: string;
  category: string;
  savedAt: string;
  letterText: string;
  snapshot: {
    type: ApplicationType;
    department: string;
    customDepartment: string;
    category: string;
    customCategory: string;
    tone: ToneType;
    fields: FormFields;
    stamp: StampType;
    fontSize: number;
    lineHeight: number;
  };
}

export type AIAction =
  | 'short'
  | 'long'
  | 'formal'
  | 'simple'
  | 'grammar'
  | 'english'
  | 'hindi'
  | 'legal';
