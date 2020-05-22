import React from 'react';
import { EditorLogic } from '../logic/EditorLogic';
import classNames from 'classnames';

import './StyleButton.scss';

export const StyleButton: React.FC<{
  style: string;
  label: string;
  editor: EditorLogic;
}> = ({ style, label, editor }) => {
  return (
    <button
      type="button"
      className={classNames('style-button', {
        enabled: editor.editorState
          .getCurrentInlineStyle()
          .contains(style.toUpperCase()),
      })}
      onClick={() => editor.updateFromCommand(style.toLowerCase())}
    >
      {label}
    </button>
  );
};
