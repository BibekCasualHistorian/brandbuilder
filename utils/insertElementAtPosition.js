function insertElementAtPosition(allDocuments, newElement, newIndex) {
  // Validate newIndex
  if (newIndex < 0 || newIndex > allDocuments.length) {
    console.error("Invalid newIndex: Position out of range");
    return allDocuments; // Return original array if position is invalid
  }

  // Shift indices of elements after the insertion point
  for (let i = allDocuments.length - 1; i >= newIndex; i--) {
    allDocuments[i].index += 1;
  }

  // Insert the new element at the specified position
  allDocuments.splice(newIndex, 0, newElement);

  return allDocuments;
}

module.exports = insertElementAtPosition;
