import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır.').max(100, 'İsim çok uzun.'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz.').max(15, 'Numara çok uzun.'),
  email: z.string().email('Geçerli bir e-posta giriniz.').optional().or(z.literal('')),
  goal: z.enum(['voleybol', 'fitness', 'kilo-kaybi', 'diger'], {
    message: 'Lütfen geçerli bir hedef seçin.'
  }),
  notes: z.string().max(1000, 'Notlar maksimum 1000 karakter olabilir.').optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
