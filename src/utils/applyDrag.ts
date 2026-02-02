interface DragResult<T = unknown> {
  removedIndex: number | null;
  addedIndex: number | null;
  payload: T;
}

const applyDrag = <T = unknown>(arr: T[], dragResult: DragResult<T>): T[] => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr];
  let itemToAdd: T | undefined = payload;

  if (removedIndex !== null) {
    // Validate index before accessing
    if (
      removedIndex >= 0 &&
      removedIndex < result.length
    ) {
      const removed = result.splice(removedIndex, 1);
      if (removed.length > 0) {
        itemToAdd = removed[0];
      }
    } else {
      // Invalid index, use payload as fallback
      itemToAdd = payload;
    }
  }

  if (addedIndex !== null && itemToAdd !== undefined) {
    // Validate index before inserting
    const safeIndex = Math.max(0, Math.min(addedIndex, result.length));
    result.splice(safeIndex, 0, itemToAdd);
  }

  return result;
};

export default applyDrag;
