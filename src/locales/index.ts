import { useStore } from '../stores/useStore';
import { tr } from './tr';
import { en } from './en';

const dictionaries = { tr, en };
export type Dictionary = typeof tr;

export function useTranslation() {
  const { language } = useStore();
  const t = dictionaries[language];
  return { t, language };
}
