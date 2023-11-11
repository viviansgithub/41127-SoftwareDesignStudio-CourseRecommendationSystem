export interface Course {
  course_id: string;
  name: string;
  university: string;
  difficulty: string;
  url: string;
  features: Feature[];
}

export interface Feature {
  feature_id: string;
  name: string;
}

export interface BaseFormField {
  label: string;
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
  regex?: RegExp;
  maxLength?: number;
  formatErrorMessage?: string;
}

export interface BaseInputField extends BaseFormField {
  componentType: 'input' | 'select';
  type?: string;
  required?: boolean;
  options?: string[];
}

export interface BaseTagField extends BaseFormField {
  componentType: 'tags';
  excludeTag?: string;
}

export type FormField = BaseInputField | BaseTagField;
