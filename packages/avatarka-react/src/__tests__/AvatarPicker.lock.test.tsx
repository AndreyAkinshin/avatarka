import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { AvatarPicker } from '../AvatarPicker';

/**
 * Lock semantics: locking a field must NOT reset when the user changes that
 * field's value. The lock only affects the Randomize ("dice") button, which
 * must keep the user's chosen value for locked fields.
 */
describe('AvatarPicker — lock survives value changes and is respected by Randomize', () => {
  function firstSelectControl(container: HTMLElement) {
    const grid = container.querySelector('.avatarka-controls-grid') as HTMLElement;
    const select = grid.querySelector('select') as HTMLSelectElement;
    const row = select.closest('.avatarka-control-row') as HTMLElement;
    const lockBtn = row.querySelector('button.avatarka-lock-btn') as HTMLButtonElement;
    return { select, lockBtn };
  }

  function controlByLabel(container: HTMLElement, labelText: string) {
    const groups = Array.from(container.querySelectorAll('.avatarka-control-group'));
    for (const g of groups) {
      const label = g.querySelector('label');
      if (label && label.textContent && label.textContent.startsWith(labelText)) {
        return {
          input: g.querySelector('input, select') as HTMLInputElement | HTMLSelectElement,
          lockBtn: g.querySelector('button.avatarka-lock-btn') as HTMLButtonElement,
        };
      }
    }
    throw new Error(`control not found: ${labelText}`);
  }

  function themeLockBtn(container: HTMLElement) {
    const row = (container.querySelector('.avatarka-theme-dropdown') as HTMLElement)
      .closest('.avatarka-control-row') as HTMLElement;
    return row.querySelector('button.avatarka-lock-btn') as HTMLButtonElement;
  }

  it('keeps the lock after changing a locked field, and Randomize respects the new value', () => {
    const onParamsChange = vi.fn();
    const { container, getByLabelText } = render(
      <AvatarPicker defaultTheme="monsters" onParamsChange={onParamsChange} />,
    );

    // Lock the theme so Randomize keeps the same theme (and thus the same fields).
    fireEvent.click(getByLabelText('Lock Theme'));

    const { select, lockBtn } = firstSelectControl(container);

    // Lock the field.
    fireEvent.click(lockBtn);
    expect(lockBtn.classList.contains('locked')).toBe(true);

    // Change the locked field to a different option.
    const options = Array.from(select.options).map((o) => o.value);
    const next = options.find((o) => o !== select.value);
    expect(next, 'field needs at least two options').toBeTruthy();
    fireEvent.change(select, { target: { value: next } });

    // The value changed AND the lock did not reset.
    expect(select.value).toBe(next);
    expect(firstSelectControl(container).lockBtn.classList.contains('locked')).toBe(true);

    // Randomize: the locked field must keep the user's chosen value.
    fireEvent.click(getByLabelText('Randomize'));

    const after = firstSelectControl(container);
    expect(after.select.value).toBe(next);
    expect(after.lockBtn.classList.contains('locked')).toBe(true);
  });

  it('keeps theme + field locks (and preserves locked field values) on a manual theme change', () => {
    const { container, getByLabelText } = render(<AvatarPicker defaultTheme="people" />);

    // Lock the theme selector.
    fireEvent.click(getByLabelText('Lock Theme'));
    expect(themeLockBtn(container).classList.contains('locked')).toBe(true);

    // Lock the Background Color field (it exists in every theme) and set a value.
    const bg = controlByLabel(container, 'Background Color');
    fireEvent.click(bg.lockBtn);
    fireEvent.change(bg.input, { target: { value: '#abcdef' } });
    expect((bg.input as HTMLInputElement).value).toBe('#abcdef');

    // Manually switch the theme via the dropdown.
    const themeSelect = container.querySelector('.avatarka-theme-dropdown') as HTMLSelectElement;
    fireEvent.change(themeSelect, { target: { value: 'animals' } });
    expect(themeSelect.value).toBe('animals');

    // The theme lock must persist (respecting the user's manual choice).
    expect(themeLockBtn(container).classList.contains('locked')).toBe(true);

    // A locked field that survives the theme change keeps BOTH its lock and its value.
    const bgAfter = controlByLabel(container, 'Background Color');
    expect(bgAfter.lockBtn.classList.contains('locked')).toBe(true);
    expect((bgAfter.input as HTMLInputElement).value).toBe('#abcdef');
  });
});
