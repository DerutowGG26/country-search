import { debounce } from '../src/debounce.ts';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should delay function execution', async () => {
    const callback = vi.fn();
    const debouncedCallback = debounce(callback, 300);

    debouncedCallback();

    expect(callback).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(300);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should reset the timer when called again', async () => {
    const callback = vi.fn();
    const debouncedCallback = debounce(callback, 300);

    debouncedCallback();

    await vi.advanceTimersByTimeAsync(200);

    debouncedCallback();

    await vi.advanceTimersByTimeAsync(200);

    expect(callback).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(100);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to the original function', async () => {
    const callback = vi.fn();
    const debouncedCallback = debounce(callback, 300);

    debouncedCallback('Spain', 42);

    await vi.advanceTimersByTimeAsync(300);

    expect(callback).toHaveBeenCalledWith('Spain', 42);
  });
});
