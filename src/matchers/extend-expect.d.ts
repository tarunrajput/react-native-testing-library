import type { StyleProp } from 'react-native';
import type { TextMatch, TextMatchOptions } from '../matches';
import type { Style } from './to-have-style';

export interface JestNativeMatchers<R> {
  toBeOnTheScreen(): R;
  toBeChecked(): R;
  toBeDisabled(): R;
  toBeBusy(): R;
  toBeEmptyElement(): R;
  toBeEnabled(): R;
  toBePartiallyChecked(): R;
  toBeSelected(): R;
  toBeVisible(): R;
  toHaveDisplayValue(expectedValue: TextMatch, options?: TextMatchOptions): R;
  toHaveProp(name: string, expectedValue?: unknown): R;
  toHaveStyle(style: StyleProp<Style>): R;
  toHaveTextContent(expectedText: TextMatch, options?: TextMatchOptions): R;
}

// Implicit Jest global `expect`.
declare global {
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R, T = {}> extends JestNativeMatchers<R> {}
  }
}

// Explicit `@jest/globals` `expect` matchers.
declare module '@jest/expect' {
  interface Matchers<R extends void | Promise<void>>
    extends JestNativeMatchers<R> {}
}
