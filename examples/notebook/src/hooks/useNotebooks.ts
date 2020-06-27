import { useInstance } from '@objects/hooks';
import { Database } from '../logic/Database';
import { EditorLogic } from '../logic/EditorLogic';
import { NotebookSelectorLogic } from '../logic/NotebookSelectorLogic';
import { useEffect } from 'react';

export const useNotebooks = () => {
  const [database] = useInstance(Database);
  const [editor, resetEditor] = useInstance(EditorLogic, database);
  const [selector, resetSelector] = useInstance(NotebookSelectorLogic, database);

  useEffect(() => {
    database.open();
    editor.saveOnChange();
    selector.fetch();

    return async () => {
      await database.close();
      resetEditor();
      resetSelector();
    };
  }, [database, editor, selector]);

  return {
    editor,
    selector,
  };
};
