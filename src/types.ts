import { ReactNode } from 'react';

export interface PageProps<P extends Record<string, string> = {}, SP = {}> {
  params: P;
  searchParams: SP;
}

export interface Page<P extends Record<string, string> = {}, SP = {}> {
  (props: PageProps<P, SP>): ReactNode | Promise<ReactNode>;
}

export interface LayoutProps<P extends Record<string, string> = {}> {
  params: P;
  children: ReactNode;
}

export interface Layout<P extends Record<string, string> = {}> {
  (props: LayoutProps<P>): ReactNode;
}
