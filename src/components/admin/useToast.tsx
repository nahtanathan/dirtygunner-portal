'use client';

import { useEffect, useState } from 'react';

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 2200);
    return () => clearTimeout(timer);
  }, [message]);
  return { message, showToast: setMessage };
}
