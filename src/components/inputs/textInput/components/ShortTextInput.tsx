import { splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

type ShortTextInputProps = {
  ref: any | undefined;
  onInput: (value: string) => void;
  fontSize?: number;
  disabled?: boolean;
} & Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'onInput'>;

export const ShortTextInput = (props: ShortTextInputProps) => {
  const [local, others] = splitProps(props, ['ref', 'onInput']);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && (event.altKey || event.shiftKey)) {
      event.preventDefault();
      const textarea = event.currentTarget as HTMLTextAreaElement;
      const { selectionStart, selectionEnd, scrollHeight } = textarea;
      const value = textarea.value;
      textarea.value = value.slice(0, selectionStart) + '\n' + value.slice(selectionEnd);
      local.onInput(textarea.value);

      // Adjust the height of the textarea to fit the content
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(scrollHeight, 5 * 20)}px`; // Assuming each line is approximately 20px high
      textarea.scrollTop = scrollHeight;
    }
  };

  return (
    <textarea
      ref={props.ref}
      class="focus:outline-none bg-transparent px-4 py-4 flex-1 w-full text-input disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100"
      disabled={props.disabled}
      style={{
        'font-size': props.fontSize ? `${props.fontSize}px` : '16px',
        resize: 'none',
        'min-height': '20px', // height of one line, assuming 20px per line
        'max-height': '100px', // height for 4 lines, assuming 20px per line
        'overflow-y': 'auto', // allow scrolling
      }}
      onInput={(e) => local.onInput(e.currentTarget.value)}
      onKeyDown={handleKeyDown}
      {...(others as any)}
    />
  );
};
