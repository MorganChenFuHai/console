/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable max-len */
import { reactive } from 'vue';
import { useField } from 'vee-validate';
import type { DeepRequired } from 'utility-types';
import { get, set } from 'lodash';
import {
  GetKey, KeyValOptions, KeyValRuleExpression, UseFieldReturn,
} from './types';

export * as yup from 'yup';

export const useFieldByProps = <
  T extends object,
  K extends GetKey<DeepRequired<T>>,
  Rules extends KeyValRuleExpression<T, K>,
  Options extends KeyValOptions<T, K>,
  >(props: T, rules?: Rules, options?: Options): UseFieldReturn<T, K> => {
  const formData = reactive(props);
  // const formData = reactive(cloneDeep(props));

  const errorMessage = reactive<Partial<Record<K, string>>>({});
  const originFieldInfo = reactive<Partial<Record<K, string>>>({});
  const fieldErrors = reactive<Partial<Record<K, string[]>>>({});

  const ruleEntry = rules ?? {} as Rules;

  Object.keys(ruleEntry).forEach((key) => {
    const initialValue = get(formData, key);

    // @ts-ignore
    const fieldInfo = useField(key, ruleEntry[key], {
      initialValue,
      // @ts-ignore
      ...(options ? options[key] : {}),
    });

    set(formData, key, fieldInfo.value);
    // @ts-ignore
    errorMessage[key] = fieldInfo.errorMessage;
    // @ts-ignore
    fieldErrors[key] = fieldInfo.errors;
    // @ts-ignore
    originFieldInfo[key] = fieldInfo;
  });

  // @ts-ignore
  return {
  // @ts-ignore
    formData,
    errorMessage,
    fieldErrors,
    // @ts-ignore
    originFieldInfo,
  };
};
