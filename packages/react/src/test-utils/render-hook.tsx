import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';

if (typeof globalThis !== 'undefined') {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
}

type HookCallback<TProps, TResult> = (props: TProps) => TResult;

interface RenderHookResult<TResult> {
  current: TResult;
}

interface RenderHookControls<TProps, TResult> {
  result: RenderHookResult<TResult>;
  rerender: (props: TProps) => void;
  unmount: () => void;
}

export function renderTestHook<TProps, TResult>(
  callback: HookCallback<TProps, TResult>,
  initialProps: TProps
): RenderHookControls<TProps, TResult> {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  const result: RenderHookResult<TResult> = {
    current: undefined as unknown as TResult,
  };

  function HookComponent({ props }: { props: TProps }) {
    result.current = callback(props);
    return null;
  }

  const render = (props: TProps) => {
    act(() => {
      root.render(<HookComponent props={props} />);
    });
  };

  render(initialProps);

  return {
    result,
    rerender(nextProps: TProps) {
      render(nextProps);
    },
    unmount() {
      act(() => {
        root.unmount();
      });
      document.body.removeChild(container);
    },
  };
}

export { act };
