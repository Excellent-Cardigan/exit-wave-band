import { useState } from 'react';
import { kirbyFetch } from '../lib/kirby';

type ContactFormStatus = 'idle' | 'sending' | 'sent' | 'error';

interface ContactFormPayload {
  name: string;
  email: string;
  message: string;
}

interface UseContactFormReturn {
  formStatus: ContactFormStatus;
  errorMessage: string | null;
  submitForm: (payload: ContactFormPayload) => Promise<void>;
}

export function useContactForm(): UseContactFormReturn {
  const [formStatus, setFormStatus] = useState<ContactFormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submitForm(payload: ContactFormPayload): Promise<void> {
    setFormStatus('sending');
    setErrorMessage(null);

    try {
      const response = await kirbyFetch<{ ok: boolean; error?: string }>('contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setFormStatus('sent');
      } else {
        setFormStatus('error');
        setErrorMessage(response.error ?? 'Transmission failed. Try again.');
      }
    } catch (fetchError) {
      setFormStatus('error');
      setErrorMessage(fetchError instanceof Error ? fetchError.message : 'Transmission failed. Try again.');
    }
  }

  return { formStatus, errorMessage, submitForm };
}
