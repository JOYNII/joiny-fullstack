import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="mb-12 md:mb-16">
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-gray-900 leading-none">
        {title}
      </h1>
      <p className="mt-2 text-xl md:text-2xl text-gray-500 font-light">
        {subtitle}
      </p>
    </header>
  );
}