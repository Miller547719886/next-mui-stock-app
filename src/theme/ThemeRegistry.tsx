'use client';
import * as React from 'react';
import MuiRegistry from './registry';

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MuiRegistry>
      {children}
    </MuiRegistry>
  );
}