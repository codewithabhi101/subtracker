'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Subscriptions() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, []);

  return null;
}